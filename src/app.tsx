import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from './hooks';
import Countdown from './countdown';
import GlobalRestForm from './global-rest-form';
import AddNewRound from './app/round-form';
import ActivitiesList from './activities-list';
import clsx from 'clsx';

import NextActivity from './app/next-activity';
import NavBar from './navbar';

type DefaultTimeOptions = '0' | '5' | '10' | '20' | '30' | '45' | '60' | '180';

interface RestContextTypes {
  active: boolean;
  time: DefaultTimeOptions;
  setActive: (v: boolean) => void;
  setTime: (t: DefaultTimeOptions) => void;
}

// this context will pass the control of the rest states to the global rest component
export const RestContext = React.createContext<RestContextTypes>({
  active: false,
  time: '0',
  setActive: (value: boolean) => {},
  setTime: (time: DefaultTimeOptions) => {},
});

// this context will pass read-only values to the add round form to set the default state of the rest time
export const GlobalRestContext = React.createContext<{
  active: boolean;
  time: DefaultTimeOptions;
}>({
  active: false,
  time: '0',
});

type ViewsType = 'home' | 'countdown';

interface ViewContextTypes {
  current: ViewsType;
  set: (s: ViewsType) => void;
}

export const ViewContext = React.createContext<ViewContextTypes>({
  current: 'home',
  set: () => {},
});

// this component will handle the user input and will pass main data, rounds (id, label and time)
// to the other components
export default function App() {
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // these are global states controlled by redux
  let routine = useAppSelector((state) => state.routine.value);
  let currentActivity = useAppSelector((state) => state.current.value);
  let mountCountdown = useAppSelector((state) => state.mountCountdown.value);
  // these states control when the user selects to add a rest after each avtivity
  let [restActive, setRestActive] = useState(false);
  let [restTime, setRestTime] = useState<DefaultTimeOptions>('0');
  // this state is a boolean becuase is used to show the main input form based on the viewport size
  let [addRoundFormActive, setAddRoundFormActive] = useState(false);
  // this state is meant to unmount the home UI and mount/unmount the countdown component
  let [view, setView] = useState<ViewsType>('home');

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
          view === 'countdown' ? 'h-screen' : 'h-auto'
        )}>
        <ViewContext.Provider value={{ current: view, set: setView }}>
          <NavBar />
        </ViewContext.Provider>
        {view === 'home' && (
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
        {view === 'home' && (
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
        {view === 'home' && addRoundFormActive && (
          <GlobalRestContext.Provider
            value={{
              active: restActive,
              time: restTime,
            }}>
            <AddNewRound closeActivityForm={closeActivityFormCallback} />
          </GlobalRestContext.Provider>
        )}
        {view === 'countdown' && (
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
        {view === 'countdown' && (
          <NextActivity currentActivity={currentActivity} routine={routine} />
        )}
      </div>
      <div className='mt-2'>
        <ActivitiesList activities={routine} />
      </div>
    </div>
  );
}
