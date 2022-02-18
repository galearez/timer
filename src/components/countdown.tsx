import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { next, previous, restart } from '../countdown/currentSlice';
import { unmount } from '../countdown/mountCountdownSlice';

import Icons from './icons';

interface ICountdownProps {
  //to show the move buttons depending on the current round and the size of the routine array
  buttonsToMove: number;
  //if the routine is to short, maybe one round, we don't need buttons to move over the rounds
  disbaleMoveButtons?: boolean;
}

// Yasta solo limpio y ya quedó el primer functional component, Noice
function Countdown(props: ICountdownProps) {
  const dispatch = useAppDispatch();

  const routine = useAppSelector((state) => state.rotuine.value);
  let currentRound = useAppSelector((state) => state.current.value);

  const time = routine ? routine[0].time : 0;
  const label = routine[currentRound]?.label;
  let [countdownTime, setCountdownTime] = useState(time);
  let [minutes, setMinutes] = useState(Math.floor(time / 60));
  let [seconds, setSeconds] = useState(time % 60);
  let [isPaused, setIsPaused] = useState(false);

  //this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  let interval = useRef<number>();

  //once the component mounts it will start a countdown, the original value is the one passed as a prop to
  //the component and it will run until the 'countdownTime' is 0
  useEffect(() => {
    interval.current = window.setInterval(() => {
      if (countdownTime <= 0) {
        dispatch(next());
        clearInterval(interval.current);
      } else {
        setCountdownTime(countdownTime - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, [countdownTime, dispatch]);

  useEffect(() => {
    setMinutes(Math.floor(countdownTime / 60));
    setSeconds(countdownTime % 60);
  }, [countdownTime]);

  useEffect(() => {
    if (currentRound < routine.length) {
      setCountdownTime(routine[currentRound].time);
    }

    if (currentRound >= routine.length) {
      dispatch(unmount());
    }
  }, [currentRound, routine, dispatch]);

  //this function will remove the setInterval to stop the countdown
  function stopCountdown() {
    clearInterval(interval.current);
    setCountdownTime(0);
    setIsPaused(true);
  }

  //this function will restart the countdown
  function resumeCountdown() {
    setIsPaused(false);
    setCountdownTime(time);
  }

  //this function will restart the current round
  function restartRound() {
    dispatch(restart());
    setCountdownTime(routine[currentRound].time);
  }

  //this function will unmount the current round and will mount the next round if there is one
  function nextRound() {
    dispatch(next());
  }

  //this function will unmount the current round and will mount the previous round if there is one
  function previousRound() {
    dispatch(previous());
    setCountdownTime(routine[currentRound].time);
  }

  //the buttons will now be controlled by the component, since I now moved the logic to navigate through
  //the routine to this component instead of the timer component

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
        {!props.disbaleMoveButtons && (
          <button
            className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
            disabled={props.buttonsToMove === -1}
            onClick={previousRound}
          >
            <Icons value={'previous'} disable={props.buttonsToMove === -1} />
          </button>
        )}

        <button
          className='rounded-full w-14 h-14 bg-gray-700'
          onClick={restartRound}
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
        {!props.disbaleMoveButtons && (
          <button
            className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
            disabled={props.buttonsToMove === 1}
            onClick={nextRound}
          >
            <Icons value={'next'} disable={props.buttonsToMove === 1} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Countdown;
