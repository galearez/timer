import React from 'react';
import Countdown from './components/countdown';

//this interface define the timer component states types
interface ITimerStates {
  routine: any[];
  currentSet: number;
  mountCountdown: boolean;
}

//this component will handle the user input and will pass main data, sets (id, label and time)
//to the other components
export default class Timer extends React.Component<{}, ITimerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      routine: [], //array of objects: {id, label, time}
      currentSet: 0, //A set is an element of the routine array, this specify the set which will be sent to the countdown
      mountCountdown: false, //if true will mount the 'Countdown' component
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.nextSet = this.nextSet.bind(this);

    this.labelRef = React.createRef();
    this.timeRef = React.createRef();
  }

  //user input box references
  labelRef: React.RefObject<HTMLInputElement>;
  timeRef: React.RefObject<HTMLInputElement>;

  //this function get the values from the user and assign them to the routine state
  handleUserInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //check if the user wrote a valid string as the set label, if not it will be assigned a default name
    let inputLabel = this.labelRef.current?.value;
    if (inputLabel === '' || inputLabel === undefined) {
      inputLabel = 'actividad'; //default name if the user don't specify one
    }

    //check if the user inserted a valid string as the set time
    let inputTime = this.timeRef.current?.value;
    if (inputTime === '' || inputTime === undefined) {
      return;
    }

    //check if set time is an integer number
    const timeNumeric = parseInt(inputTime);
    if (isNaN(timeNumeric)) {
      return;
    }

    //only the values that met the conditions will be assigned to the user routine
    //label must be a valid string
    //time must be a valid integer number
    this.setState((prevState) => ({
      routine: [...prevState.routine, { label: inputLabel, time: timeNumeric }],
    }));
  }

  //this function will set which 'set' should run, also a change indicates that the current interval
  //it's done executing so the next one should run, that why we also pass a callback, this callback
  //unmount the component that just has finished
  nextSet() {
    this.setState(
      {
        currentSet: this.state.currentSet + 1,
      },
      () => {
        this.setState({
          mountCountdown: false,
        });
      }
    );
  }

  //this function will start a countdown, can be used in two cases:
  //first, the user click in start timer
  //second, one countdown reach zero, unmounts and if there is another set it will mount the component again for the new set
  startCountdown() {
    //this condition checks if there are elements in the routine array to
    //run a countdown, if so the component 'Countdown' will be mounted
    if (this.state.currentSet < this.state.routine.length) {
      this.setState({
        mountCountdown: true,
      });
    }

    return;
  }

  render() {
    //holds the countdown component and it's assigned on each 'currentSet' change
    const timtim = (
      <Countdown
        label={this.state.routine[this.state.currentSet]?.label}
        time={this.state.routine[this.state.currentSet]?.time}
        nextSetIndex={this.nextSet}
        mountNextSet={this.startCountdown}
      />
    );

    return (
      <div>
        Interval timer app
        <form onSubmit={this.handleUserInput}>
          <label>
            insert time
            <input type='text' ref={this.labelRef} />
            <input type='text' ref={this.timeRef} />
          </label>
          <button type='submit'>add activity</button>
        </form>
        <button onClick={() => this.startCountdown()}>start</button>
        {this.state.mountCountdown && <div>{timtim}</div>}
      </div>
    );
  }
}
