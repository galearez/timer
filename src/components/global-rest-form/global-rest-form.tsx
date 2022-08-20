import React, { useContext, useEffect } from 'react';
import { RestContext } from '../../app';
import TimeOptions from '../time-buttons';
import { TimeContext } from '../../app/time-context';
import type {
  DefaultTimeOptions,
  RestContextTypes,
} from '../../@types/context';

export default function GlobalRestForm() {
  // this context will hold the state of the global rest form and the rest time
  // also it will provide two callback to control the state from this component
  const rest = useContext(RestContext) as RestContextTypes;

  // this function will toggle the global rest form
  function toggleRadioFieldset() {
    rest.setActive(!rest.active);
  }

  // if we hide the form is precise to set the time to 0 to not polute the add round form
  useEffect(() => {
    if (!rest.active) rest.setTime('0');
  }, [rest]);

  // since the markup for the radio buttons was too repetitive I made it into its own component
  // this way I can iteratively create the buttons
  const REST: DefaultTimeOptions[] = ['5', '10', '20', '30', '45', '60'];
  const timeOptions = REST.map((option) => (
    <TimeOptions key={`rest-${option}`} group='rest' time={option} />
  ));

  return (
    <form className='w-full flex flex-col'>
      <fieldset className='text-lg mt-2 flex justify-between items-center'>
        <h2>Repeat rest</h2>
        <label className='toggle-switch'>
          <input
            type='checkbox'
            onChange={toggleRadioFieldset}
            defaultChecked={rest.active}
          />
          <span className='slider'></span>
        </label>
      </fieldset>
      {rest.active && (
        <fieldset className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-2'>
          <TimeContext.Provider
            value={{
              value: rest.time,
              setValue: rest.setTime,
              dependent: false,
            }}
          >
            {timeOptions}
          </TimeContext.Provider>
        </fieldset>
      )}
    </form>
  );
}
