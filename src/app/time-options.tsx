const REST = [5, 10, 15, 20, 30, 45, 60];
const ACTIVITY = [10, 20, 30, 45, 60, 180];

interface TimeOptionsProps {
  group: string;
  time: string;
  setTime: (s: string) => void;
}

export default function TimeOptions(props: TimeOptionsProps) {
  return (
    <div className='rounded-lg bg-gray-700 hover:bg-opacity-75'>
      <input
        type='radio'
        name={props.group}
        id={`${props.group}-${props.time}`}
        value={props.time}
        onChange={() => props.setTime(props.time)}
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
