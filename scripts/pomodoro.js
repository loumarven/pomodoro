/* CONSTANTS */
const OK = 0;
const ERROR = -1;
const WORK = "WORK";
const BREAK = "BREAK";
const START = "START";
const PAUSE = "PAUSE";
const RESUME = "RESUME";


function Pomodoro(timerElement, notifyFinishedTimer) {
  const STOPPED = "STOPPED";
  const RUNNING = "RUNNING";
  const PAUSED = "PAUSED";
  const DEFWORKMIN = 25;
  const DEFSHORTBREAKMIN = 5;
  const DEFLONGBREAKMIN = 10;

  let workMinutes = DEFWORKMIN;
  let shortBreakMinutes = DEFSHORTBREAKMIN;
  let longBreakMinutes = DEFLONGBREAKMIN;
  let minutes = workMinutes;
  let seconds = 0;
  let state = STOPPED;
  let currentTimer = WORK;
  let workInterval = 0;
  let breakInterval = 0;
  let pomodoroCount = 0;
  let workAlarm = null;
  let breakAlarm = null;

  this.getState = function getState() {
      return state;
  };

  this.getCurrentTimer = function getCurrentTimer() {
    return currentTimer;
  };

  this.getWorkTimer = function getWorkTimer() {
    return workMinutes;
  }

  this.getShortBreakTimer = function getShortBreakTimer() {
    return shortBreakMinutes;
  }

  this.getLongBreakTimer = function getLongBreakTimer() {
    return longBreakMinutes;
  }

  this.setWorkTimer = function setWorkTimer(userMinutes) {
    workMinutes = userMinutes;
  }

  this.setShortBreakTimer = function setShortBreakTimer(userMinutes) {
    shortBreakMinutes = userMinutes;
  }

  this.setLongBreakTimer = function setLongBreakTimer(userMinutes) {
    longBreakMinutes = userMinutes;
  }

  this.setWorkAlarm = function setWorkAlarm(audio) {
    workAlarm = audio;
  }

  this.setBreakAlarm = function setBreakAlarm(audio) {
    breakAlarm = audio;
  }

  this.startWork = function startWork() {
    if (state != STOPPED) {
      return ERROR;
    }

    let alarm = new Audio(workAlarm);
    if (alarm) {
      alarm.play();
    }

    currentTimer = WORK;
    startTimer();
    state = RUNNING;

    return OK;
  };

  this.pauseWork = function pauseWork() {
    if (state == PAUSED) {
      return ERROR;
    }

    clearInterval(workInterval);
    state = PAUSED;

    return OK;
  };

  this.resumeWork = function resumeWork() {
    if (state != PAUSED) {
      return ERROR;
    }

    startTimer();
    state = RUNNING;

    return OK;
  };

  this.stopWork = function stopWork() {
    if (state == STOPPED) {
      return ERROR;
    }

    stopTimer();
    state = STOPPED;

    return OK;
  };

  this.startBreak = function startBreak() {
    if (state != STOPPED) {
      return ERROR;
    }

    let alarm = new Audio(breakAlarm);
    if (alarm) {
      alarm.play();
    }

    currentTimer = BREAK;
    startTimer();
    state = RUNNING;

    return OK;
  }

  this.pauseBreak = function pauseBreak() {
    if (state == PAUSED) {
      return ERROR;
    }

    clearInterval(breakInterval);
    state = PAUSED;

    return OK;
  };

  this.resumeBreak = function resumeBreak() {
    if (state != PAUSED) {
      return ERROR;
    }

    startTimer();
    state = RUNNING;

    return OK;
  };

  this.stopBreak = function stopBreak() {
    if (state == STOPPED) {
      return ERROR;
    }

    stopTimer();
    state = STOPPED;

    return OK;
  };


  // private methods
  function startTimer() {
    timerElement.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);

    if (currentTimer == WORK) {
      workInterval = setInterval(runTimer, 1000);
    } else if (currentTimer == BREAK) {
      breakInterval = setInterval(runTimer, 1000);
    }
  }

  function runTimer() {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }

    timerElement.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);

    if (minutes == 0 && seconds == 0) {
      timerElement.dispatchEvent(new Event("finishedTimer"));
    }
  }

  function stopTimer() {
    clearInterval(workInterval);
    clearInterval(breakInterval)
    minutes = workMinutes;
    seconds = 0;
    workInterval = 0;
    breakInterval = 0;
    currentTimer = WORK;

    timerElement.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);
  }

  function makeTwoDigits(num) {
    return num < 10 ? "0" + num.toString() : num.toString();
  }


  /* event listener triggered when a timer finishes */
  timerElement.addEventListener("finishedTimer", (e) => {
    let finishedTimer = currentTimer;
    let alarm;

    state = STOPPED;
    seconds = 0;

    if (currentTimer == WORK) { // finished work minutes, take a break
      clearInterval(workInterval);

      pomodoroCount++;
      if (pomodoroCount == 4) {
        minutes = longBreakMinutes;
        pomodoroCount = 0;
      } else {
        minutes = shortBreakMinutes;
      }

      this.startBreak();
    } else if (currentTimer == BREAK) { // finished break minutes, back to work
      clearInterval(breakInterval);

      minutes = workMinutes;
      this.startWork();
    }

    notifyFinishedTimer(finishedTimer);
  });
}
