/*
To Do:
1. Change input to an text input field
    a. Use regex to restrict to numbers
    b. Add a submit button or if the enter key is pressed
    c. Stop current session if the submit button is clicked during a session
2. clearSession function
3. pauseSession function
3. Add in breakTime function after startPlaying reaches 0
4. Update function names.
5. Reorder functions for ease of reading and organization. Emulate the MVC model
6. Connect to spotify to play music during pomodoro
    a. Ambient during the model.sessionTime
    b. Beats during the breakTime
*/

// Global Variables
var sessionLength = document.getElementById('session-time');
var breakLength = document.getElementById('break-time');
var sessionIncrease = document.getElementById('session-increase');
var sessionDecrease = document.getElementById('session-decrease');
var breakIncrease = document.getElementById('break-increase');
var breakDecrease = document.getElementById('break-decrease');
var play = document.getElementById('play');
var stop = document.getElementById('stop');
var pause = document.getElementById('pause');
var sessionTimer = document.getElementById('session-timer');
var sessionTime = 25 * 60;
var sessionProgress = sessionTime;
var breakTime = 5 * 60;
var breakProgress = breakTime;
var sessionOrBreak = 'session';

var selectSessionLength = document.getElementById("selectSessionLength");
var selectedSessionLength = selectSessionLength.options[selectSessionLength.selectedIndex].value;

console.log(selectedSessionLength);


var model = {
    sessionSetTime: 25,
    breakSetTime: 5,
    playStatus: 'stopped',
  updateSessionTime: function(event) {
    if (this.sessionSetTime === 0) {
      if (event.target.parentElement.id === 'session-increase') {
        this.sessionSetTime++;
      }
    } else if (this.sessionSetTime > 0) {
      if (event.target.parentElement.id === 'session-increase') {
        this.sessionSetTime++;
      } else if (event.target.parentElement.id === 'session-decrease') {
        this.sessionSetTime--;
      }
    }
    sessionTime = this.sessionSetTime * 60;
    sessionProgress = this.sessionSetTime * 60;
    sessionLength.textContent = this.sessionSetTime + ' minutes';
    sessionTimer.textContent = this.sessionSetTime + ' minutes';
  },
  updateBreakTime: function(event) {
    if (this.breakSetTime === 0) {
      if (event.target.parentElement.id === 'break-increase') {
        this.breakSetTime++;
      }
    } else if (this.breakSetTime > 0) {
      if (event.target.parentElement.id === 'break-increase') {
        this.breakSetTime++;
      } else if (event.target.parentElement.id === 'break-decrease') {
        this.breakSetTime--;
      }
    }
    breakTime = this.breakSetTime * 60;
    breakProgress = this.breakSetTime * 60;
    breakLength.textContent = this.breakSetTime + ' minutes';
  },
  startPlaying: function() {
    if(this.playStatus !== 'playing') {
      this.playStatus = 'playing';
      if(sessionOrBreak === 'session') {
        sessionCountdown();
      } else if(sessionOrBreak === 'break') {
        breakCountdown();
      }
    }

    function sessionCountdown() {
      sessionOrBreak = 'session';
      var sessionMinutes = Math.floor(sessionProgress / 60);
      var sessionSeconds = sessionProgress % 60;
      if (sessionSeconds < 10) {
        sessionSeconds = '0' + sessionSeconds;
      }
      if(sessionProgress === 0) {
        breakProgress = model.breakSetTime * 60;
        breakCountdown();
      }
      if (sessionProgress >= 0 && model.playStatus === 'playing') {
        if (sessionMinutes > 1) {
          sessionTimer.innerHTML = sessionMinutes + ' minutes, ' + sessionSeconds + ' seconds';
        } else {
          sessionTimer.innerHTML = sessionMinutes + ' minute, ' + sessionSeconds + ' seconds';
        }
        document.querySelector('.progress').value = (sessionProgress / sessionTime) * 100;
        sessionProgress--;
        window.setTimeout(sessionCountdown, 100);
      }
    }

    function breakCountdown() {
      sessionOrBreak = 'break';
      var breakMinutes = Math.floor(breakProgress / 60);
      var breakSeconds = breakProgress % 60;
      if (breakSeconds < 10) {
         breakSeconds = '0' +  breakSeconds;
      }
      if(breakProgress === 0) {
        sessionProgress = model.sessionSetTime * 60;
        sessionCountdown();
      }
      if (breakProgress >= 0 && model.playStatus === 'playing') {
        if (breakMinutes > 1) {
          sessionTimer.innerHTML = breakMinutes + ' minutes, ' + breakSeconds + ' seconds';
        } else {
          sessionTimer.innerHTML = breakMinutes + ' minute, ' + breakSeconds + ' seconds';
        }
        document.querySelector('.progress').value = (breakProgress / breakTime) * 100;
        breakProgress--;
        window.setTimeout(breakCountdown, 100);
      }
    }
  },
  stopPlaying: function() {
    sessionOrBreak = 'session';
    sessionProgress = this.sessionSetTime * 60;
    breakProgress = this.breakSetTime * 60;
    this.playStatus = 'stopped';
    sessionTimer.textContent = this.sessionSetTime + ' minutes';
  },
  pausePlaying: function() {
    this.playStatus = 'paused';
  }
};

var view = {
  setUpEventListeners: function() {
    sessionLength.textContent = model.sessionSetTime + ' minutes';
    breakLength.textContent = model.breakSetTime + ' minutes';
    sessionTimer.textContent = model.sessionSetTime + ' minutes, 00 seconds';
    sessionIncrease.addEventListener('click', model.updateSessionTime.bind(model));
    sessionDecrease.addEventListener('click', model.updateSessionTime.bind(model));
    breakIncrease.addEventListener('click', model.updateBreakTime.bind(model));
    breakDecrease.addEventListener('click', model.updateBreakTime.bind(model));
    play.addEventListener('click', model.startPlaying.bind(model));
    stop.addEventListener('click', model.stopPlaying.bind(model));
    pause.addEventListener('click', model.pausePlaying.bind(model));
  }
};

view.setUpEventListeners();
