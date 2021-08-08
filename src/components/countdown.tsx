import React from 'react';

//useful info: https://dev.to/jackherizsmith/making-a-progress-circle-in-react-3o65

interface ICountdownProps {
  //set label
  label: string;
  //set time
  time: number;
  //this method indicates that the next 'set' should run and unmount this component
  nextRoundIndex: () => void;
  //once this component is unmounted this method will mount the next one (if there is one) right after this unmounts
  mountnextRound: () => void;
}

interface ICountdownState {
  //will hold the remaining time
  countdownTime: number;
  minutes: number;
  seconds: number;
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
    };
  }

  //this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  interval: any = null;

  //once the component mounts it will start a countdown, the original value is the one passed as a prop to
  //the component and it will run until the 'countdownTime' is 0
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.countdownTime <= 0) {
        clearInterval(this.interval);
        this.props.nextRoundIndex();
      }

      this.setState({
        countdownTime: this.state.countdownTime - 1,
        minutes: Math.floor(this.state.countdownTime / 60),
        seconds: this.state.countdownTime % 60,
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.props.mountnextRound();
  }

  render() {
    return (
      <div>
        <div>{this.props.label}</div>
        <div>
          <span>{this.state.minutes}</span>
          {':'}
          <span>{this.state.seconds}</span>
        </div>
      </div>
    );
  }
}
