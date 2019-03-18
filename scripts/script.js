let timerElement = document.querySelector("#timer");
let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let pomodoroMode = document.querySelector("#mode");
let pomodoroCount = 0;

let pomodoro = new Pomodoro(timerElement, handleFinishedTimer);
pomodoro.setWorkAlarm("audio/start_work.mp3");
pomodoro.setBreakAlarm("audio/start_break.mp3");

timerElement.textContent = pomodoro.getWorkTimer().toString() + ":00";
pomodoroMode.textContent = pomodoro.getCurrentTimer();

/* event listeners for start and stop buttons */
start.addEventListener("click", (e) => {
  let timer = pomodoro.getCurrentTimer();

  if (timer == WORK) {
    if (start.textContent == START) {
      pomodoro.startWork();
      start.textContent = PAUSE;
    } else if (start.textContent == PAUSE) {
      pomodoro.pauseWork();
      start.textContent = RESUME;
    }  else if (start.textContent == RESUME) {
      pomodoro.resumeWork();
      start.textContent = PAUSE;
    }
  } else if (timer == BREAK) {
    if (start.textContent == PAUSE) {
      pomodoro.pauseBreak();
      start.textContent = RESUME;
    } else if (start.textContent == RESUME) {
      pomodoro.resumeBreak();
      start.textContent = PAUSE;
    }
  }
});

stop.addEventListener("click", (e) => {
  let timer = pomodoro.getCurrentTimer();

  if (timer == WORK) {
    pomodoro.stopWork();
  } else if (timer == BREAK) {
    pomodoro.stopBreak();
  }

  start.textContent = START;
});

/* callback function to be executed each time a timer finishes */
function handleFinishedTimer(timer) {
  if (timer == WORK) {
    pomodoroCount++;
    let pomodoroIcon = document.querySelector(".pomodoro-icons > img:nth-child(" +
                          pomodoroCount + ")");
    pomodoroIcon.style.visibility = "visible";

    pomodoroMode.textContent = BREAK;
  } else if (timer == BREAK) {
    if (pomodoroCount == 4) {
      let pomodoroIcons = document.querySelectorAll(".pomodoro-icons > img");
      pomodoroIcons.forEach(icon => {
        icon.style.visibility = "hidden";
      });
      pomodoroCount = 0;
    }

    pomodoroMode.textContent = WORK;
  }
}
