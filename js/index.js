// functions: strictMode(), initialize(), start(), beginInterval(), lightenUp(), beepIn(), darkDown(), stopLight()
// buttonClicked(), buttonUp(), compare(), gameOver()


var computerArr = void 0;
var playerArr = void 0;
var myLightFunc = null; // lights up button upon click
var myDarkFunc = null; // re-darkens button after a second
var i = void 0; // iterator through the playerArr
var active = true; // if true, computer sequence is active and player cannot press buttons

var c = void 0; // count

var buttons = document.querySelectorAll(".button");
for (var _i = 0; _i < buttons.length; _i++) {
  buttons[_i].addEventListener("mousedown", buttonClicked, false);
  buttons[_i].addEventListener("mouseup", buttonUp, false);
}

var reset = document.getElementById("reset");
reset.addEventListener("click", initialize, false);

var strict = document.getElementById("strict");
strict.addEventListener("click", strictMode, false); // change button background color when true
var s = false; // strict mode

var context = new AudioContext();

var audioblue = context.createOscillator();
var b = context.createGain();
b.gain.value = 0;
audioblue.frequency.value = 329.63;
audioblue.type = "sine";
audioblue.connect(b);
b.connect(context.destination);
audioblue.start();

var audiored = context.createOscillator();
var r = context.createGain();
r.gain.value = 0;
audiored.frequency.value = 261.63;
audiored.type = "sine";
audiored.connect(r);
r.connect(context.destination);
audiored.start();

var audiogreen = context.createOscillator();
var g = context.createGain();
g.gain.value = 0;
audiogreen.frequency.value = 220;
audiogreen.type = "sine";
audiogreen.connect(g);
g.connect(context.destination);
audiogreen.start();

var audioyell = context.createOscillator();
var y = context.createGain();
y.gain.value = 0;
audioyell.frequency.value = 164.81;
audioyell.type = "sine";
audioyell.connect(y);
y.connect(context.destination);
audioyell.start();

var audioerr = context.createOscillator();
var e = context.createGain();
e.gain.value = 0;
audioerr.frequency.value = 110;
audioerr.type = "triangle";
audioerr.connect(e);
e.connect(context.destination);
audioerr.start();

function strictMode() {
  s = !s;
  if (s) {
    document.getElementById("strict").style.cssText = "background-color: #ffce00";
  } else {
    document.getElementById("strict").style.cssText = "background-color: #a9b53a";
  }
}

function initialize() {

  if (!context) {

    // Sorry, but the game won't work for you
    alert('Sorry, but the Web Audio API is not supported by your browser.' + ' Please, consider downloading the latest version of ' + 'Google Chrome or Mozilla Firefox');
  } else {
    stopLight(); // if light sequence is running, clear it (if start is pressed in middle of computer sequence)
    computerArr = [];
    playerArr = [];
    c = 0; // count
    i = 0; // iterator through playerArr
    start();
  }
}

function start() {
  var rand = Math.floor(Math.random() * 4);
  switch (rand) {// convert to text so that array items will align with HTML IDs
    case 0:
      computerArr.push("zero");
      break;

    case 1:
      computerArr.push("one");
      break;

    case 2:
      computerArr.push("two");
      break;

    case 3:
      computerArr.push("three");
      break;
  }

  c++;
  $(".inner").html(c);
  // console.log(computerArr);
  beginInterval();
}

function beginInterval() {
  active = true; // computerArr sequence is beginning
  i = 0;
  var interval = 1800;
  if (c > 12) {
    // increase speed as count increases
    interval = 1050;
  } else if (c > 8) {
    interval = 1200;
  } else if (c > 5) {
    interval = 1500;
  }

  myLightFunc = setInterval(function () {
    lightUp(computerArr);
  }, interval);
}

// handle all beeps and light ups
// called during computerArr sequence and on user click
function beepIn(q) {
  // takes a string
  var elem = document.getElementById(q);
  switch (q) {
    case "zero":
      b.gain.setTargetAtTime(1, context.currentTime, 0.015);
      $(elem).css("background-color", "#1c8cff");
      break;

    case "one":
      r.gain.setTargetAtTime(1, context.currentTime, 0.015);
      $(elem).css("background-color", "#ff4c4c");
      break;

    case "two":
      g.gain.setTargetAtTime(1, context.currentTime, 0.015);
      $(elem).css("background-color", "#13ff7c");
      break;

    case "three":
      y.gain.setTargetAtTime(1, context.currentTime, 0.015);
      $(elem).css("background-color", "#fed93f");
      break;
  }
}

function lightUp(arr) {
  beepIn(arr[i]);

  var quad = arr[i];

  myDarkFunc = setInterval(function () {
    darkDown(quad);
  }, 1000);
  i++;
  if (i == computerArr.length) {
    setTimeout(function () {
      active = false;
    }, 1050); // wait addtl 50ms from until myDarkFunc is finished
    stopLight(myLightFunc);
  }
}

function darkDown(btn) {
  // takes a string
  var elem = document.getElementById(btn);
  if (btn == "zero") {
    b.gain.setTargetAtTime(0, context.currentTime, 0.015);
    $(elem).css("background-color", "#023991");
  } else if (btn == "one") {
    r.gain.setTargetAtTime(0, context.currentTime, 0.015);
    $(elem).css("background-color", "#910202");
  } else if (btn == "two") {
    g.gain.setTargetAtTime(0, context.currentTime, 0.015);
    $(elem).css("background-color", "#008e02");
  } else if (btn == "three") {
    y.gain.setTargetAtTime(0, context.currentTime, 0.015);
    $(elem).css("background-color", "#ccc000");
  }
  clearInterval(myDarkFunc); // clears interval 'start'ed each time through lightUp
}

function stopLight() {
  clearInterval(myLightFunc);
}

function buttonClicked(square) {
  if (!active) {
    // only allow button clicks when computer sequence is inactive
    var pushed = square.target.id;
    playerArr.push(pushed);
    var x = compare();
    if (!x) {
      // if wrong click
      setTimeout(function () {
        e.gain.setTargetAtTime(1, context.currentTime, 0.015);
      }, 33);
      setTimeout(function () {
        e.gain.setTargetAtTime(0, context.currentTime, 0.015);
      }, 950);
      if (s) {
        // if wrong click and also in strict mode
        gameOver();
      } else {
        // if wrong click but not in strict mode
        // console.log("Try again");
        playerArr = [];
        stopLight(myLightFunc); // stop computer sequence
        beginInterval();
      }
    } else {
      beepIn(pushed); // handle beep and light up
    }

    // console.log(playerArr);
  }
}

function buttonUp(square) {
  if (!active) {
    var pushed = square.target.id;
    darkDown(pushed); // end beep and re-darken button
    if (playerArr.length == computerArr.length) {
      // if correct array, clear playerArr and pick new number for computerArr
      playerArr = [];
      start();
    }
  } // if playerArr len is not yet == to computerArr len, no code is executed, program simply waits for another button to be pushed by user
}

function compare() {
  var i = playerArr.length - 1; // check most recent entry
  return playerArr[i] == computerArr[i];
}

function gameOver() {
  computerArr = [];
  playerArr = [];
  active = true; // prevents further player clicks
  // console.log("You lose");
}