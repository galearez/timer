import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { addRound, removeRound } from './countdown/routineSlice';
import { mount } from './countdown/mountCountdownSlice';
import { restart } from './countdown/currentSlice';
import Countdown from './countdown/countdown';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

import Icons from './utils/icons';

//before this change this two arrays where auto-generated on component mounting, but there was a big problem
//it needs to 'update' before generating the options for the select box so when using it on desktop there
//are not options at the start, thats why even if it's annoying I created this two arrays so there
//are options on first rendering
const FIVE_BY_FIVE = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const ONE_BY_ONE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60,
];

interface IRound {
  id: string;
  label: string;
  time: number;
}
//this component will handle the user input and will pass main data, rounds (id, label and time)
//to the other components
function App() {
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const dispatch = useAppDispatch();
  // Component states
  let routine = useAppSelector((state) => state.rotuine.value);
  let currentRound = useAppSelector((state) => state.current.value);
  let mountCountdown = useAppSelector((state) => state.mountCountdown.value);
  let [globalRests, setGlobalRests] = useState(false);
  let [singleRest, setSingleRest] = useState(false);
  let [activityForm, setActivityForm] = useState(false);
  let [roundMin, setRoundMin] = useState(0);
  let [roundSec, setRoundSec] = useState(0);
  let [minGlobalRest, setMinGlobalRest] = useState(0);
  let [secGlobalRest, setSecGlobalRest] = useState(0);
  let [minSingleRest, setMinSingleRest] = useState(0);
  let [secSingleRest, setSecSingleRest] = useState(0);
  let [closeHomeScreen, setCloseHomeScreen] = useState(false);

  // user input box references
  let labelRef: React.RefObject<HTMLInputElement> = useRef(null);
  let roundMinRef: React.RefObject<HTMLSelectElement> = useRef(null);
  let roundSecRef: React.RefObject<HTMLSelectElement> = useRef(null);
  let restMinRef: React.RefObject<HTMLSelectElement> = useRef(null);
  let restSecRef: React.RefObject<HTMLSelectElement> = useRef(null);

  // this variable is meant to be use on naming when the user don't specify a activity name
  let roundDefaultNumber = 1;

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));

    //unmount the window resize event listener
    return () => {
      window.removeEventListener('resize', () =>
        setScreenWidth(window.innerWidth)
      );
    };
  }, []);

  //when screen resize it will be called to change the screenWidth state which control some responsive rendering
  useEffect(() => {
    if (screenWidth > 767 && !activityForm) {
      setActivityForm(true);
      return;
    }

    //if the user shrinks the screen below 768 it will close the activity form component
    if (screenWidth < 768 && activityForm) {
      setActivityForm(false);
      return;
    }
  }, [screenWidth, activityForm]);

  //this function get the values from the user and assign them to the routine state
  function handleUserInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //check if the user wrote a valid string as the round label, if not it will be assigned a default name
    let inputLabel: string = '';
    if (
      labelRef.current?.value === '' ||
      labelRef.current?.value === undefined
    ) {
      inputLabel = 'Round ' + roundDefaultNumber; //default name if the user don't specify one
    }

    //This block of code it's very ugly find a way to make it look beautiful
    let inputMin = roundMinRef.current?.value;
    let inputSec = roundSecRef.current?.value;
    let inputRestMin = restMinRef.current?.value;
    let inputRestSec = restSecRef.current?.value;
    if (
      inputMin === undefined ||
      inputSec === undefined ||
      inputRestMin === undefined ||
      inputRestSec === undefined
    ) {
      return;
    }

    //convert the string values to numbers
    const timeActivityMin = parseInt(inputMin);
    const timeActivitySec = parseInt(inputSec);
    const timeRestMin = parseInt(inputRestMin);
    const timeRestSec = parseInt(inputRestSec);

    //convert the activity time to seconds
    const timeActivity = timeActivityMin * 60 + timeActivitySec;
    const timeRest = timeRestMin * 60 + timeRestSec;

    //if there is no time for an activity it will not create a routine round
    if (timeActivity === 0) {
      return;
    }
    let pruebita: IRound[] = [];
    pruebita.push({ id: uuidv4(), label: inputLabel, time: timeActivity });
    //only the values that met the conditions will be assigned to the user routine
    //label must be a valid string
    //time must be an integer between 0 and 60
    dispatch(addRound({ id: uuidv4(), label: inputLabel, time: timeActivity }));

    //once a round is created it adds one to the counter
    roundDefaultNumber++;

    //add a rest after the round if the user has one of the add Rest switch enabled, this is like this
    //because that way the user can turn off the global rest if they don't need it between rounds
    if (singleRest) {
      dispatch(addRound({ id: uuidv4(), label: 'Rest', time: timeRest }));
    }

    //reset the values of the single rests, if there are global rests, they will be reset to that value, if not
    //they will be reset to 0

    setMinSingleRest(minGlobalRest);
    setSecSingleRest(secGlobalRest);
    setRoundMin(0);
    setRoundSec(0);

    //close the input form modal
    if (screenWidth < 768) {
      setActivityForm(false);
    }
  }

  //when the user start the countdown the first time it will unmount all the 'home screen' elements
  function handleHomeClose() {
    setCloseHomeScreen(true);
  }

  //this function will handle all the fields where the input can add data, they will only be rendered
  //once the user need them in mobile, in screens > 768, they will be rendered by default and the only
  //conditional rendering will be the other components
  function handleToggleFieldset(field: string) {
    switch (field) {
      case 'globalRests':
        setGlobalRests(!globalRests);
        setSingleRest(!globalRests);
        break;
      case 'activityForm':
        setActivityForm(!activityForm);
        break;
      case 'singleRest':
        setSingleRest(!singleRest);
        break;
      default:
        break;
    }
  }

  //handle global rest select value, and also single rests to show that they will be added
  function handleMinGlobalRestChange(e: any) {
    setMinGlobalRest(e.target.value);
    setMinSingleRest(e.target.value);
  }

  //handle global rest select value, and also single rests to show that they will be added
  function handleSecGlobalRestChange(e: any) {
    setSecGlobalRest(e.target.value);
    setSecSingleRest(e.target.value);
  }

  //handle round minutes
  function handleRoundMinChange(e: any) {
    setRoundMin(e.target.value);
  }

  //handle round seconds
  function handleRoundSecChange(e: any) {
    setRoundSec(e.target.value);
  }

  //handle single rest select value
  function handleMinSingleRestChange(e: any) {
    setMinSingleRest(e.target.value);
  }

  //handle single rest select value
  function handleSecSingleRestChange(e: any) {
    setSecSingleRest(e.target.value);
  }

  //this method will delete a round
  function handleDeleteRound(id: string) {
    dispatch(removeRound(id));
  }

  //creates options for the minutes select box
  const sixtyOptions = ONE_BY_ONE.map((elem: number) => (
    <option value={elem} key={elem}>
      {elem}
    </option>
  ));

  //create options for the seconds select box
  const twelveOptions = FIVE_BY_FIVE.map((elem: number) => (
    <option value={elem} key={elem}>
      {elem}
    </option>
  ));

  //this variable is meant to show the next round on the routine
  const nextActivity = () => {
    if (currentRound >= routine.length - 1) {
      return <div className='h-20 w-1 mb-4'></div>;
    }
    const elem = routine[currentRound + 1];
    const minutes = Math.floor(elem.time / 60);
    const seconds = elem.time % 60;

    return (
      <div className='bg-gray-700 rounded-md mb-4'>
        <h2 className='pt-2 px-2'>Next</h2>

        <div className='w-full p-2 flex justify-between items-center flex-nowrap text-lg'>
          <span>{elem.label}</span>
          <div className='flex items-center'>
            <span>
              {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
              {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
            </span>
          </div>
        </div>
      </div>
    );
  };

  //this variable is meant to render the routine
  const activitiesList = routine.map((elem: any) => {
    const minutes = Math.floor(elem.time / 60);
    const seconds = elem.time % 60;

    return (
      <div
        key={elem.id}
        className='w-full bg-gray-700 rounded-md p-2 mb-2 flex justify-between items-center flex-nowrap text-lg'
      >
        <span>{elem.label}</span>
        <div className='flex items-center'>
          <span>
            {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
            {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
          </span>
          <span
            className='inline-block ml-3'
            onClick={() => {
              handleDeleteRound(elem.id);
            }}
          >
            <Icons value={'delete'} />
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className='w-full max-w-xl m-auto md:grid grid-cols-1'>
      <div
        className={clsx(
          'flex flex-col justify-between',
          closeHomeScreen ? 'h-screen' : 'h-auto'
        )}
      >
        <header className='flex justify-between items-center'>
          <h1>Timer</h1>
          {!closeHomeScreen ? (
            <button
              className='font-bold text-white py-2 px-4 rounded-md bg-gradient-to-r from-mint to-lime'
              onClick={() => {
                if (routine.length !== 0) {
                  dispatch(mount());
                  handleHomeClose();
                }
              }}
            >
              Start routine
            </button>
          ) : (
            <button
              className='font-bold text-white py-2 px-4 rounded-md bg-gray-700'
              onClick={() => dispatch(restart())}
            >
              Restart all <Icons value={'restore'} />
            </button>
          )}
        </header>
        {!closeHomeScreen && (
          <form className='w-full md:mt-2 flex flex-col'>
            <fieldset className='text-lg mt-2 flex justify-between items-center'>
              <h2>Repeat rest</h2>
              <label className='toggle-switch'>
                <input
                  type='checkbox'
                  onChange={() => handleToggleFieldset('globalRests')}
                  defaultChecked={globalRests}
                />
                <span className='slider'></span>
              </label>
            </fieldset>
            {globalRests && (
              <fieldset className='flex items-end'>
                <label className='flex flex-col flex-1 mr-1'>
                  Minutes
                  <select
                    value={minGlobalRest}
                    className='form-select flex-none'
                    onChange={handleMinGlobalRestChange}
                    disabled={!globalRests}
                  >
                    {sixtyOptions}
                  </select>
                </label>
                <label className='flex flex-col flex-1'>
                  Seconds
                  <select
                    value={secGlobalRest}
                    className='form-select flex-none'
                    onChange={handleSecGlobalRestChange}
                    disabled={!globalRests}
                  >
                    {twelveOptions}
                  </select>
                </label>
              </fieldset>
            )}
          </form>
        )}
        {!closeHomeScreen && (
          <div>
            <hr className='w-9/12 m-auto mt-2 md:my-2' />
            <button
              className='font-bold block md:hidden w-3/5 text-white py-2 px-4 m-auto mt-2 rounded-md bg-gray-600'
              onClick={() => {
                handleToggleFieldset('activityForm');
                if (globalRests) {
                  setSingleRest(true);
                }
              }}
            >
              New Round
            </button>
          </div>
        )}
        {!closeHomeScreen && activityForm && (
          <div className='absolute md:relative top-0 left-0 w-full h-full'>
            <div
              className='absolute md:hidden top-0 left-0 w-full h-full bg-gray-50 bg-opacity-30'
              onClick={() => handleToggleFieldset('activityForm')}
            ></div>
            <form
              className='bg-gray-800 w-11/12 md:w-full p-2 md:p-0 rounded-md absolute md:relative top-1/2 left-1/2 md:top-auto md:left-auto transform -translate-y-1/2 -translate-x-1/2 md:transform-none'
              onSubmit={handleUserInput}
            >
              <h2>Round</h2>
              <fieldset>
                <label className='flex flex-col'>
                  Name
                  <input
                    type='text'
                    className='form-input mt-1'
                    ref={labelRef}
                    placeholder={'Round ' + roundDefaultNumber}
                  />
                </label>
              </fieldset>
              <fieldset className='flex items-end mb-2'>
                <label className='flex flex-col flex-1 mr-1'>
                  Minutes
                  <select
                    className='form-select flex-none'
                    ref={roundMinRef}
                    onChange={handleRoundMinChange}
                    value={roundMin}
                  >
                    {sixtyOptions}
                  </select>
                </label>
                <label className='flex flex-col flex-1'>
                  Seconds
                  <select
                    className='form-select flex-none'
                    ref={roundSecRef}
                    onChange={handleRoundSecChange}
                    value={roundSec}
                  >
                    {twelveOptions}
                  </select>
                </label>
              </fieldset>
              <fieldset className='bg-gray-700 mb-2 px-1 rounded-md'>
                <span className='mt-1 flex justify-between items-center'>
                  <h2>Rest</h2>
                  <label className='toggle-switch '>
                    <input
                      type='checkbox'
                      onClick={() => handleToggleFieldset('singleRest')}
                      checked={singleRest}
                    />
                    <span className='slider'></span>
                  </label>
                </span>
                <span className='flex items-end mb-2'>
                  <label className='flex flex-col flex-1 mr-1'>
                    Minutes
                    <select
                      className='form-select flex-none'
                      ref={restMinRef}
                      value={minSingleRest}
                      onChange={handleMinSingleRestChange}
                      disabled={!singleRest}
                    >
                      {sixtyOptions}
                    </select>
                  </label>
                  <label className='flex flex-col flex-1'>
                    Seconds
                    <select
                      className='form-select flex-none'
                      ref={restSecRef}
                      value={secSingleRest}
                      onChange={handleSecSingleRestChange}
                      disabled={!singleRest}
                    >
                      {twelveOptions}
                    </select>
                  </label>
                </span>
              </fieldset>
              <button
                type='submit'
                className='font-bold text-white block w-3/5 py-2 px-4 m-auto rounded-md bg-gradient-to-r from-mint to-lime'
              >
                Add round
              </button>
            </form>
          </div>
        )}
        {closeHomeScreen && (
          <div>
            {mountCountdown ? (
              <Countdown />
            ) : (
              <div className='font-bold text-4xl md:text-6xl h-80 flex flex-col justify-center items-center'>
                Completed!
              </div>
            )}
          </div>
        )}
        {closeHomeScreen && nextActivity()}
      </div>
      <div className='mt-2'>{activitiesList}</div>
    </div>
  );
}

export default App;
