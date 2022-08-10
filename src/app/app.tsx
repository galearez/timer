import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { addRound, removeRound } from './routine-slice';
import { mount } from './mount-countdown-slice';
import { restart } from '../countdown/current-slice';
import Countdown from '../countdown';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

import Icons from '../utils/icons';

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

// this component will handle the user input and will pass main data, rounds (id, label and time)
// to the other components
export default function App() {
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const dispatch = useAppDispatch();
  // these are global states controlled by redux
  let routine = useAppSelector((state) => state.routine.value);
  let currentActivity = useAppSelector((state) => state.current.value);
  let mountCountdown = useAppSelector((state) => state.mountCountdown.value);
  // these states control the current round time
  let [activityMin, setActivityMin] = useState('0');
  let [activitySec, setActivitySec] = useState('0');
  // these states control when the user selects to add a rest after each avtivity
  let [globalRests, setGlobalRests] = useState(false);
  let [minGlobalRest, setMinGlobalRest] = useState('0');
  let [secGlobalRest, setSecGlobalRest] = useState('0');
  // these states control when the user selects to add a rest after the current activity
  let [singleRest, setSingleRest] = useState(false);
  let [secSingleRest, setSecSingleRest] = useState('0');
  // this state is a boolean becuase is used to show the main input form based on the viewport size
  let [activityForm, setActivityForm] = useState(false);
  // this state is meant to unmount the home UI and mount/unmount the countdown component
  let [closeHomeScreen, setCloseHomeScreen] = useState(false);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [activityDefaultName, setActivityDefaultName] = useState(1);

  // user input box references
  let labelRef: React.RefObject<HTMLInputElement> = useRef(null);
  let activityMinRef: React.RefObject<HTMLSelectElement> = useRef(null);
  let activitySecRef: React.RefObject<HTMLSelectElement> = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));

    // unmount the window resize event listener
    return () => {
      window.removeEventListener('resize', () =>
        setScreenWidth(window.innerWidth)
      );
    };
  }, []);

  // when screen resize it will be called to change the screenWidth state which control some responsive rendering
  useEffect(() => {
    if (screenWidth > 767) {
      return setActivityForm(true);
    }

    //if the user shrinks the screen below 768 it will close the activity form component
    if (screenWidth < 768) {
      return setActivityForm(false);
    }
  }, [screenWidth]);

  // just because I don't want to have a big parameter list on 'handleUserInput' I created this
  // type which is meant to be used with rest parameters
  type SelectRefsArray = [
    React.RefObject<HTMLSelectElement>,
    React.RefObject<HTMLSelectElement>
  ];

  // this function get the values from the user and assign them to the routine state
  function handleUserInput(
    event: React.FormEvent<HTMLFormElement>,
    roundId: number,
    label?: React.RefObject<HTMLInputElement>,
    ...selects: SelectRefsArray
  ) {
    event.preventDefault();

    // parse times from strings to integers, since I used a select with only numbers as options
    // there will not be problem on parsing
    const activityMin = parseInt(selects[0].current?.value ?? '0');
    const activitySec = parseInt(selects[1].current?.value ?? '0');
    const restTime = parseInt(secSingleRest ?? '0');

    // convert minutes and seconds to a single time value in seconds
    const activityTime = activityMin * 60 + activitySec;
    if (activityTime === 0) {
      return;
    }

    // after everyting has been parsed and the time is > 0, add activity to the routine
    const activitylabel = label?.current?.value
      ? label?.current?.value
      : `Activity ${roundId}`;
    dispatch(
      addRound({ id: uuidv4(), label: activitylabel, time: activityTime })
    );

    // once a round is created it adds one to the counter
    setActivityDefaultName((prev) => prev + 1);

    // add a rest after the round if the user has one of the add Rest switches enabled, it is like this
    // because that way the user can turn off the global rest if they don't need it between rounds
    if (singleRest && restTime !== 0) {
      dispatch(addRound({ id: uuidv4(), label: 'Rest', time: restTime }));
    }

    // reset the values of the single rests, if there are global rests, they will be reset to that value, if not
    // they will be reset to 0
    setSecSingleRest(secGlobalRest);
    setActivityMin('0');
    setActivitySec('0');
    if (!globalRests) {
      setSingleRest(false);
    } else {
      setSingleRest(true);
    }

    // close the input form modal
    if (screenWidth < 768) {
      setActivityForm(false);
    }
  }

  // this function will handle all the fields where the input can add data, they will only be rendered
  // once the user need them in mobile, in screens > 768, they will be rendered by default and the only
  // conditional rendering will be the other components
  function handleToggleFieldset(
    field: 'globalRests' | 'activityForm' | 'singleRest'
  ) {
    if (field === 'activityForm') return setActivityForm(!activityForm);
    if (field === 'singleRest') return setSingleRest(!singleRest);
    setGlobalRests(!globalRests);
    setSingleRest(!globalRests);
  }

  // this method will delete a round
  function handleDeleteRound(id: string) {
    dispatch(removeRound(id));
  }

  // creates options for the minutes select box
  const sixtyOptions = ONE_BY_ONE.map((elem: number) => (
    <option value={elem} key={elem}>
      {elem}
    </option>
  ));

  // create options for the seconds select box
  const twelveOptions = FIVE_BY_FIVE.map((elem: number) => (
    <option value={elem} key={elem}>
      {elem}
    </option>
  ));

  // this variable is meant to render the routine
  const activitiesList = routine.map((elem: any) => {
    const minutes = Math.floor(elem.time / 60);
    const seconds = elem.time % 60;

    return (
      <div
        key={elem.id}
        className='w-full bg-gray-700 rounded-md p-2 mb-2 flex justify-between items-center flex-nowrap text-lg'>
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
            }}>
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
        )}>
        <header className='flex justify-between items-center'>
          <h1>Timer</h1>
          {!closeHomeScreen ? (
            <button
              className='font-bold text-white py-2 px-4 rounded-md bg-gradient-to-r from-mint to-lime'
              onClick={() => {
                if (routine.length !== 0) {
                  dispatch(mount());
                  setCloseHomeScreen(true);
                }
              }}>
              Start routine
            </button>
          ) : (
            <button
              className='font-bold text-white py-2 px-4 rounded-md bg-gray-700'
              onClick={() => dispatch(restart())}>
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
              <fieldset className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-1 sm:my-2'>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-5'
                    value={5}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-5'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    5 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-10'
                    value={10}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-10'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    10 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-20'
                    value={20}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-20'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    20 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-30'
                    value={30}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-30'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    30 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-45'
                    value={45}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-45'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    45 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='rest'
                    id='rest-60'
                    value={60}
                    onChange={(e) => {
                      setSecGlobalRest(e.target.value);
                      setSecSingleRest(e.target.value);
                    }}
                    hidden
                  />
                  <label
                    htmlFor='rest-60'
                    className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                    1 m
                  </label>
                </div>
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
              }}>
              New Round
            </button>
          </div>
        )}
        {!closeHomeScreen && activityForm && (
          <div className='absolute md:relative top-0 left-0 w-full h-full'>
            <div
              className='absolute md:hidden top-0 left-0 w-full h-full bg-gray-50 bg-opacity-30'
              onClick={() => handleToggleFieldset('activityForm')}></div>
            <form
              className='bg-gray-800 w-11/12 md:w-full p-2 md:p-0 rounded-md absolute md:relative top-1/2 left-1/2 md:top-auto md:left-auto transform -translate-y-1/2 -translate-x-1/2 md:transform-none'
              onSubmit={(event) =>
                handleUserInput(
                  event,
                  activityDefaultName,
                  labelRef,
                  activityMinRef,
                  activitySecRef
                )
              }>
              <h2>Round</h2>
              <fieldset>
                <label className='flex flex-col'>
                  Name
                  <input
                    type='text'
                    className='form-input mt-1'
                    ref={labelRef}
                    placeholder={`Activity ${activityDefaultName}`}
                  />
                </label>
              </fieldset>
              <fieldset className='grid grid-cols-3 sm:grid-cols-6 gap-3 my-3'>
                <div className='rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='acivity-ten'
                    value={10}
                    hidden
                    onChange={() => setActivitySec('10')}
                    checked={activitySec === '10'}
                  />
                  <label
                    htmlFor='acivity-ten'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    10 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='activity-twenty'
                    value={20}
                    hidden
                    onChange={() => setActivitySec('20')}
                    checked={activitySec === '20'}
                  />
                  <label
                    htmlFor='activity-twenty'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    20 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='activity-thirty'
                    value={30}
                    hidden
                    onChange={() => setActivitySec('30')}
                    checked={activitySec === '30'}
                  />
                  <label
                    htmlFor='activity-thirty'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    30 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='activity-forty5'
                    value={45}
                    hidden
                    onChange={() => setActivitySec('45')}
                    checked={activitySec === '45'}
                  />
                  <label
                    htmlFor='activity-forty5'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    45 s
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='activity-sixty'
                    value={60}
                    hidden
                    onChange={() => setActivitySec('60')}
                    checked={activitySec === '60'}
                  />
                  <label
                    htmlFor='activity-sixty'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    1 m
                  </label>
                </div>
                <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
                  <input
                    type='radio'
                    name='activity'
                    id='activity-180'
                    value={180}
                    hidden
                    onChange={() => setActivitySec('180')}
                    checked={activitySec === '180'}
                  />
                  <label
                    htmlFor='activity-180'
                    className='radio block font-semibold text-center py-2 px-4 rounded-lg cursor-pointer'>
                    3 m
                  </label>
                </div>
              </fieldset>
              <fieldset className='bg-gray-700 mb-2 px-2 pb-2 rounded-md'>
                <span className='mt-1 flex justify-between items-center'>
                  <h2>Rest</h2>
                  <label className='toggle-switch '>
                    <input
                      type='checkbox'
                      onChange={() => handleToggleFieldset('singleRest')}
                      checked={singleRest}
                    />
                    <span className='slider'></span>
                  </label>
                </span>
                <div className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-1 sm:mt-2'>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-5'
                      value={5}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '5'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-5'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      5 s
                    </label>
                  </div>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-10'
                      value={10}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '10'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-10'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      10 s
                    </label>
                  </div>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-20'
                      value={20}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '20'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-20'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      20 s
                    </label>
                  </div>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-30'
                      value={30}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '30'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-30'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      30 s
                    </label>
                  </div>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-45'
                      value={45}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '45'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-45'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      45 s
                    </label>
                  </div>
                  <div className=' rounded-lg bg-gray-500 hover:bg-opacity-75'>
                    <input
                      type='radio'
                      name='round-rest'
                      id='round-rest-60'
                      value={60}
                      onChange={(e) => {
                        setSecSingleRest(e.target.value);
                      }}
                      checked={secSingleRest === '60'}
                      hidden
                    />
                    <label
                      htmlFor='round-rest-60'
                      className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
                      1 m
                    </label>
                  </div>
                </div>
              </fieldset>
              <button
                type='submit'
                className='font-bold text-white block w-3/5 py-2 px-4 m-auto rounded-md bg-gradient-to-r from-mint to-lime'>
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
        {closeHomeScreen && (
          <NextActivity currentActivity={currentActivity} routine={routine} />
        )}
      </div>
      <div className='mt-2'>{activitiesList}</div>
    </div>
  );
}

// this variable is meant to show the next round on the routine
interface Activities {
  id: string;
  label: string;
  time: number;
}

interface NextActivityProps {
  currentActivity: number;
  routine: Activities[];
}

function NextActivity(props: NextActivityProps) {
  const { currentActivity, routine } = props;

  if (currentActivity >= routine.length - 1) {
    return <div className='h-20 w-1 mb-4'></div>;
  }
  const elem = routine[currentActivity + 1];
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
}
