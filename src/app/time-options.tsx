import clsx from 'clsx';
import { useContext } from 'react';
import { TimeContext } from './time.context';

interface TimeOptionsProps {
  group: string;
  time: string;
}

export default function TimeOptions(props: TimeOptionsProps) {
  const time = useContext(TimeContext);

  return (
    <div
      className={clsx(
        'rounded-lg hover:bg-opacity-75',
        time.dependent ? 'bg-gray-500' : 'bg-gray-700'
      )}>
      <input
        type='radio'
        name={props.group}
        id={`${props.group}-${props.time}`}
        value={props.time}
        onChange={() => time.setValue(props.time)}
        checked={time.value === props.time}
        hidden
      />
      <label
        className='radio block text-center font-semibold py-2 px-4 rounded-lg cursor-pointer'
        htmlFor={`${props.group}-${props.time}`}>
        {props.time} s
      </label>
    </div>
  );
}
