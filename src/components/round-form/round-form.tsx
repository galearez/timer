import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { addRound } from '../../app/routine-slice';
import { v4 as uuidv4 } from 'uuid';
import { GlobalRestContext } from '../../app';
import TimeButtons from '../time-buttons';
import { TimeContext } from '../../app/time-context';
import type {
  DefaultTimeOptions,
  GlobalRestConextTypes,
} from '../../@types/context';
interface AddNewRoundProps {
  closeActivityForm: () => void;
}

// crear un reducer para activity default name, porque no está guardando el valor en moviles

export default function AddNewRound(props: AddNewRoundProps) {
  const dispatch = useAppDispatch();

  // this context will hold read-only values of the state of the global rest
  const globalRest = useContext(GlobalRestContext) as GlobalRestConextTypes;
  // this state is meant to be use on naming when the user don't specify an activity name
  let [activityDefaultName, setActivityDefaultName] = useState(1);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [roundTime, setRoundTime] = useState<DefaultTimeOptions>('0');
  // we want to turn on round rest if the user have global rest also turned on
  let [restActive, setRestActive] = useState(globalRest.active);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [restTime, setRestTime] = useState<DefaultTimeOptions>(globalRest.time);

  // iinpu box ref for the name of the activity also called label
  let labelRef: React.RefObject<HTMLInputElement> = useRef(null);

  // this function get the values from the user and assign them to the routine state
  function handleUserInput(
    event: React.FormEvent<HTMLFormElement>,
    roundId: number,
    label?: React.RefObject<HTMLInputElement>
  ) {
    event.preventDefault();

    // parse times from strings to integers, since I used a radio buttons with string of numbers
    // as values there will not be problem on parsing
    const activityTime = parseInt(roundTime ?? '0');
    const restTimeSec = parseInt(restTime ?? '0');

    // we don't want to add a round is there was no activity created
    if (activityTime === 0) {
      return props.closeActivityForm();
    }

    // after everyting has been parsed and the activity time is > 0, add the activity to the routine
    const activitylabel = label?.current?.value
      ? label?.current?.value
      : `Activity ${roundId}`;
    dispatch(
      addRound({ id: uuidv4(), label: activitylabel, time: activityTime })
    );

    // once a round is created, change the next activity name
    setActivityDefaultName((prev) => prev + 1);

    // add a rest after the round if the user has the singleRest switch enabled, this
    // way the user can turn off the singleRest if they don't need reste after the new activity
    if (restActive && restTimeSec !== 0) {
      dispatch(addRound({ id: uuidv4(), label: 'Rest', time: restTimeSec }));
    }

    // reset the values of the single rests to 0, if there are global rests they will be reset to that value
    setRoundTime('0');
    setRestTime(globalRest.time);
    setRestActive(globalRest.active);
    props.closeActivityForm();
  }

  // on screens > sm, the globalRests form didn't affected the singleRest from this
  // two effects will listen to the changes in globalRests
  useEffect(() => {
    setRestActive(globalRest.active);
  }, [globalRest]);

  useEffect(() => {
    setRestTime(globalRest.time);
  }, [globalRest]);

  // here we will generate the list with the time options for an activity
  const ACTIVITY: DefaultTimeOptions[] = ['10', '20', '30', '45', '60', '180'];
  const activityOptions = ACTIVITY.map((time) => (
    <TimeButtons key={`activity-${time}`} group='activity-time' time={time} />
  ));

  // here we will generate the list with the time options for an activity rest
  const REST: DefaultTimeOptions[] = ['5', '10', '20', '30', '45', '60'];
  const restOptions = REST.map((time) => (
    <TimeButtons
      key={`round-rest-${time}`}
      group='round-rest-time'
      time={time}
    />
  ));

  return (
    <div className='absolute md:relative top-0 left-0 w-full h-full'>
      <div
        className='absolute md:hidden top-0 left-0 w-full h-full bg-gray-50 bg-opacity-30'
        onClick={props.closeActivityForm}></div>
      <form
        className='bg-gray-800 w-11/12 md:w-full p-2 md:p-0 rounded-md absolute md:relative top-1/2 left-1/2 md:top-auto md:left-auto transform -translate-y-1/2 -translate-x-1/2 md:transform-none'
        onSubmit={(event) =>
          handleUserInput(event, activityDefaultName, labelRef)
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
          <TimeContext.Provider
            value={{
              value: roundTime,
              setValue: setRoundTime,
              dependent: false,
            }}>
            {activityOptions}
          </TimeContext.Provider>
        </fieldset>
        <fieldset className='bg-gray-700 p-2 rounded-t-md flex justify-between items-center'>
          <h2>Rest</h2>
          <label className='toggle-switch '>
            <input
              type='checkbox'
              onChange={() => setRestActive(!restActive)}
              checked={restActive}
            />
            <span className='slider'></span>
          </label>
        </fieldset>
        <fieldset
          className='round-rest bg-gray-700 mb-2 px-2 pb-2 rounded-b-md'
          disabled={restActive ? false : true}>
          <div className='grid grid-cols-3 sm:grid-cols-6 gap-3 sm:mt-2'>
            <TimeContext.Provider
              value={{
                value: restTime,
                setValue: setRestTime,
                dependent: true,
              }}>
              {restOptions}
            </TimeContext.Provider>
          </div>
        </fieldset>
        <button
          type='submit'
          className='font-bold text-white block w-3/5 py-2 px-4 m-auto rounded-md bg-gradient-to-r from-mint to-lime'>
          Add round
        </button>
      </form>
    </div>
  );
}
