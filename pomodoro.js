/* TODO:
  1. Implement break periods (5 minutes?)
  2. Sound alarm when timer expires
*/

/* CONSTANTS */
const START = "START";
const PAUSE = "PAUSE";
const RESUME = "RESUME";
const PMDRMIN = 25;
const PMDRSEC = 60;

/* GLOBAL VARIABLES */
let timer = document.querySelector("#timer");
let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let minutes = PMDRMIN;
let seconds = PMDRSEC;
let isStarted = false;
let interval = 0;

/* helper function to transform a one-digit number to two digits */
function makeTwoDigits(num) {
  return num < 10 ? "0" + num.toString() : num.toString();
}

function runPomodoro() {
  seconds--;
  if (seconds == 59) {
    minutes--;
  }

  if (minutes == 0 && seconds == 0) {
    stopPomodoro();
    return;
  }

  timer.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);

  if (seconds == 0) {
    seconds = PMDRSEC;
  }
}

function stopPomodoro() {
  clearInterval(interval);
  minutes = PMDRMIN;
  seconds = PMDRSEC;
  isStarted = false;
  interval = 0;

  timer.textContent = "25:00";
  start.textContent = START;
}


/* event listeners for start and stop buttons */
start.addEventListener("click", (e) => {
  if (!isStarted) {
    interval = setInterval(runPomodoro, 1000);
    isStarted = true;
    start.textContent = PAUSE;
  } else {
    clearInterval(interval);
    isStarted = false;
    start.textContent = RESUME;
  }
});

stop.addEventListener("click", stopPomodoro);
