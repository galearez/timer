import React from 'react';

//this interface the timer component states types
interface ITimerStates {
  time: number;
}

//this component will handle the user input and will pass main data, as the intervals and labels
//to the other components
export default class Timer extends React.Component<{}, ITimerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      time: 0,
    };

    this.handleCountdownStart = this.handleCountdownStart.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  //this class variable will hold the setInterval, their only purpose is to be able to clear the interval
  //once the countdown reach 0
  interval: any = null;

  //get the user time and parse to a integer number, then set the time state to that value
  handleUserInput(e: React.ChangeEvent<HTMLInputElement>) {
    const numberValue = parseInt(e.target.value);

    this.setState({
      time: numberValue,
    });
  }

  //this function get the value from the state and pass it to the 'countdown' function to start
  //the countdown
  handleCountdownStart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.countdown(this.state.time);
  }

  //this function will update the time state once each second and will substract one from the time state
  countdown(tiempo: number) {
    if (tiempo <= 0) {
      return;
    }

    this.interval = setInterval(() => {
      if (tiempo === 0) {
        clearInterval(this.interval);
        return;
      }

      tiempo -= 1;
      this.setState({
        time: tiempo,
      });
    }, 1000);

    return;
  }

  render() {
    return (
      <div>
        Interval timer app
        <form onSubmit={this.handleCountdownStart}>
          <label>
            insert time
            <input type='text' onChange={this.handleUserInput} />
          </label>
          <button type='submit'>start timer</button>
        </form>
        <div>
          Time: <span>{this.state.time}</span>
        </div>
      </div>
    );
  }
}

/* 
  Agregar
  componentDidMount();
  componentWillUnmount();
*/

/* 

  estas secciones serán "readOnly=true"
  let something = variable.map(activity: any, rest: any => {
    <span class="element number">
      <label> //activity
        Actividad
        <input type="text"></input>
      </label>
      <label> //rest
        Duración
        <input type="text"/>
      </label>
    </span>
  });
*/
