import React from 'react';
import Icons from './icons';

interface ICountdownProps {
  //set label
  label: string;
  //set time
  time: number;
  //this method indicates that the next 'set' should run and unmount this component
  nextRound: (value: number) => void;
  //once this component is unmounted this method will mount the next one (if there is one) right after this unmounts
  mountNextRound: () => void;
  //this property is a callback to unmount the current countdown, it's purpose is to restart the current round
  unmountCountdown: () => void;
  //to show the move buttons depending on the current round and the size of the routine array
  buttonsToMove: number;
  //if the routine is to short, maybe one round, we don't need buttons to move over the rounds
  disbaleMoveButtons?: boolean;
}

interface ICountdownState {
  //will hold the remaining time
  countdownTime: number;
  //interger representing the minutes left
  minutes: number;
  //interger representing the seconds left
  seconds: number;
  //to change the button while paused and putting it back to normal when resumed
  isPaused: boolean;
}

export default class Countdown extends React.Component<
  ICountdownProps,
  ICountdownState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      countdownTime: this.props.time,
      minutes: Math.floor(this.props.time / 60),
      seconds: this.props.time % 60,
      isPaused: false,
    };

    this.stopCountdown = this.stopCountdown.bind(this);
    this.resumeCountdown = this.resumeCountdown.bind(this);
    this.restartRound = this.restartRound.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.previousRound = this.previousRound.bind(this);
  }

  //this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  interval: any = null;

  //once the component mounts it will start a countdown, the original value is the one passed as a prop to
  //the component and it will run until the 'countdownTime' is 0
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.countdownTime < 0) {
        clearInterval(this.interval);
        this.props.nextRound(1);
      } else {
        this.setState({
          countdownTime: this.state.countdownTime - 1,
          minutes: Math.floor(this.state.countdownTime / 60),
          seconds: this.state.countdownTime % 60,
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.setState({
      countdownTime: 0,
    });
    this.props.mountNextRound();
  }

  //this function will remove the setInterval to stop the countdown
  stopCountdown() {
    clearInterval(this.interval);
    this.setState({
      isPaused: true,
    });
  }

  //this function will restart the countdown
  resumeCountdown() {
    this.setState({
      isPaused: false,
    });

    this.interval = setInterval(() => {
      if (this.state.countdownTime < 0) {
        clearInterval(this.interval);
        this.props.nextRound(1);
      } else {
        this.setState({
          countdownTime: this.state.countdownTime - 1,
          minutes: Math.floor(this.state.countdownTime / 60),
          seconds: this.state.countdownTime % 60,
        });
      }
    }, 1000);
  }

  //this function will restart the current round
  restartRound() {
    this.props.unmountCountdown();
  }

  //this function will unmount the current round and will mount the next round if there is one
  nextRound() {
    this.props.nextRound(1);
  }
  //this function will unmount the current round and will mount the previous round if there is one
  previousRound() {
    this.props.nextRound(-1);
  }

  render() {
    return (
      <div className='font-bold h-80 flex flex-col justify-center items-center'>
        <div className='text-2xl md:text-4xl'>{this.props.label}</div>
        <div className='text-6xl md:text-8xl mb-10'>
          <span>
            {this.state.minutes < 10 ? (
              <span>0{this.state.minutes}</span>
            ) : (
              <span>{this.state.minutes}</span>
            )}
            :
            {this.state.seconds < 10 ? (
              <span>0{this.state.seconds}</span>
            ) : (
              <span>{this.state.seconds}</span>
            )}
          </span>
        </div>
        <div className='w-full max-w-md flex justify-around items-center'>
          {!this.props.disbaleMoveButtons && (
            <button
              className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
              disabled={this.props.buttonsToMove === -1}
              onClick={this.previousRound}
            >
              <Icons
                value={'previous'}
                disbale={this.props.buttonsToMove === -1}
              />
            </button>
          )}

          <button
            className='rounded-full w-14 h-14 bg-gray-700'
            onClick={this.restartRound}
          >
            <Icons value={'replay'} />
          </button>
          {this.state.isPaused ? (
            <button
              className='rounded-full w-16 h-16 bg-mint'
              onClick={this.resumeCountdown}
            >
              <Icons value={'play'} />
            </button>
          ) : (
            <button
              className='rounded-full w-16 h-16 bg-gray-700'
              onClick={this.stopCountdown}
            >
              <Icons value={'pause'} />
            </button>
          )}
          {!this.props.disbaleMoveButtons && (
            <button
              className='rounded-full w-12 h-12 bg-gray-700 disabled:bg-gray-900'
              disabled={this.props.buttonsToMove === 1}
              onClick={this.nextRound}
            >
              <Icons value={'next'} disbale={this.props.buttonsToMove === 1} />
            </button>
          )}
        </div>
      </div>
    );
  }
}
