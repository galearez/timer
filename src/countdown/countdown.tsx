import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { next } from './current-slice';
import { unmount } from '../app/mount-countdown-slice';
import TimerControls from './timer-controls';

export default function Countdown() {
  const dispatch = useAppDispatch();
  const routine = useAppSelector((state) => state.routine.value);
  let currentActivity = useAppSelector((state) => state.current.value);

  const time = routine ? routine[0].time : 0;
  const label = routine[currentActivity]?.label;
  let [countdownTime, setCountdownTime] = useState(time);
  let [minutes, setMinutes] = useState(Math.floor(time / 60));
  let [seconds, setSeconds] = useState(time % 60);

  // this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  let interval = useRef<number>();
  const ONE_SECOND = 1000;
  let [expectedTime, setExpectedTime] = useState(Date.now() + ONE_SECOND);
  let [intervalTime, setIntervalTime] = useState(ONE_SECOND);

  // once the component mounts it will start a countdown, the original value is the one passed as a prop to
  // the component and it will run until the 'countdownTime' is 0
  useEffect(() => {
    interval.current = window.setInterval(() => {
      let drift = Date.now() - expectedTime;
      if (drift > ONE_SECOND) {
        clearInterval(interval.current);
        return (
          window.confirm(
            'Something went wrong. \n Do you you want to refresh your tab?'
          ) && window.location.reload()
        );
      }

      if (countdownTime <= 0) {
        dispatch(next());
        return clearInterval(interval.current);
      }

      setCountdownTime(countdownTime - 1);
      setExpectedTime((prevState) => prevState + ONE_SECOND);
      setIntervalTime(Math.max(0, intervalTime - drift));
    }, intervalTime);

    return () => {
      clearInterval(interval.current);
    };
  }, [countdownTime, dispatch, intervalTime, expectedTime, ONE_SECOND]);

  useEffect(() => {
    setMinutes(Math.floor(countdownTime / 60));
    setSeconds(countdownTime % 60);
  }, [countdownTime]);

  useEffect(() => {
    if (currentActivity < routine.length) {
      setExpectedTime(Date.now() + ONE_SECOND);
      setCountdownTime(routine[currentActivity].time);
    }

    if (currentActivity >= routine.length) {
      dispatch(unmount());
    }
  }, [currentActivity, routine, dispatch]);

  const setCurrentActivityTime = useCallback(() => {
    setCountdownTime(routine[currentActivity].time);
  }, [setCountdownTime, routine, currentActivity]);

  const substractOneSecond = useCallback(() => {
    setCountdownTime(countdownTime - 1);
  }, [setCountdownTime, countdownTime]);

  const clearIntervalCallback = useCallback(() => {
    clearInterval(interval.current);
  }, [interval]);

  const setExpectedTimeCallback = useCallback(() => {
    setExpectedTime(Date.now() + ONE_SECOND);
  }, [setExpectedTime]);

  return (
    <div className='font-bold h-80 flex flex-col justify-center items-center'>
      <div className='text-2xl md:text-4xl'>{label}</div>
      <div className='text-6xl md:text-8xl mb-10'>
        <span>
          {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
          {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
        </span>
      </div>
      <TimerControls
        routineLength={routine.length}
        setCurrentActivityTime={setCurrentActivityTime}
        substractOneSecond={substractOneSecond}
        clearIntervalCallback={clearIntervalCallback}
        setExpectedTimeCallback={setExpectedTimeCallback}
      />
    </div>
  );
}
