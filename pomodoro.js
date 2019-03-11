/* TODO:
  1. Implement break periods (5 minutes?)
  2. Sound alarm when timer expires
*/

/* CONSTANTS */
const START = "START";
const PAUSE = "PAUSE";
const RESUME = "RESUME";
const WORK = "WORK";
const BREAK = "BREAK";
const WORKMIN = 25;
const BREAKMIN = 5;
const DEFAULT_SEC = 0;

/* GLOBAL VARIABLES */
let timer = document.querySelector("#timer");
let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let mode = document.querySelector("#mode");
let minutes = WORKMIN;
let seconds = DEFAULT_SEC;
let state = WORK;
let isStarted = false;
let isPaused = false;
let workInterval = 0;
let breakInterval = 0;


/* helper function to transform a one-digit number to two digits */
function makeTwoDigits(num) {
  return num < 10 ? "0" + num.toString() : num.toString();
}

function runTimer() {
  seconds--;
  if (seconds < DEFAULT_SEC) {
    seconds = 59;
    minutes--;
  }

  timer.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);

  if (minutes == 0 && seconds == 0) {
    if (state == WORK) {
      timer.dispatchEvent(new Event("donePomodoro"));
    } else if (state == BREAK) {
      timer.dispatchEvent(new Event("doneBreak"));
    }
  }
}

function startTimer() {
  let audio;

  timer.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);

  if (state == WORK) {
    audio = new Audio("audio/start_work.mp3");
    audio.play();

    if (!isPaused) {
      minutes = WORKMIN;
      seconds = DEFAULT_SEC;
    }

    workInterval = setInterval(runTimer, 1000);
  } else if (state == BREAK) {
    audio = new Audio("audio/start_break.mp3");
    audio.play();

    if (!isPaused) {
      minutes = BREAKMIN;
      seconds = DEFAULT_SEC;
    }

    breakInterval = setInterval(runTimer, 1000);
  }

  isStarted = true;
  start.textContent = PAUSE;
}

function stopTimer() {
  clearInterval(workInterval);
  clearInterval(breakInterval)
  minutes = WORKMIN;
  seconds = DEFAULT_SEC;
  isStarted = false;
  workInterval = 0;
  breakInterval = 0;

  timer.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);
  start.textContent = START;
  mode.textContent = WORK;
}


/* event listeners for start and stop buttons */
start.addEventListener("click", (e) => {
  if (!isStarted) {
    startTimer();
    isPaused = false;
  } else {
    if (state == WORK) {
      clearInterval(workInterval);
    } else if (state == BREAK) {
      clearInterval(breakInterval);
    }

    isStarted = false;
    isPaused = true;
    start.textContent = RESUME;
  }
});

stop.addEventListener("click", stopTimer);


/* event listeners for custom events */
timer.addEventListener("donePomodoro", (e) => {
  clearInterval(workInterval);
  mode.textContent = BREAK;
  state = BREAK;
  startTimer();
});

timer.addEventListener("doneBreak", (e) => {
  clearInterval(breakInterval);
  mode.textContent = WORK;
  state = WORK;
  startTimer();
});
