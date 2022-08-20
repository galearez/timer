import React from 'react';
import { useAppDispatch } from '../../hooks';
import { removeRound } from '../../app/routine-slice';
import Icons from '../../utils/icons';

interface Activities {
  id: string;
  label: string;
  time: number;
}

interface ActivitiesListProps {
  activities: Activities[];
}

export default function ActivitiesList(props: ActivitiesListProps) {
  const list = props.activities.map((activity) => (
    <RenderActivity activity={activity} key={activity.id} />
  ));

  return <>{list}</>;
}

interface RenderActivityProps {
  activity: Activities;
}

function RenderActivity(props: RenderActivityProps) {
  const dispatch = useAppDispatch();
  const activity = props.activity;
  // this method will delete a round
  function handleDeleteRound(id: string) {
    dispatch(removeRound(id));
  }

  // I want to render the acivity time in mm:ss, the time is stored in secods so
  // I need to calculate the time in minutes and its remaining is the seconds
  const minutes = Math.floor(activity.time / 60);
  const seconds = activity.time % 60;

  return (
    <div className='w-full bg-gray-700 rounded-md p-2 mb-2 flex justify-between items-center flex-nowrap text-lg'>
      <span>{activity.label}</span>
      <div className='flex items-center'>
        <span>
          {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}:
          {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
        </span>
        <span
          className='inline-block ml-3'
          onClick={() => {
            handleDeleteRound(activity.id);
          }}
        >
          <Icons value={'delete'} />
        </span>
      </div>
    </div>
  );
}
