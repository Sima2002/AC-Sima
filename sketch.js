var arr = [];

var smoothMicLevel = 0;
var n = 0;
var song;
var button;
var amplitude;
var c = 55;
var size
var an = 169.5; //179.5 sirun a
var zoom = 1000;

// function preload() {
//   song = loadSound("audio/zemfira.mp3");
// }


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB);
  angleMode(DEGREES);
  slider = createSlider(0, 1, 0.5, 0.01);
  button = createButton("Listen");
  button.mousePressed(toggleListen);
  mic = new p5.AudioIn()
  mic.start();

  for (let n = 0; n < 5000; n++) {

    var a = n * an;

    var r = c * sqrt(n) * n / zoom
    var col = a % 256;
    size = cos(n) * 1.5 + 2.5;
    var x = r * sin(a) + width / 2;
    var y = r * cos(a) + height / 2;

    arr.push(new Character(x, y, col, size));

  }
  // while (n < 4000) {  
  //   var a = n * an;

  //   var r = c * sqrt(n) * n / zoom
  //   var col = a % 256;    // n* sin(n)*2/200;
  //   size = cos(n) * 1.5 + 2.5;
  //   var x = r * sin(a) + width / 2;
  //   var y = r * cos(a) + height / 2;

  //   arr.push(new Character(x, y, col, size));
  //   n++;
  // }

}

function draw() {
  micLevel = mic.getLevel();
  smoothMicLevel = lerp(smoothMicLevel, micLevel, 0.2);
  zoom += 10000 * smoothMicLevel;
  console.log(smoothMicLevel)
  // song.setVolume(slider.value());

  // var vol = amplitude.getLevel();
  // var diam = map(vol, 0, 0.2, 100, height);
  //console.log(frameRate);
  background(0);
  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    v.behaviors();
    v.update();
    v.show();
  }

  if (mouseIsPressed || (keyIsPressed && key == ' ')) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].pos = createVector(random(width) * 0.1, random(height) * 0.1)
    }
  }


  if (keyIsPressed) {


    // if (frameRate >= 1000) {
    //   for (let i = 0; i < 10; i++) {
    //     zoom -= 100;

    //   }
    // }
    if (key == '+') zoom -= 100;
    else if (key == '-') zoom += 100;
    else if (key == 'r') zoom *= -1;
    // else if (key == 'o') zoom *= -8;
    else if (key == 'o') zoom *= 20;
    console.log(zoom)



    an = 169.5;

    for (var i = 0; i < arr.length; i++) {

      an -= 0.001;
      var a = i * an;
      var r = c * sqrt(i) * i / zoom;
      var x = r * sin(a) + width / 2;
      var y = r * cos(a) + height / 2;


      arr[i].target = createVector(x, y);
    }
  }

}


function Character(x, y, col, h) {
  this.pos = createVector(random(width) * 1, random(height) * 1);
  this.acc = createVector();
  this.vel = createVector();
  this.target = createVector(x, y)
  this.maxspeed = 13;
  this.maxforce = 15;
  this.col = col;
  this.h = h;
}

Character.prototype.behaviors = function () {
  var arrive = this.arrive(this.target);

  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  flee.mult(5);
  this.applyForce(flee);
  this.applyForce(arrive)

}

Character.prototype.flee = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();

  if (d < 80) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel)
    steer.limit(this.maxforce)

    return steer;
  }

  else return createVector(0, 0)
}

Character.prototype.arrive = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 80) {
    speed = map(d, 0, 100, 0.2, this.maxspeed)
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel)
  steer.limit(this.maxforce)
  return steer;
}

Character.prototype.applyForce = function (f) {
  this.acc.add(f);
}


Character.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);

}

Character.prototype.show = function () {
  fill(this.col, 255, 255);
  //strokeWeight(3)
  noStroke();
  ellipse(this.pos.x, this.pos.y, this.h + 3, this.h + 3)
}

// function togglePlay() {
//   if (!song.isPlaying()) {
//     song.loop();
//     button.html("Pause");
//   } else {
//     song.stop();
//     button.html("Play");
//   }
// }
function toggleListen() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    text('listening to audio', width / 2, height / 2);
    button.html("Stop");
  } else {
    text('click Play button to start', width / 2, height / 2);

    button.html("Listen");
  }
}