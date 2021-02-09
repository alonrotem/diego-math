const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

var floor = 448;

const keysdown = [];
const platforms = [];
/*
function Character(sprite, x, y, width, height, directionSpiteCoords)
{
    this.sprite = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.baseY = floor;
    this.width = width;
    this.height = height;
    this.directionSpiteCoords = directionSpiteCoords;
    this.speed = 2;
    this.currentSpriteMoveCoords = 1;
    this.jumpHeight = 170;
    this.jumpSpeed = 3;
    this.gravity = 0;//(this.jumpSpeed / this.jumpHeight) * 2;
    //don't change the running frame change too quickly
    this.jumpDirection = "";
    this.framesHold = 6;
    var curFrame = 0;
    this.walkspeed = 10;

    this.draw = function(interval) {
        var framespersec = 60;
        var pxperframejump = 8;
        var pxperframewalk = 8;

        this.jumpSpeed = (interval / 1000) * (framespersec * pxperframejump);
        this.walkspeed = (interval / 1000) * (framespersec * pxperframewalk);
        //console.log ("jumpspeed " + this.jumpSpeed);
        //4 px per frame
        //60 frames per second
        //240 px per second
        //example: elaped interval 30ms
        //240 px -> 1000s
        //7.2    -> 30ms
        //this.jumpSpeed = 60*60/1000 
        //---
        //gravity start with 0
        //each iteration: gravity += 10; 

        $("#info1").text("this.y=" + this.y);
        $("#info2").text("this.jumpSpeed=" + this.jumpSpeed);
        var spriteCoordX = 0;
        var spriteCoordY = 0;
        var direction = "X";
        if(keysdown["ArrowRight"] && this.x < 800-this.width)
        {
            this.x += this.walkspeed;
            direction = "R";

        }
        else if(keysdown["ArrowLeft"] && this.x > 0)
        {
            this.x -= this.walkspeed;
            direction = "L";          
        }
        //jumping
        if ((keysdown[" "] || keysdown["ArrowUp"]) || this.jumpDirection == "U")
        {
            direction = "J";
            //haven't started the jump yet: going up!
            if(!this.jumpDirection)
            {
                this.jumpDirection = "U";
                this.gravity = 0;
            }
            //going up
            if(this.jumpDirection == "U")
            {
                if(this.y > this.baseY - this.jumpHeight)
                {
                    $("#info3").text("gravity " + this.gravity);
                    console.log("jumping. gravity=" + this.gravity);
                    //console.log("jumping up")
                    direction = "J";
                    
                    this.y -= (this.jumpSpeed - this.gravity);
                    if((this.jumpSpeed - this.gravity) <= 0){
                        this.jumpDirection = "D";
                        $("#info3").text("max height");
                        console.log("max height")
                        this.jumpDirection = "D";
                        this.gravity = 0;                        
                    }
                    else
                        this.gravity += (this.jumpSpeed/100);
                    //this.jumpSpeed -= this.gravity;
                }
                else
                {
                    $("#info3").text("max height");
                    console.log("max height")
                    this.jumpDirection = "D";
                    this.gravity = 0;
                    //this.jumpSpeed = 4;
                }
            }
            /*
            //falling down
            else if(this.jumpDirection == "D")
            {
                if(this.y < this.baseY)
                {
                    this.y += this.jumpSpeed;
                    this.jumpSpeed += this.gravity;
                }
                for(var i=0; i < platforms.length; i++)
                {
                    console.log("checking platform " + i);
                    //landed on a platform?
                    if(platforms[i].isOnPlatform(this))
                    {
                        this.baseY = platforms[i].y - this.height;
                        this.y = this.baseY;
                        this.jumpSpeed = 4;
                        this.jumpDirection = "";
                        break;
                    }

                }
                //not landed yet...
                if(this.jumpDirection && this.y >= this.baseY)
                {
                    this.baseY = floor;
                    this.y = this.baseY;
                    this.jumpSpeed = 4;
                    this.jumpDirection = "";
                }                
            }*//*
        }

        if(this.jumpDirection != "U")
        {
            //falling
            var onPlatform = -1;
            for(var i=0; i < platforms.length; i++)
            {
                //console.log("checking platform " + i);
                if(platforms[i].isOnPlatform(this))
                {
                    onPlatform = i;
                    
                    this.baseY = platforms[i].y - this.height;
                    //console.log("On platform " + onPlatform);
                    break;
                }
            }
            $("#info4").text((onPlatform < 0)? "not onPlatform" : "onPlatform " + onPlatform);

            //console.log("falling")
            if(this.y < floor && onPlatform == -1)
            {
                //if()
                {
                    $("#info3").text("this.gravity=" + this.gravity);
                    console.log("falling. gravity=" + this.gravity);
                    direction = "J";
                    this.y += this.jumpSpeed + this.gravity;
                    //this.jumpSpeed += this.gravity;
                    this.gravity += (this.jumpSpeed/100);
                }
            }
            else

            {if(onPlatform != -1)
            {
                $("#info3").text("on platform");
                //console.log("hit a platform");
                this.jumpDirection = "";
                direction = (direction != "R" && direction != "L")?  "X" : direction;
                this.y = platforms[onPlatform].y - this.height;
                this.baseY = platforms[onPlatform].y - this.height;
                //this.jumpSpeed = 4;
            }
            else 
            {
                if(this.y >= floor)
                {
                    $("#info3").text("on floor");
                //console.log("hit the floor");
                this.jumpDirection = "";
                direction = (direction != "R" && direction != "L")?  "X" : direction;
                this.y = floor;
                this.baseY = floor;
                //this.jumpSpeed = 4;
                }
            }
            }
        }
        $("#info5").text("direction=" + direction + ", this.jumpDirection="+this.jumpDirection);

        //get frame for: standing or jumping
        if(direction == "X" || direction == "J")
        {
            spriteCoordX = this.width * this.directionSpiteCoords[direction][0];
            spriteCoordY = this.height * this.directionSpiteCoords[direction][1];            
        }
        //get frame for: walking left or right
        else
        {
            if(this.directionSpiteCoords[direction] && this.directionSpiteCoords[direction].length > 0)
            {
                //cycle the changing frames
                if(this.currentSpriteMoveCoords >= this.directionSpiteCoords[direction].length)
                {
                    this.currentSpriteMoveCoords = 0;
                }
                //get the current frame
                spriteCoordX = this.width * this.directionSpiteCoords[direction][this.currentSpriteMoveCoords][0];
                spriteCoordY = this.height * this.directionSpiteCoords[direction][this.currentSpriteMoveCoords][1];
                //move to the next frame only after reaching the frameHold threshold
                if(curFrame > this.framesHold)
                {
                    curFrame = 0;
                    this.currentSpriteMoveCoords++;
                }
                else
                {
                    curFrame++;
                }
            }
        }
        ctx.drawImage(this.sprite, spriteCoordX, spriteCoordY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}*/

function Platform(x, y, width)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 15;
    this.heightThreshold = 10;
    this.draw = function(){
        ctx.save();
        ctx.strokeStyle = "#84472a";
        ctx.fillStyle = "#c9764d";
        ctx.lineWidth = 3;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
    /*
      ***
      * *
      * *
      ***   
        =======
    */
    this.isOnPlatform = function (character) {
        if(
            (character.x + character.width > this.x && character.x < this.x + this.width) &&
            (character.y + character.height >= this.y && character.y + character.height <= this.y+this.heightThreshold)
            )
            /*
        if((character.x + character.width > this.x || 
           character.x < this.x + this.width) && 
           character.y + character.height < this.y + this.heightThreshold &&
           character.y > this.y)*/{
             //console.log("isOnPlatform: YES!!");
            
            return true;
        }
        //console.log("isOnPlatform: no..");
        return false;
    }
    platforms.push(this);
}

const background = new Image();
background.src = "images/background/backgroundColorGrass-scaled.png";
/*
const diego = new Character("images/sprites/diego.png", canvas.width / 2 - 48, floor, 96, 128,
    {
        "X": [0,0],
        "R": [[6,2], [7, 2], [8,2]],
        "L": [[2, 5], [1, 5], [0, 5]],
        "J": [4, 0]
    }
);*/
const platformsWidth = 100;
const platform1 = new Platform(90, 300, platformsWidth);
const platform2 = new Platform(canvas.width-90-platformsWidth, 300, platformsWidth);
const platform3 = new Platform(canvas.width/2 - platformsWidth /2, 200, platformsWidth);

//--------------------------------
// define the player.
// update() updates position and response to keyboard
// draw() draws the player
// start() sets start position and state
const player = function(sprite, x, y, width, height, directionSpiteCoords) {
    this.sprite = new Image();
    this.sprite.src = sprite;
    this.imageloaded = false;
    var that = this;
    this.sprite.onload = function(){ 
        that.imageloaded = true; 
    };
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = 0; // delta x and y
    this.dy = 0;
    //this.size = 20;
    this.color = 'lime';
    this.onGround = false;
    this.jumpPower = -10;  // power of jump smaller jumps higher eg -10 smaller than -5
    this.moveSpeed = 6;
    this.spriteCoordX = 0;
    this.spriteCoordY = 0;
    this.directionSpiteCoords = directionSpiteCoords;
    this.direction = "";
    this.onPlatform = -1;
    this.update = function() {
        this.onPlatform = -1;
        for(var i=0; i < platforms.length; i++)
        {
            //console.log("checking platform " + i);
            if(platforms[i].isOnPlatform(this))
            {
                this.onPlatform = i;
                
                this.y = platforms[i].y - this.height;
                //this.onGround = true;
                //console.log("On platform " + onPlatform);
                break;
            }
        }        
      // react to keyboard state
      if ((keysdown[" "] || keysdown["ArrowUp"]) && (this.onGround || this.onPlatform != -1)) { this.dy = this.jumpPower;
        this.direction = "J";
        $("#info2").text("Direction " + this.direction);
        $("#info1").text("Jumping");
        //this.spriteCoordX = this.width * this.directionSpiteCoords["J"][0];
        //this.spriteCoordY = this.height * this.directionSpiteCoords["J"][1];   
     }
      if (keysdown["ArrowLeft"]) { this.dx = -this.moveSpeed;
        this.direction = "L";
        $("#info1").text("Left");
        $("#info2").text("Direction " + this.direction);
        //this.spriteCoordX = this.width * this.directionSpiteCoords["L"][0][0];
        //this.spriteCoordY = this.height * this.directionSpiteCoords["L"][0][1];
     }
      if (keysdown["ArrowRight"]) { this.dx = this.moveSpeed;
        this.direction = "R";
        $("#info1").text("Right");
        $("#info2").text("Direction " + this.direction);
        //this.spriteCoordX = this.width * this.directionSpiteCoords["R"][0][0];
        //this.spriteCoordY = this.height * this.directionSpiteCoords["R"][0][1];        
     }
   
      // apply gravity drag and move player

      $("#info1").text((this.onPlatform != -1)? "!!On platform " + this.onPlatform: "Falling");

      this.dy += world.gravity;
      this.dy *= world.drag;
      this.dx *= this.onGround || this.onPlatform != -1 ? world.groundDrag : world.drag;
      this.x += this.dx;
      this.y += this.dy;

      //THIS MAY BE THE PROBLEM
      // test ground contact and left and right limits
      if ((this.y + this.height >= world.ground) || (this.onPlatform != -1 /*&& this.direction != "J"*/)) {
        this.y = (this.onPlatform == -1)? world.ground - this.height : platforms[this.onPlatform].y - this.height;
        //if(this.direction !="J")
         //   this.dy = 0;
        this.onGround = true;
        $("#info1").text((this.onPlatform == -1)? "on ground" : "on platform!! " + this.onPlatform);
        
        if(!this.direction)
        {
           this.direction = "X";
           $("#info2").text("Direction " + this.direction);
        }
        
      } else {
        this.onGround = false;
        if(this.direction == ""){
            this.direction = "J";
            $("#info2").text("Direction " + this.direction);
        }
            $("#info1").text((this.onPlatform != -1)? "~~On platform " + this.onPlatform: "~~still jumping");
      }
      if (this.x > ctx.canvas.width) {
        this.x -= ctx.canvas.width;
      } else if (this.x + this.width < 0) {
        this.x += ctx.canvas.width;
      }
    };
    this.draw = function(){
      //drawRect(this.x, this.y, this.size, this.size, this.color);
      console.log("this.direction=" + this.direction);
      console.log(this.direction + " : " + this.directionSpiteCoords[this.direction][0][0]);
      console.log(this.direction + " : " + this.directionSpiteCoords[this.direction][0][1]);
      this.spriteCoordX = this.width * this.directionSpiteCoords[this.direction][0][0];
      this.spriteCoordY = this.height * this.directionSpiteCoords[this.direction][0][1];         
      if(this.imageloaded)
        ctx.drawImage(this.sprite, this.spriteCoordX, this.spriteCoordY, this.width, this.height, this.x, this.y, this.width, this.height);
      this.direction = "";
    };
    this.start = function (){
      this.x = ctx.canvas.width / 2 - this.width / 2;
      this.y = world.ground - this.height;
      this.onGround = true;
      this.dx = 0;
      this.dy = 0;
    }
  }
  // define world
  const world = {
    gravity: 0.3, // strength per frame of gravity
    drag: 0.999, // play with this value to change drag
    groundDrag: 0.8,//0.9, // play with this value to change ground movement
    ground: floor
  }

  // From OP
function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
//--------------------------------


var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps)
{
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate(); 
}

/*
requestanimation frame
measure how much time from the previous frame
move speed according to px/time <- convert to px/required time
*/
p = new player("images/sprites/diego.png", canvas.width / 2 - 48, floor, 96, 128,
{
    "X": [[0,0]],
    "R": [[6,2], [7, 2], [8,2]],
    "L": [[2, 5], [1, 5], [0, 5]],
    "J": [[4, 0]]
}
);;
p.start();

function animate(fps)
{
    //requestAnimationFrame(animate);
    //setInterval(function(){
        now = Date.now();
        elapsed = now - then;
        then = now;
        //if(elapsed > fpsInterval)
        {
        //    then = now - (elapsed % fpsInterval);

            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            //bottle
            var tequila = new Image();
            tequila.src = "images/tequila-8bit-small.png";
            ctx.drawImage(tequila, 0, 0);

            //platforms
            for(var i=0; i < platforms.length; i++)
            {
                platforms[i].draw();
            }
            //diego.draw(elapsed);
            p.update();
            p.draw();            
        }    
    //},1000/fps);

    requestAnimationFrame(animate);
    //keysdown[' '] = true;
}
animate(155);

window.addEventListener("keydown", function(e){
    keysdown[e.key] = true;
});

window.addEventListener("keyup", function(e){
    delete keysdown[e.key];
});