/* CONSTANTS */
const START = "START";
const PAUSE = "PAUSE";
const RESUME = "RESUME";
const WORK = "WORK";
const BREAK = "BREAK";
const WORKMIN = 25;
const SHORTBREAKMIN = 5;
const LONGBREAKMIN = 10;
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
let isStopped = true;
let workInterval = 0;
let breakInterval = 0;
let pomodoroCount = 0;


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
    if (!isPaused) {
      audio = new Audio("audio/start_work.mp3");
      audio.play();
    }

    workInterval = setInterval(runTimer, 1000);
  } else if (state == BREAK) {
    if (!isPaused) {
      audio = new Audio("audio/start_break.mp3");
      audio.play();
    }

    breakInterval = setInterval(runTimer, 1000);
  }

  mode.textContent = state;
  start.textContent = PAUSE;
}

function stopTimer() {
  clearInterval(workInterval);
  clearInterval(breakInterval)
  minutes = WORKMIN;
  seconds = DEFAULT_SEC;
  isStarted = false;
  isPaused = false;
  isStopped = true;
  workInterval = 0;
  breakInterval = 0;
  state = WORK;

  timer.textContent = makeTwoDigits(minutes) + ":" + makeTwoDigits(seconds);
  start.textContent = START;
  mode.textContent = WORK;
}


/* event listeners for start and stop buttons */
start.addEventListener("click", (e) => {
  if (isStopped || isPaused) { // action: start/resume
    startTimer();

    isStarted = true;
    isPaused = false;
    isStopped = false;
  } else if (isStarted) { // action: pause
    if (state == WORK) {
      clearInterval(workInterval);
    } else if (state == BREAK) {
      clearInterval(breakInterval);
    }

    isPaused = true;
    isStopped = false;

    start.textContent = RESUME;
  }
});

stop.addEventListener("click", stopTimer);


/* event listeners for custom events */
timer.addEventListener("donePomodoro", (e) => {
  clearInterval(workInterval);

  pomodoroCount++;
  document.querySelector(".pomodoro-icons > img:nth-child(" +
                          pomodoroCount + ")").style.visibility = "visible";

  state = BREAK;
  minutes = pomodoroCount == 4 ? LONGBREAKMIN : SHORTBREAKMIN;
  seconds = DEFAULT_SEC;
  mode.textContent = BREAK;

  startTimer();
});

timer.addEventListener("doneBreak", (e) => {
  clearInterval(breakInterval);

  if (pomodoroCount == 4) {
    let pomodoroIcons = document.querySelectorAll(".pomodoro-icons > img");
    pomodoroIcons.forEach(icon => {
      icon.style.visibility = "hidden";
    });
    pomodoroCount = 0;
  }

  state = WORK;
  minutes = WORKMIN;
  seconds = DEFAULT_SEC;
  mode.textContent = WORK;

  startTimer();
});
