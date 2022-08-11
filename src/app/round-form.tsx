import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { addRound } from './routine-slice';
import { v4 as uuidv4 } from 'uuid';

interface AddNewRoundProps {
  globalRest: boolean;
  globalRestTime: string;
  closeActivityForm: () => void;
}

export default function AddNewRound(props: AddNewRoundProps) {
  const dispatch = useAppDispatch();

  // we want to turn on round rest if the user have global rest also turned on
  let [singleRest, setSingleRest] = useState(props.globalRest);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [activityDefaultName, setActivityDefaultName] = useState(1);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [restTime, setRestTime] = useState(props.globalRestTime);
  // this state is meant to be use on naming when the user don't specify an activity name
  let [roundTime, setRoundTime] = useState('0');

  // user input box references
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
    setActivityDefaultName(1);

    // add a rest after the round if the user has the singleRest switch enabled, this
    // way the user can turn off the singleRest if they don't need reste after the new activity
    if (singleRest && restTimeSec !== 0) {
      dispatch(addRound({ id: uuidv4(), label: 'Rest', time: restTimeSec }));
    }

    // reset the values of the single rests to 0, if there are global rests they will be reset to that value
    setRoundTime('0');
    setRestTime(props.globalRestTime);
    setSingleRest(props.globalRest);
    props.closeActivityForm();
  }

  // on screens > sm, the globalRests form didn't affected the singleRest from this
  // two effects will listen to the changes in globalRests
  useEffect(() => {
    setSingleRest(props.globalRest);
  }, [props.globalRest]);

  useEffect(() => {
    setRestTime(props.globalRestTime);
  }, [props.globalRestTime]);

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
          <div className='rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='activity'
              id='acivity-ten'
              value={10}
              hidden
              onChange={() => setRoundTime('10')}
              checked={roundTime === '10'}
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
              onChange={() => setRoundTime('20')}
              checked={roundTime === '20'}
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
              onChange={() => setRoundTime('30')}
              checked={roundTime === '30'}
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
              onChange={() => setRoundTime('45')}
              checked={roundTime === '45'}
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
              onChange={() => setRoundTime('60')}
              checked={roundTime === '60'}
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
              onChange={() => setRoundTime('180')}
              checked={roundTime === '180'}
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
                onChange={() => setSingleRest(!singleRest)}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '5'}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '10'}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '20'}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '30'}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '45'}
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
                  setRestTime(e.target.value);
                }}
                checked={restTime === '60'}
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
  );
}
