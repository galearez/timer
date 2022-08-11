import { useEffect, useState } from 'react';

interface GlobalRestFormProps {
  setRestTime: (s: string) => void;
  showSingleRest: (b: boolean) => void;
}

// 00000000000000000000000000000000000000000000000000000000000
export default function GlobalRestForm(props: GlobalRestFormProps) {
  let [globalRests, setGlobalRests] = useState(false);

  function toggleRadioFieldset() {
    setGlobalRests(!globalRests);
    props.showSingleRest(!globalRests);
  }

  useEffect(() => {
    if (!globalRests) props.setRestTime('0');
  }, [globalRests]);

  return (
    <form className='w-full md:mt-2 flex flex-col'>
      <fieldset className='text-lg mt-2 flex justify-between items-center'>
        <h2>Repeat rest</h2>
        <label className='toggle-switch'>
          <input
            type='checkbox'
            onChange={toggleRadioFieldset}
            defaultChecked={globalRests}
          />
          <span className='slider'></span>
        </label>
      </fieldset>
      {globalRests && (
        <fieldset className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-1 sm:my-2'>
          <div className=' rounded-lg bg-gray-700 hover:bg-opacity-75'>
            <input
              type='radio'
              name='rest'
              id='rest-5'
              value={5}
              onChange={(e) => props.setRestTime(e.target.value)}
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
              onChange={(e) => props.setRestTime(e.target.value)}
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
              onChange={(e) => props.setRestTime(e.target.value)}
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
              onChange={(e) => props.setRestTime(e.target.value)}
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
              onChange={(e) => props.setRestTime(e.target.value)}
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
              onChange={(e) => props.setRestTime(e.target.value)}
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
