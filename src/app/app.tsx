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

// this context will pass the control of the rest states to the global rest component
export const RestContext = React.createContext({
  active: false,
  time: '0',
  setActive: (value: boolean) => {},
  setTime: (time: string) => {},
});

// this context will pass read-only values to the add round form to set the default state of the rest time
export const GlobalRestContext = React.createContext({
  active: false,
  time: '0',
});

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
  let [restActive, setRestActive] = useState(false);
  let [restTime, setRestTime] = useState('0');
  // this state is a boolean becuase is used to show the main input form based on the viewport size
  let [addRoundFormActive, setAddRoundFormActive] = useState(false);
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
      return setAddRoundFormActive(true);
    }

    //if the user shrinks the screen below 768 it will close the activity form component
    if (screenWidth < 768) {
      return setAddRoundFormActive(false);
    }
  }, [screenWidth]);

  // this callback is meant to close the add round form once the user adds a new round in screens < sm
  const closeActivityFormCallback = useCallback(() => {
    if (screenWidth < 768) {
      setAddRoundFormActive(false);
    }
  }, [setAddRoundFormActive, screenWidth]);

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
          <RestContext.Provider
            value={{
              active: restActive,
              time: restTime,
              setActive: setRestActive,
              setTime: setRestTime,
            }}>
            <GlobalRestForm />
          </RestContext.Provider>
        )}
        {!closeHomeScreen && (
          <div>
            <hr className='w-9/12 m-auto mt-2 md:my-2' />
            <button
              className='font-bold block md:hidden w-3/5 text-white py-2 px-4 m-auto mt-2 rounded-md bg-gray-600'
              onClick={() => {
                setAddRoundFormActive(!addRoundFormActive);
              }}>
              New Round
            </button>
          </div>
        )}
        {!closeHomeScreen && addRoundFormActive && (
          <GlobalRestContext.Provider
            value={{
              active: restActive,
              time: restTime,
            }}>
            <AddNewRound closeActivityForm={closeActivityFormCallback} />
          </GlobalRestContext.Provider>
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
