// this variable is meant to show the next round on the routine
interface Activities {
  id: string;
  label: string;
  time: number;
}

interface NextActivityProps {
  currentActivity: number;
  routine: Activities[];
}

export default function NextActivity(props: NextActivityProps) {
  const { currentActivity, routine } = props;

  // I return this empty div to preserve the layout of the app
  if (currentActivity >= routine.length - 1) {
    return <div className='h-20 w-1 mb-4'></div>;
  }

  const elem = routine[currentActivity + 1];
  const minutes = Math.floor(elem.time / 60);
  const seconds = elem.time % 60;

  return (
    <div className='bg-gray-700 rounded-md mb-4'>
      <h2 className='pt-2 px-2'>Next</h2>

      <div className='w-full p-2 flex justify-between items-center flex-nowrap text-lg'>
        <span>{elem.label}</span>
        <div className='flex items-center'>
          <span>
            {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
            {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
