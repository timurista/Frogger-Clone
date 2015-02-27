//mathranomVar
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.reset();
    this.sprite = 'images/enemy-bug.png';
    this.damage = 5;
    this.width = 10;
    this.height = 10;
}

Enemy.prototype.reset = function() {
    this.x = 0;
    this.y = getRandomInt(1,4)*rowStep+2;
    this.speed = getRandomInt(colStep,colStep*3);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+=this.speed*dt;
    if (this.x>WIDTH) {
        //console.log(this.x)
        this.reset();
    }
    //draw tracking info
    //ctx.fillStyle = "rgb(150,29,28)";
    //ctx.fillStyle = "blue";
    //ctx.strokeRect(this.x,this.y,this.width,this.height);
    //ctx.strokeRect(50,50,50,50);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//global vars to move player
var colStep = 101;
var rowStep = 80;
var boundHeight = 40;
var boundWidth = 40;
var WIDTH = 505;
var HEIGHT = 606;
var PlayerStartPositionX=colStep*2;
var PlayerStartPositionY=rowStep*5;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    this.width = boundWidth;
    this.height = boundHeight;
    this.reset();
    this.sprite = 'images/char-boy.png';
    this.score = 0;
}
Player.prototype.reset = function() {
    this.x = PlayerStartPositionX;
    this.y = PlayerStartPositionY;
}
Player.prototype.move = [0,0];

Player.prototype.update = function() {
    var newX = this.x+this.move[0];
    var newY = this.y+this.move[1];

    // check move is within limits of the game
    if (newX>=0 && newX<WIDTH && newY<=PlayerStartPositionY) {
        this.x = newX;
        this.y = newY;
        this.move = [0,0];
    }
    //condition where player scores or reaches end of road
    if (this.y<rowStep*1) {
        //player reaches end
        this.score+=5;
        this.reset();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    if (key=="up") {
        this.move[1]=-1*rowStep;
        this.move[0]=0;
    }
    else if (key=="down") {
        this.move[1]=rowStep;
        this.move[0]=0;
    }
    else if (key=="left") {
        this.move[0]=-1*colStep;
        this.move[1]=0;
    }
    else if (key=="right") {
        this.move[0]=colStep;
        this.move[1]=0;
    }

    console.log(key,this.move);

}
//new Enemies
var RockEnemy = function() {
    Enemy.call(this);
    this.sprite="images/Rock.png";
    //extra damage for this creature to player
    this.damage = 10;
}
RockEnemy.prototype = Object.create(Enemy.prototype);
RockEnemy.prototype.render = function() {
    var img = new Image();
    img.src = this.sprite;
    ctx.drawImage(img, this.x, this.y,
        img.width*0.8, img.height * 0.8);
}
RockEnemy.prototype.reset = function() {
    this.x = 0;
    this.y = getRandomInt(1,4)*rowStep+2;
    this.speed = 300;
}

//Van.prototype.constructor = Van;
//Van.prototype.grab = function() {};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy, new Enemy, new RockEnemy];

// Place the player object in a variable called player
var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Collectibles
var Collectible = function() {
    this.reset();
}
Collectible.prototype.reset = function() {
    this.CollectibleTypes = [
        ['images/Gem-Green.png',1],
        ['images/Gem-Blue.png',2],
        ['images/Gem-Orange.png',3],
    ];
    this.randomCollectibleType = this.CollectibleTypes[getRandomInt(0,this.CollectibleTypes.length)];
    this.sprite = this.randomCollectibleType[0];
    //to hold player points
    this.val = this.randomCollectibleType[1];
    //console.log(this.sprite,this.randomCollectibleType);
    //places the collectible in the road somewhere
    this.x = getRandomInt(1,5)*colStep;
    this.y = getRandomInt(1,4)*rowStep;
    this.height=20;
    this.width=10;
}
Collectible.prototype.render = function() {
    //rewrite render function the provided caching is buggy
    var img = new Image();
    img.src = this.sprite;
    ctx.drawImage(img, this.x+20, this.y+20,
        img.width*0.6, img.height * 0.6);
}

var collectible = new Collectible();

// HUD elements
var Clock = function() {
    this.reset();
}
Clock.prototype.reset = function() {
    this.startTime= Date.now();
    this.timeAllowed = 100.0;
    this.time = this.timeAllowed;
    }
Clock.prototype.update = function() {
    var secondsElapsed = (Date.now()-this.startTime)/1000;
    this.time=(this.timeAllowed-secondsElapsed).toFixed(0);
    this.render();
    }
Clock.prototype.render = function() {
    //clear background
    ctx.clearRect(0,0,WIDTH,50);

    //red text is time is less than 10, else lightblue
    if (this.time<=10) {
        ctx.fillStyle="red";
    } else {
        ctx.fillStyle="paleturquoise";
    }
    //draw new text for time
    var timeText = "TIME LEFT: "+this.time;
    ctx.font = "32pt Impact";
    ctx.fillText(timeText,WIDTH/2,40);

    ctx.strokeStyle="black";
    ctx.lineWidth = 2;
    ctx.strokeText(timeText,WIDTH/2,40);
}

var clock = new Clock;

//score
var ScoreDisplay = function() {
    this.reset();
}
ScoreDisplay.prototype.reset= function() {
    player.score = 0;
    this.score = player.score;
}

ScoreDisplay.prototype.update = function() {
    this.render();
}
ScoreDisplay.prototype.render = function() {
    //draw new text for time
    var scoreText = "Score: "+player.score;
    var fillColor = "white";
    if (player.score>0) {
        fillColor="lightgreen";
    }
    else if (player.score<0) {
        fillColor="red";
    }
    ctx.fillStyle=fillColor;
    ctx.font = "32pt Impact";
    ctx.fillText(scoreText,20,40);

    ctx.strokeStyle="black";
    ctx.lineWidth = 2;
    ctx.strokeText(scoreText,20,40);
}

var scoreDisplay = new ScoreDisplay;