var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

//object literal
var mouse = {
  x: undefined,
  y: undefined
};

var maxRadius = 40;
// var minRadius = 2;

var colorArray = ["#0D1B2A", "#1B263B", "#415A77", "#778DA9", "#E0E1DD"];

window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  console.log(mouse);
}); // Called everytime mouse moves

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  init();
}); // ensures canvas is always same size as window on reesize

var circleArray = [];

function init() {
  circleArray = [];
  for (var i = 0; i < 200; i++) {
    var radius = Math.random() * 3 + 1; // different sized circles with at least size 1
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 8;
    var dy = (Math.random() - 0.5) * 8;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

// Constructor Function (object blueprint)
function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius; // modified
  this.minRadius = radius; // will not be modified
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)]; // Set color here not in this.draw else is constantly switches colors

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color; // Customize colors
    c.fill();
  };

  this.update = function() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // If our mouse is 50px or less to the center (x and y), do something
    if (
      mouse.x - this.x < 50 &&
      mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 &&
      mouse.y - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > 2) {
      if (this.radius > this.minRadius) {
        this.radius -= 1; // Reset to its original size
      }
    }

    this.draw();
  };
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}
init();
animate();
