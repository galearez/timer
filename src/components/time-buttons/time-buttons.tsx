import clsx from 'clsx';
import { useContext } from 'react';
import { TimeContext } from '../../app/time-context';

type DefaultTimeOptions = '0' | '5' | '10' | '20' | '30' | '45' | '60' | '180';

interface TimeOptionsProps {
  group: string;
  time: DefaultTimeOptions;
}

export default function TimeButtons(props: TimeOptionsProps) {
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
