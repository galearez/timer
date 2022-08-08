import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { next, previous, restart } from './currentSlice';
import { unmount } from './mountCountdownSlice';

import Icons from '../utils/icons';

// this type will ensure the buttonState is a number with 3 possible values
type ButtonDisable = 'left' | 'none' | 'right';

function Countdown() {
  const dispatch = useAppDispatch();

  const routine = useAppSelector((state) => state.rotuine.value);
  let currentActivity = useAppSelector((state) => state.current.value);

  const time = routine ? routine[0].time : 0;
  const label = routine[currentActivity]?.label;
  let [countdownTime, setCountdownTime] = useState(time);
  let [minutes, setMinutes] = useState(Math.floor(time / 60));
  let [seconds, setSeconds] = useState(time % 60);
  let [isPaused, setIsPaused] = useState(false);
  let [disableButton, setDisableButton] = useState<ButtonDisable>('left');
  let disableAllMoveButtons = routine.length === 1;

  // this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  let interval = useRef<number>();
  const oneSecond = 1000;
  let [expectedTime, setExpectedTime] = useState(Date.now() + oneSecond);
  let [intervalTime, setIntervalTime] = useState(oneSecond);

  // once the component mounts it will start a countdown, the original value is the one passed as a prop to
  // the component and it will run until the 'countdownTime' is 0
  useEffect(() => {
    interval.current = window.setInterval(() => {
      let drift = Date.now() - expectedTime;
      if (drift > oneSecond) {
        clearInterval(interval.current);
        window.confirm(
          'Something went wrong. \n Do you you want to refresh your tab?'
        ) && window.location.reload();
        return;
      }

      if (countdownTime <= 0) {
        dispatch(next());
        clearInterval(interval.current);
      }

      setCountdownTime(countdownTime - 1);
      setExpectedTime((prevState) => prevState + oneSecond);
      setIntervalTime(Math.max(0, intervalTime - drift));
    }, intervalTime);

    return () => {
      clearInterval(interval.current);
    };
  }, [countdownTime, dispatch, intervalTime, expectedTime, oneSecond]);

  useEffect(() => {
    setMinutes(Math.floor(countdownTime / 60));
    setSeconds(countdownTime % 60);
  }, [countdownTime]);

  useEffect(() => {
    if (currentActivity < routine.length) {
      setExpectedTime(Date.now() + oneSecond);
      setCountdownTime(routine[currentActivity].time);
    }

    if (currentActivity >= routine.length) {
      dispatch(unmount());
    }

    if (currentActivity === routine.length - 1) {
      setDisableButton('right');
    } else if (currentActivity === 0) {
      setDisableButton('left');
    } else {
      setDisableButton('none');
    }
  }, [currentActivity, routine, dispatch]);

  // this function will remove the setInterval to stop the countdown
  function stopCountdown() {
    clearInterval(interval.current);
    setIsPaused(true);
  }

  // this function will restart the countdown
  function resumeCountdown() {
    setIsPaused(false);
    let resume: any = setTimeout(() => {
      setCountdownTime(countdownTime - 1);
      setExpectedTime(Date.now() + oneSecond);

      return clearTimeout(resume);
    }, 1000);
  }

  // this function will restart the current activity
  function restartActivity() {
    dispatch(restart());
    setCountdownTime(routine[currentActivity].time);
    setExpectedTime(Date.now() + oneSecond);
  }

  // this function will unmount the current activity and will mount the next activity if there is one
  function nextActivity() {
    dispatch(next());
    if (isPaused) {
      setIsPaused(false);
    }
  }

  // this function will unmount the current activity and will mount the previous activity if there is one
  function previousActivity() {
    dispatch(previous());
    setCountdownTime(routine[currentActivity].time);
    if (isPaused) {
      setIsPaused(false);
    }
  }

  return (
    <div className='font-bold h-80 flex flex-col justify-center items-center'>
      <div className='text-2xl md:text-4xl'>{label}</div>
      <div className='text-6xl md:text-8xl mb-10'>
        <span>
          {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
          {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
        </span>
      </div>
      <div className='w-full max-w-md flex justify-around items-center'>
        {!disableAllMoveButtons && (
          <button
            className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
            disabled={disableButton === 'left'}
            onClick={previousActivity}
          >
            <Icons value={'previous'} disable={disableButton === 'left'} />
          </button>
        )}

        <button
          className='rounded-full w-14 h-14 bg-gray-700'
          onClick={restartActivity}
        >
          <Icons value={'replay'} />
        </button>
        {isPaused ? (
          <button
            className='rounded-full w-16 h-16 bg-mint'
            onClick={resumeCountdown}
          >
            <Icons value={'play'} />
          </button>
        ) : (
          <button
            className='rounded-full w-16 h-16 bg-gray-700'
            onClick={stopCountdown}
          >
            <Icons value={'pause'} />
          </button>
        )}
        {!disableAllMoveButtons && (
          <button
            className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
            disabled={disableButton === 'right'}
            onClick={nextActivity}
          >
            <Icons value={'next'} disable={disableButton === 'right'} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Countdown;
