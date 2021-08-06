import React from 'react';
import Countdown from './components/countdown';

//this interface define the timer component states types
interface ITimerStates {
  routine: any[];
  currentSet: number;
  mountCountdown: boolean;
  globalRests: boolean;
  activityForm: boolean;
  individualRest: boolean;
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

      globalRests: false,
      activityForm: false,
      individualRest: false,
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.nextSet = this.nextSet.bind(this);
    this.handleToggleFieldset = this.handleToggleFieldset.bind(this);

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

  handleToggleFieldset(field: string) {
    switch (field) {
      case 'globalRests':
        this.setState({
          globalRests: !this.state.globalRests,
        });
        break;
      case 'activityForm':
        this.setState({
          activityForm: !this.state.activityForm,
        });
        break;
      case 'individualRest':
        this.setState({
          individualRest: !this.state.individualRest,
        });
        break;
      default:
        break;
    }
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
      <div className='w-full max-w-xl m-auto'>
        <header className='flex justify-between items-center'>
          <h1>Interval timer</h1>
          <button
            className='font-bold text-white py-2 px-4 rounded-md bg-gradient-to-r from-mint to-lime'
            onClick={() => this.startCountdown()}
          >
            Start timer
          </button>
        </header>
        <form className='w-full flex flex-col'>
          <label className='text-lg flex justify-between my-2'>
            <h2>Repetir descansos</h2>
            <input
              type='checkbox'
              onChange={() => this.handleToggleFieldset('globalRests')}
              defaultChecked={this.state.globalRests}
            />
          </label>
          {this.state.globalRests && (
            <fieldset className='flex items-end mb-2'>
              <label className='flex flex-col flex-1'>
                Tiempo
                <input type='text' className='form-input mt-1 mr-2' />
              </label>
              <select className='form-select flex-none'>
                <option value='sec'>sec</option>
                <option value='min'>min</option>
              </select>
            </fieldset>
          )}
        </form>
        <hr className='w-9/12 m-auto' />
        <button
          className='font-bold block w-3/5 text-white py-2 px-4 m-auto my-2 rounded-md bg-gray-600'
          onClick={() => this.handleToggleFieldset('activityForm')}
        >
          New activity
        </button>
        {this.state.activityForm && (
          <div className='absolute top-0 left-0 w-full h-full'>
            <div
              className='absolute top-0 left-0 w-full h-full bg-gray-50 bg-opacity-30'
              onClick={() => this.handleToggleFieldset('activityForm')}
            ></div>
            <form
              className='bg-gray-900 p-2 rounded-md absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'
              onSubmit={this.handleUserInput}
            >
              <h2>Activity</h2>
              <fieldset>
                <label className='flex flex-col'>
                  Name
                  <input
                    type='text'
                    className='form-input mt-1'
                    ref={this.labelRef}
                  />
                </label>
              </fieldset>
              <fieldset className='flex items-end mb-2'>
                <label className='flex flex-col flex-1'>
                  Tiempo
                  <input type='text' className='form-input mt-1 mr-2' />
                </label>
                <select className='form-select flex-none'>
                  <option value='sec'>sec</option>
                  <option value='min'>min</option>
                </select>
              </fieldset>
              <fieldset>
                <label className='flex justify-between mt-1 '>
                  <h2>Descanso</h2>
                  <input
                    type='checkbox'
                    onChange={() => this.handleToggleFieldset('individualRest')}
                    defaultChecked={this.state.individualRest}
                  />
                </label>
                {this.state.individualRest && (
                  <span className='flex items-end mb-2'>
                    <label className='flex flex-col flex-1'>
                      Tiempo
                      <input type='text' className='form-input mt-1' />
                    </label>
                    <select className='form-select ml-2'>
                      <option value='sec'>sec</option>
                      <option value='min'>min</option>
                    </select>
                  </span>
                )}
              </fieldset>
              <button
                className='font-bold text-white block w-3/5 py-2 px-4 m-auto rounded-md bg-gradient-to-r from-mint to-lime'
                type='submit'
              >
                Add set
              </button>
            </form>
          </div>
        )}
        {this.state.mountCountdown && <div>{timtim}</div>}
      </div>
    );
  }
}
