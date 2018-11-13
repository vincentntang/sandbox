const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var timer = [0, 0, 0, 0]; //minutes,seconds, hundreths, thousandths [3,2,1,0]
var interval;
var timerRunning = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// timer[0] = minutes
// timer[1] = seconds
// timer[2] = hundredth second
// timer[3] = thousandth second

// Run a standard minute/second/hundredths timer:
function runTimer() {
  let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
  theTimer.innerHTML = currentTime
  timer[3]++; // thousandth seconds updated

  timer[0] = Math.floor((timer[3] / 100) / 60); // one minute = 6000 thousandth second
  timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60)); // one second = 100 thousandth seconds, 60 seconds = 1 minute
  timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
  // one hundredth second, one hundredth second = 100 thousandth seconds, one minute = 6000 thousandth seconds
}

// Match the text entered with the provided text on the page:
function spellCheck() {
  let textEntered = testArea.value; //grabs input
  let originTextMatch = originText.substring(0, textEntered.length); //Original Value

  if (textEntered == originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "#429890"; // teal
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "#65CCF3"; //green
    } else {
      testWrapper.style.borderColor = "#E95D0F"; // orange
    }
  }
  console.log(textEntered);
}

// Start the timer:
function start() {
  let textEnterdLength = testArea.value.length;
  if (textEnterdLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
  console.log(textEnterdLength);
}

// Reset everything:
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
  timerRunning = false;

  //Reset values
  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";

  console.log("reset button has been pressed!");
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false); //when key is let go
resetButton.addEventListener("click", reset, false);
