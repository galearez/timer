import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { next, previous } from './current-slice';

import Icons from '../utils/icons';

interface ButtonControlsProps {
  routineLength: number;
  setCurrentActivityTime: () => void;
  substractOneSecond: () => void;
  clearIntervalCallback: () => void;
  setExpectedTimeCallback: () => void;
}

export default function TimerControls(props: ButtonControlsProps) {
  const dispatch = useAppDispatch();
  let currentActivity = useAppSelector((state) => state.current.value);

  // this enum will ensure the buttonState is a string of 3 possible values
  type ButtonDisable = 'left' | 'none' | 'right';
  let [disableButton, setDisableButton] = useState<ButtonDisable>('left');
  let disableAllMoveButtons = props.routineLength === 1;
  let [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentActivity === props.routineLength - 1)
      return setDisableButton('right');
    if (currentActivity === 0) return setDisableButton('left');
    setDisableButton('none');
  }, [setDisableButton, currentActivity, props.routineLength]);

  // this useEffect will be listening to the changes on 'currentActivity', each
  // execution will mean the user change the current activity so it will set the
  // isPaused state to 'true' to render the button correctly
  useEffect(() => {
    setIsPaused(false);
  }, [currentActivity]);

  // this function will remove the setInterval to stop the countdown
  function stopCountdown() {
    props.clearIntervalCallback();
    setIsPaused(true);
  }

  // this function will restart the countdown
  function resumeCountdown() {
    setIsPaused(false);
    let resume: number = window.setTimeout(() => {
      props.substractOneSecond();
      props.setExpectedTimeCallback();
      return clearTimeout(resume);
    }, 1000);
  }

  // this function will restart the current activity
  function restartActivity() {
    setIsPaused(false);
    props.setCurrentActivityTime();
    props.setExpectedTimeCallback();
  }

  // this function will unmount the current activity and will mount the next activity if there is one
  function nextActivity() {
    dispatch(next());
  }

  // this function will unmount the current activity and will mount the previous activity if there is one
  function previousActivity() {
    dispatch(previous());
  }

  return (
    <div className='w-full max-w-md flex justify-around items-center'>
      {!disableAllMoveButtons && (
        <button
          className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
          disabled={disableButton === 'left'}
          onClick={previousActivity}>
          <Icons value={'previous'} disable={disableButton === 'left'} />
        </button>
      )}

      <button
        className='rounded-full w-14 h-14 bg-gray-700'
        onClick={restartActivity}>
        <Icons value={'replay'} />
      </button>
      {isPaused ? (
        <button
          className='rounded-full w-16 h-16 bg-mint'
          onClick={resumeCountdown}>
          <Icons value={'play'} />
        </button>
      ) : (
        <button
          className='rounded-full w-16 h-16 bg-gray-700'
          onClick={stopCountdown}>
          <Icons value={'pause'} />
        </button>
      )}
      {!disableAllMoveButtons && (
        <button
          className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
          disabled={disableButton === 'right'}
          onClick={nextActivity}>
          <Icons value={'next'} disable={disableButton === 'right'} />
        </button>
      )}
    </div>
  );
}
