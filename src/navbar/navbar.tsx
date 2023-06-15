import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { ViewContext } from '../App';
import { mount } from '../app/mount-countdown-slice';
import { restart } from '../countdown/current-slice';
import Icons from '../utils/icons';

export default function NavBar() {
  const dispatch = useAppDispatch();
  const routine = useAppSelector((state) => state.routine.value);
  const view = useContext(ViewContext);

  return (
    <nav className='flex justify-between items-center'>
      <h1>Timer</h1>
      {view.current === 'home' ? (
        <button
          className='font-bold text-white py-2 px-4 rounded-md bg-gradient-to-r from-mint to-lime'
          onClick={() => {
            if (routine.length !== 0) {
              dispatch(mount());
              view.set('countdown');
            }
          }}>
          Start routine
        </button>
      ) : (
        <button
          className='font-bold text-white py-2 px-4 rounded-md bg-gray-700'
          onClick={() => dispatch(restart())}>
          Restart all <Icons value={'restore'} />
        </button>
      )}
    </nav>
  );
}
