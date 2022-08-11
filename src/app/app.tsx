import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { mount } from './mount-countdown-slice';
import { restart } from '../countdown/current-slice';
import Countdown from '../countdown';
import GlobalRestForm from './global-rest-form';
import AddNewRound from './round-form';
import ActivitiesList from './activities-list';
import clsx from 'clsx';

import Icons from '../utils/icons';

// this component will handle the user input and will pass main data, rounds (id, label and time)
// to the other components
export default function App() {
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const dispatch = useAppDispatch();
  // these are global states controlled by redux
  let routine = useAppSelector((state) => state.routine.value);
  let currentActivity = useAppSelector((state) => state.current.value);
  let mountCountdown = useAppSelector((state) => state.mountCountdown.value);
  // these states control when the user selects to add a rest after each avtivity
  let [globalRests, setGlobalRests] = useState(false);
  let [secGlobalRest, setSecGlobalRest] = useState('0');
  // these states control when the user selects to add a rest after the current activity
  let [singleRest, setSingleRest] = useState(false);
  let [secSingleRest, setSecSingleRest] = useState('0');
  // this state is a boolean becuase is used to show the main input form based on the viewport size
  let [activityForm, setActivityForm] = useState(false);
  // this state is meant to unmount the home UI and mount/unmount the countdown component
  let [closeHomeScreen, setCloseHomeScreen] = useState(false);

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

  useEffect(() => {
    setSecSingleRest(secGlobalRest);
  }, [setSecGlobalRest, secGlobalRest]);

  // this callback will toggle the round rest form from the GlobalRestForm component
  const setSingleRestCallback = useCallback(
    (isOpen: boolean) => {
      setGlobalRests(isOpen);
      setSingleRest(isOpen);
    },
    [setSingleRest, setGlobalRests]
  );

  // this callback will pass the value selected from GlobalRestForm to the round form to add a new round
  const setRestTimeCallback = useCallback(
    (time: string) => {
      setSecGlobalRest(time);
    },
    [setSecGlobalRest]
  );

  //
  const closeActivityFormCallback = useCallback(() => {
    if (screenWidth < 768) {
      setActivityForm(false);
    }
  }, [setActivityForm, screenWidth]);

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
          <GlobalRestForm
            setRestTime={setRestTimeCallback}
            showSingleRest={setSingleRestCallback}
          />
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
          <AddNewRound
            globalRest={globalRests}
            globalRestTime={secSingleRest}
            closeActivityForm={closeActivityFormCallback}
          />
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
      <div className='mt-2'>
        <ActivitiesList activities={routine} />
      </div>
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
