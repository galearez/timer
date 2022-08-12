import { useContext, useEffect, useState } from 'react';
import { RestContext } from './app';

export default function GlobalRestForm() {
  // this context will hold the state of the global rest form and the rest time
  // also it will provide two callback to control the state from this component
  let rest = useContext(RestContext);

  // this function will toggle the global rest form
  function toggleRadioFieldset() {
    rest.setActive(!rest.active);
  }

  // if we hide the form is precise to set the time to 0 to not polute the add round form
  useEffect(() => {
    if (!rest.active) rest.setTime('0');
  }, [rest.active]);

  return (
    <form className='w-full md:mt-2 flex flex-col'>
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
        <fieldset className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-1 sm:my-2'>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-5'
              value={5}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-5'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              5 s
            </label>
          </div>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-10'
              value={10}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-10'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              10 s
            </label>
          </div>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-20'
              value={20}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-20'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              20 s
            </label>
          </div>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-30'
              value={30}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-30'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              30 s
            </label>
          </div>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-45'
              value={45}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-45'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              45 s
            </label>
          </div>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-60'
              value={60}
              onChange={(e) => rest.setTime(e.target.value)}
              hidden
            />
            <label
              htmlFor='rest-60'
              className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'>
              1 m
            </label>
          </div>
        </fieldset>
      )}
    </form>
  );
}
