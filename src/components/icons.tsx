import React from 'react';
import clsx from 'clsx';

import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { ReactComponent as PlayIcon } from '../assets/play.svg';
import { ReactComponent as PauseIcon } from '../assets/pause.svg';
import { ReactComponent as PreviousIcon } from '../assets/previous.svg';
import { ReactComponent as NextIcon } from '../assets/next.svg';
import { ReactComponent as ReplayIcon } from '../assets/replay.svg';
import { ReactComponent as RestoreIcon } from '../assets/restore.svg';

interface IIconsProps {
  value: string;
  disbale?: boolean;
}

export default class Icons extends React.Component<IIconsProps, {}> {
  render() {
    const Icon = () => {
      switch (this.props.value) {
        case 'delete':
          return (
            <DeleteIcon className='fill-current text-gray-50 inline-block' />
          );
        case 'play':
          return (
            <PlayIcon className='fill-current text-gray-50 inline-block' />
          );
        case 'pause':
          return (
            <PauseIcon className='fill-current text-gray-50 inline-block' />
          );
        case 'previous':
          return (
            <PreviousIcon
              className={clsx(
                'fill-current text-gray-50 inline-block',
                this.props.disbale ? 'opacity-60' : 'opacity-100'
              )}
            />
          );
        case 'next':
          return (
            <NextIcon
              className={clsx(
                'fill-current text-gray-50 inline-block',
                this.props.disbale ? 'opacity-60' : 'opacity-100'
              )}
            />
          );
        case 'replay':
          return (
            <ReplayIcon className='fill-current text-gray-50 inline-block' />
          );
        case 'restore':
          return (
            <RestoreIcon className='fill-current text-gray-50 inline-block mx-1' />
          );
        default:
          return <span></span>;
      }
    };

    return <Icon />;
  }
}
