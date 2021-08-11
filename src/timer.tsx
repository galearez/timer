import React from 'react';
import Countdown from './components/countdown';
import { v4 as uuidv4 } from 'uuid';

import { ReactComponent as MoreIcon } from './assets/delete.svg';

//Add move button to activities
//Add buttons to stop the countdown, restart an activity and modify the routine

//this interface define the timer component states types
interface ITimerStates {
  routine: any[];
  currentRound: number;
  mountCountdown: boolean;
  globalRests: boolean;
  activityForm: boolean;
  singleRest: boolean;
  screenWidth: number;
  minGlobalRest: number;
  secGlobalRest: number;
  minSingleRest: number;
  secSingleRest: number;
  closeHomeScreen: boolean;
}

//before this change this two arrays where auto-generated on component mounting, but there was a big problem
//it needs to 'update' before generating the options for the select box so when using it on desktop there
//are not options at the start, thats why even if it's annoying I created this two arrays so there
//are options on first rendering
const FIVE_BY_FIVE = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const ONE_BY_ONE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60,
];

//this component will handle the user input and will pass main data, rounds (id, label and time)
//to the other components
export default class Timer extends React.Component<{}, ITimerStates> {
  //get intial first screen width
  screenWidth: number = window.innerWidth;

  constructor(props: any) {
    super(props);
    this.state = {
      //this state will control when the user input forms are active, basically when the countdown start
      //the 'home' screen will be closed to give room for the countdown UI elements
      closeHomeScreen: false,
      //array of objects: {id, label, time}
      routine: [],
      //A round is an element of the routine array, this specify the round which will be sent to the countdown
      currentRound: 0,
      //if true will mount the 'Countdown' component
      mountCountdown: false,

      //will control the form to auto generate rests between rounds
      globalRests: false,
      //will control the form to include a new round, the initial value will depend on the initial screen size,
      //the responsive design render the form by default when the app is on a screen over 767 (md in tailwind)
      activityForm: this.screenWidth > 767,
      //will control the form to include a single rest after a round
      singleRest: false,

      //initial screenWidth, will update on screen resize
      screenWidth: this.screenWidth,

      //since there are two ways to define a rest, we are goind to define state for their values, this state control
      //the rest if the globalRest state is true
      minGlobalRest: 0,
      secGlobalRest: 0,

      //this state are meant to control individual rests, since sometimes there will be different rests lengths
      minSingleRest: 0,
      secSingleRest: 0,
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleHomeClose = this.handleHomeClose.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.handleToggleFieldset = this.handleToggleFieldset.bind(this);
    this.handleScreenResize = this.handleScreenResize.bind(this);

    this.handleMinGlobalRestChange = this.handleMinGlobalRestChange.bind(this);
    this.handleSecGlobalRestChange = this.handleSecGlobalRestChange.bind(this);

    this.handleMinSingleRestChange = this.handleMinSingleRestChange.bind(this);
    this.handleSecSingleRestChange = this.handleSecSingleRestChange.bind(this);

    this.handleDeleteRound = this.handleDeleteRound.bind(this);

    this.labelRef = React.createRef();
    this.roundMinRef = React.createRef();
    this.roundSecRef = React.createRef();
    this.restMinRef = React.createRef();
    this.restSecRef = React.createRef();
  }

  //user input box references
  labelRef: React.RefObject<HTMLInputElement>;
  roundMinRef: React.RefObject<HTMLSelectElement>;
  roundSecRef: React.RefObject<HTMLSelectElement>;
  restMinRef: React.RefObject<HTMLSelectElement>;
  restSecRef: React.RefObject<HTMLSelectElement>;

  //variable to keep track of the number of rounds, just for rounds default names
  roundDefaultNumber: number = 1;

  //when screen resize it will be called to change the screenWidth state which control some responsive rendering
  handleScreenResize() {
    this.setState({ screenWidth: window.innerWidth }, () => {
      //if the user expands the screen over 767 it will open the activity form component
      if (this.state.screenWidth > 767 && !this.state.activityForm) {
        this.setState({
          activityForm: true,
        });
        return;
      }

      //if the user shrinks the screen below 768 it will close the activity form component
      if (this.state.screenWidth < 768 && this.state.activityForm) {
        this.setState({
          activityForm: false,
        });
        return;
      }
    });
  }

  componentDidMount() {
    //once it gets mounted waits for any resize
    window.addEventListener('resize', this.handleScreenResize);
  }

  //unmount the window resize event listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScreenResize);
  }

  //this function get the values from the user and assign them to the routine state
  handleUserInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //check if the user wrote a valid string as the round label, if not it will be assigned a default name
    let inputLabel = this.labelRef.current?.value;
    if (inputLabel === '' || inputLabel === undefined) {
      inputLabel = 'Round ' + this.roundDefaultNumber; //default name if the user don't specify one
    }

    //This block of code it's very ugly find a way to make it look beautiful
    let inputMin = this.roundMinRef.current?.value;
    let inputSec = this.roundSecRef.current?.value;
    let inputRestMin = this.restMinRef.current?.value;
    let inputRestSec = this.restSecRef.current?.value;
    if (
      inputMin === undefined ||
      inputSec === undefined ||
      inputRestMin === undefined ||
      inputRestSec === undefined
    ) {
      return;
    }

    //convert the string values to numbers
    const timeActivityMin = parseInt(inputMin);
    const timeActivitySec = parseInt(inputSec);
    const timeRestMin = parseInt(inputRestMin);
    const timeRestSec = parseInt(inputRestSec);

    //convert the activity time to seconds
    const timeActivity = timeActivityMin * 60 + timeActivitySec;
    const timeRest = timeRestMin * 60 + timeRestSec;

    //if there is no time for an activity it will not create a routine round
    if (timeActivity === 0) {
      return;
    }

    //only the values that met the conditions will be assigned to the user routine
    //label must be a valid string
    //time must be an integer between 0 and 60
    this.setState((prevState) => ({
      routine: [
        ...prevState.routine,
        { id: uuidv4(), label: inputLabel, time: timeActivity },
      ],
    }));

    //once a round is created it adds one to the counter
    this.roundDefaultNumber++;

    //add a rest after the round if the user has one of the add Rest switch enabled, this is like this
    //because that way the user can turn off the global rest if they don't need it between rounds
    if (this.state.singleRest) {
      this.setState((prevState) => ({
        routine: [
          ...prevState.routine,
          { id: uuidv4(), label: 'Rest', time: timeRest },
        ],
      }));
    }

    //reset the values of the single rests, if there are global rests, they will be reset to that value, if not
    //they will be reset to 0
    this.setState({
      minSingleRest: this.state.minGlobalRest,
      secSingleRest: this.state.secGlobalRest,
    });

    //close the input form modal
    if (this.state.screenWidth < 768) {
      this.setState({
        activityForm: false,
      });
    }
  }

  //this function will set which 'round' should run, also a change indicates that the current interval
  //it's done executing so the next one should run, that why we also pass a callback, this callback
  //unmount the component that just has finished
  nextRound() {
    this.setState(
      {
        currentRound: this.state.currentRound + 1,
      },
      () => {
        this.setState({
          mountCountdown: false,
        });
      }
    );
  }

  //this function will start a countdown, is used in two cases:
  //first, the user click in start timer
  //second, one countdown reach zero, unmounts and if there is another round it will mount the component again for the new round
  startCountdown() {
    //this condition checks if there are elements in the routine array to
    //run a countdown, if so the component 'Countdown' will be mounted
    if (this.state.currentRound < this.state.routine.length) {
      this.setState({
        mountCountdown: true,
      });
    }

    return;
  }

  //when the user start the countdown the first time it will unmount all the 'home screen' elements
  handleHomeClose() {
    this.setState({
      closeHomeScreen: true,
    });
  }

  //this function will handle all the fields where the input can add data, they will only be rendered
  //once the user need them in mobile, in screens > 768, they will be rendered by default and the only
  //conditional rendering will be the other components
  handleToggleFieldset(field: string) {
    switch (field) {
      case 'globalRests':
        this.setState({
          globalRests: !this.state.globalRests,
          singleRest: !this.state.globalRests,
        });
        break;
      case 'activityForm':
        this.setState({
          activityForm: !this.state.activityForm,
        });
        break;
      case 'singleRest':
        this.setState({
          singleRest: !this.state.singleRest,
        });
        break;
      default:
        break;
    }
  }

  //handle global rest select value, and also single rests to show that they will be added
  handleMinGlobalRestChange(e: any) {
    this.setState({
      minGlobalRest: e.target.value,
      minSingleRest: e.target.value,
    });
  }

  //handle global rest select value, and also single rests to show that they will be added
  handleSecGlobalRestChange(e: any) {
    this.setState({
      secGlobalRest: e.target.value,
      secSingleRest: e.target.value,
    });
  }

  //handle single rest select value
  handleMinSingleRestChange(e: any) {
    this.setState({
      minSingleRest: e.target.value,
    });
  }

  //handle single rest select value
  handleSecSingleRestChange(e: any) {
    this.setState({
      secSingleRest: e.target.value,
    });
  }

  //this method will delete a round
  handleDeleteRound(id: number) {
    let updatedRoutine = this.state.routine.filter((elem) => elem.id !== id);

    this.setState({
      routine: updatedRoutine,
    });
  }

  render() {
    //creates options for the minutes select box
    const sixtyOptions = ONE_BY_ONE.map((elem: number) => (
      <option value={elem} key={elem}>
        {elem}
      </option>
    ));

    //create options for the seconds select box
    const twelveOptions = FIVE_BY_FIVE.map((elem: number) => (
      <option value={elem} key={elem}>
        {elem}
      </option>
    ));

    //holds the countdown component and it's assigned on each 'currentRound' change
    const countdownComponent = (
      <Countdown
        label={this.state.routine[this.state.currentRound]?.label}
        time={this.state.routine[this.state.currentRound]?.time}
        nextRoundIndex={this.nextRound}
        mountnextRound={this.startCountdown}
      />
    );

    //this variable is meant to render the routine
    const activitiesList = this.state.routine.map((elem: any) => {
      const minutes = Math.floor(elem.time / 60);
      const seconds = elem.time % 60;

      return (
        <div key={elem.id}>
          <div className='w-full bg-gray-700 rounded-md p-2 mb-2 flex justify-between items-center flex-nowrap text-lg'>
            <span>{elem.label}</span>
            <div className='flex items-center'>
              <span>
                {minutes < 10 ? (
                  <span>0{minutes}</span>
                ) : (
                  <span>{minutes}</span>
                )}
                :
                {seconds < 10 ? (
                  <span>0{seconds}</span>
                ) : (
                  <span>{seconds}</span>
                )}
              </span>
              <span
                className='inline-block ml-3'
                onClick={() => {
                  this.handleDeleteRound(elem.id);
                }}
              >
                <MoreIcon className='fill-current text-gray-50' />
              </span>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='w-full max-w-xl md:max-w-4xl m-auto md:grid grid-cols-2 gap-x-4'>
        <header className='flex justify-between items-center col-span-2'>
          <h1>Interval timer</h1>
          {!this.state.closeHomeScreen && (
            <button
              className='font-bold text-white py-2 px-4 rounded-md bg-gradient-to-r from-mint to-lime'
              onClick={() => {
                this.startCountdown();
                this.handleHomeClose();
              }}
            >
              Start timer
            </button>
          )}
        </header>
        {!this.state.closeHomeScreen && (
          <form className='w-full md:mt-2 flex flex-col col-start-1'>
            <fieldset className='text-lg mt-2 flex justify-between items-center'>
              <h2>Repetir descansos</h2>
              <label className='toggle-switch'>
                <input
                  type='checkbox'
                  onChange={() => this.handleToggleFieldset('globalRests')}
                  defaultChecked={this.state.globalRests}
                />
                <span className='slider'></span>
              </label>
            </fieldset>
            {this.state.globalRests && (
              <fieldset className='flex items-end'>
                <label className='flex flex-col flex-1 mr-1'>
                  Minutes
                  <select
                    value={this.state.minGlobalRest}
                    className='form-select flex-none'
                    onChange={this.handleMinGlobalRestChange}
                    disabled={!this.state.globalRests}
                  >
                    {sixtyOptions}
                  </select>
                </label>
                <label className='flex flex-col flex-1'>
                  Seconds
                  <select
                    value={this.state.secGlobalRest}
                    className='form-select flex-none'
                    onChange={this.handleSecGlobalRestChange}
                    disabled={!this.state.globalRests}
                  >
                    {twelveOptions}
                  </select>
                </label>
              </fieldset>
            )}
          </form>
        )}
        {!this.state.closeHomeScreen && (
          <div>
            <hr className='w-9/12 m-auto mt-2 md:my-2 col-start-1' />
            <button
              className='font-bold block md:hidden w-3/5 text-white py-2 px-4 m-auto my-2 rounded-md bg-gray-600'
              onClick={() => {
                this.handleToggleFieldset('activityForm');
                if (this.state.globalRests) {
                  this.setState({
                    singleRest: true,
                  });
                }
              }}
            >
              New activity
            </button>
          </div>
        )}
        {!this.state.closeHomeScreen && this.state.activityForm && (
          <div className='absolute md:relative top-0 left-0 w-full h-full col-start-1'>
            <div
              className='absolute md:hidden top-0 left-0 w-full h-full bg-gray-50 bg-opacity-30'
              onClick={() => this.handleToggleFieldset('activityForm')}
            ></div>
            <form
              className='bg-gray-800 w-11/12 md:w-full p-2 md:p-0 rounded-md absolute md:relative top-1/2 left-1/2 md:top-auto md:left-auto transform -translate-y-1/2 -translate-x-1/2 md:transform-none'
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
                    placeholder={'Round ' + this.roundDefaultNumber}
                  />
                </label>
              </fieldset>
              <fieldset className='flex items-end mb-2'>
                <label className='flex flex-col flex-1 mr-1'>
                  Minutes
                  <select
                    className='form-select flex-none'
                    ref={this.roundMinRef}
                  >
                    {sixtyOptions}
                  </select>
                </label>
                <label className='flex flex-col flex-1'>
                  Seconds
                  <select
                    className='form-select flex-none'
                    ref={this.roundSecRef}
                  >
                    {twelveOptions}
                  </select>
                </label>
              </fieldset>
              <fieldset className='bg-gray-700 mb-2 px-1 rounded-md'>
                <span className='mt-1 flex justify-between items-center'>
                  <h2>Descanso</h2>
                  <label className='toggle-switch '>
                    <input
                      type='checkbox'
                      onClick={() => this.handleToggleFieldset('singleRest')}
                      checked={this.state.singleRest}
                    />
                    <span className='slider'></span>
                  </label>
                </span>
                <span className='flex items-end mb-2'>
                  <label className='flex flex-col flex-1 mr-1'>
                    Minutes
                    <select
                      className='form-select flex-none'
                      ref={this.restMinRef}
                      value={this.state.minSingleRest}
                      onChange={this.handleMinSingleRestChange}
                      disabled={!this.state.singleRest}
                    >
                      {sixtyOptions}
                    </select>
                  </label>
                  <label className='flex flex-col flex-1'>
                    Seconds
                    <select
                      className='form-select flex-none'
                      ref={this.restSecRef}
                      value={this.state.secSingleRest}
                      onChange={this.handleSecSingleRestChange}
                      disabled={!this.state.singleRest}
                    >
                      {twelveOptions}
                    </select>
                  </label>
                </span>
              </fieldset>
              <button
                type='submit'
                className='font-bold text-white block w-3/5 py-2 px-4 m-auto rounded-md bg-gradient-to-r from-mint to-lime'
              >
                Add round
              </button>
            </form>
          </div>
        )}
        {this.state.screenWidth < 768 && !this.state.closeHomeScreen && (
          <div className='col-start-1 md:col-start-2 md:row-start-2 md:row-span-4'>
            {activitiesList}
          </div>
        )}
        {this.state.screenWidth > 767 && (
          <div className='md:mt-2 col-start-1 md:col-start-2 md:row-start-2 md:row-span-4'>
            {activitiesList}
          </div>
        )}
        {this.state.closeHomeScreen && (
          <div className='row-span-6'>
            {this.state.mountCountdown ? (
              countdownComponent
            ) : (
              <div className='font-bold text-4xl md:text-6xl h-80 flex flex-col justify-center items-center'>
                Completed!
              </div>
            )}
            {this.state.routine[this.state.currentRound + 1] && (
              <div className='bg-gray-700 rounded-md'>
                <h2 className='pt-2 px-2'>Next round</h2>
                {activitiesList[this.state.currentRound + 1]}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
