import React from 'react';

//useful info: https://dev.to/jackherizsmith/making-a-progress-circle-in-react-3o65

interface ICountdownProps {
  //set label
  label: string;
  //set time
  time: number;
  //this method indicates that the next 'set' should run and unmount this component
  nextSetIndex: () => void;
  //once this component is unmounted this method will mount the next one (if there is one) right after this unmounts
  mountNextSet: () => void;
}

interface ICountdownState {
  //will hold the remaining time
  countdownTime: number;
}

export default class Countdown extends React.Component<
  ICountdownProps,
  ICountdownState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      countdownTime: this.props.time,
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
        this.props.nextSetIndex();
      }

      this.setState({
        countdownTime: this.state.countdownTime - 1,
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.props.mountNextSet();
  }

  render() {
    return (
      <div>
        {this.props.label}
        <span>{this.state.countdownTime}</span>
      </div>
    );
  }
}
