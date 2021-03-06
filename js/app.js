/*
To Do:
6. Connect to spotify to play music during pomodoro
    a. Ambient during the model.sessionTime
    b. Beats during the breakTime
7. Comment Code
*/

// Global Variables
var controls = document.getElementById('controls');
var play = document.getElementById('play');
var stop = document.getElementById('stop');
var pause = document.getElementById('pause');
var sessionTimer = document.getElementById('session-timer');
var sessionTime = 25 * 60;
var sessionProgress = sessionTime;
var breakTime = 5 * 60;
var breakProgress = breakTime;
var sessionOrBreakText = document.getElementById('sessionOrBreakText');
var sessionOrBreak = 'session';
var progressBar = document.getElementById('progress');
progressBar.style.display = 'none';

var selectSessionLength = document.getElementById("selectSessionLength");
var selectedSessionLength = selectSessionLength.options[selectSessionLength.selectedIndex].value;
var selectBreakLength = document.getElementById("selectBreakLength");
var selectedBreakLength = selectBreakLength.options[selectBreakLength.selectedIndex].value;

var model = {
    sessionSetTime: 25,
    breakSetTime: 5,
    playStatus: 'stopped',
  startPlaying: function() {
    progressBar.style.display = '';

    if(this.playStatus === 'stopped') {
      this.sessionSetTime = selectSessionLength.options[selectSessionLength.selectedIndex].value;
      sessionTime = this.sessionSetTime * 60;
      sessionProgress = this.sessionSetTime * 60;
      sessionTimer.textContent = this.sessionSetTime + ' minutes';

      this.breakSetTime = selectBreakLength.options[selectBreakLength.selectedIndex].value;
      breakTime = this.breakSetTime * 60;
      breakProgress = this.breakSetTime * 60;
      sessionOrBreak = 'session';
    }

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
        sessionOrBreakText.innerHTML = 'Session';
        document.querySelector('.progress').value = (sessionProgress / sessionTime) * 100;
        progressBar.classList.remove('is-warning');
        progressBar.classList.add('is-info');
        play.classList.add('active-play-session');
        sessionProgress--;
        window.setTimeout(sessionCountdown, 1000);
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
        sessionOrBreakText.innerHTML = 'Break';
        document.querySelector('.progress').value = (breakProgress / breakTime) * 100;
        progressBar.classList.remove('is-info');
        progressBar.classList.add('is-warning');
        play.classList.add('active-play-break');
        breakProgress--;
        window.setTimeout(breakCountdown, 1000);
      }
    }
  },
  stopPlaying: function() {
    progressBar.style.display = 'none';
    play.classList.remove('active-play-session');
    play.classList.remove('active-play-break');
    sessionOrBreakText.innerHTML = '';
    progressBar.classList.remove('is-warning');
    progressBar.classList.remove('is-info');
    sessionProgress = this.sessionSetTime * 60;
    breakProgress = this.breakSetTime * 60;
    this.playStatus = 'stopped';
    sessionTimer.innerHTML = '';
    document.querySelector('.progress').value = 100;
  },
  pausePlaying: function() {
    play.classList.remove('active-play-session');
    play.classList.remove('active-play-break');
    progressBar.classList.remove('is-warning');
    progressBar.classList.remove('is-info');
    this.playStatus = 'paused';
  }
};

var view = {
  setUpEventListeners: function() {
    play.addEventListener('click', model.startPlaying.bind(model));
    stop.addEventListener('click', model.stopPlaying.bind(model));
    pause.addEventListener('click', model.pausePlaying.bind(model));
  }
};

view.setUpEventListeners();
