const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

var floor = 320;

const keysdown = [];
const platforms = [];

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
    this.speed = 3;
    this.currentSpriteMoveCoords = 1;
    this.jumpHeight = 170;
    this.jumpSpeed = 4;
    this.gravity = (this.jumpSpeed / this.jumpHeight) * 2;
    //don't change the running frame change too quickly
    this.jumpDirection = "";
    this.framesHold = 6;
    var curFrame = 0;

    this.draw = function() {
        $("#info1").text("this.baseY=" + this.baseY);
        $("#info2").text("this.y=" + this.y);
        var spriteCoordX = 0;
        var spriteCoordY = 0;
        var direction = "X";
        if(keysdown["ArrowRight"] && this.x < 800-this.width)
        {
            this.x += this.speed;
            direction = "R";

        }
        else if(keysdown["ArrowLeft"] && this.x > 0)
        {
            this.x -= this.speed;
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
            }
            //going up
            if(this.jumpDirection == "U")
            {
                if(this.y > this.baseY - this.jumpHeight)
                {
                    $("#info3").text("jumping up to " + (this.baseY - this.jumpHeight));
                    console.log("jumping up")
                    direction = "J";
                    this.y -= this.jumpSpeed;
                    this.jumpSpeed -= this.gravity;
                }
                else
                {
                    $("#info3").text("max height");
                    console.log("max height")
                    this.jumpDirection = "D";
                    this.jumpSpeed = 4;
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
            }*/
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
                    $("#info3").text("falling");
                    //console.log("not on platform. falling.");
                    direction = "J";
                    this.y += this.jumpSpeed;
                    this.jumpSpeed += this.gravity;
                }
            }
            else

            {if(onPlatform != -1)
            {
                $("#info3").text("on platform");
                //console.log("hit a platform");
                this.jumpDirection = "";
                direction = "X";
                this.y = platforms[onPlatform].y - this.height;
                this.baseY = platforms[onPlatform].y - this.height;
                this.jumpSpeed = 4;
            }
            else 
            {
                if(this.y >= floor)
                {
                    $("#info3").text("on floor");
                //console.log("hit the floor");
                this.jumpDirection = "";
                direction = "X";
                this.y = floor;
                this.baseY = floor;
                this.jumpSpeed = 4;
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
}

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
            (character.y + character.height > this.y - this.heightThreshold && character.y + character.height <= this.y)
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

const diego = new Character("images/sprites/diego.png", canvas.width / 2 - 48, floor, 96, 128,
    {
        "X": [0,0],
        "R": [[6,2], [7, 2], [8,2]],
        "L": [[2, 5], [1, 5], [0, 5]],
        "J": [4, 0]
    }
);
const platformsWidth = 100;
const platform1 = new Platform(90, 300, platformsWidth);
const platform2 = new Platform(canvas.width-90-platformsWidth, 300, platformsWidth);
const platform3 = new Platform(canvas.width/2 - platformsWidth /2, 200, platformsWidth);

//var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps)
{
    fpsInterval = 1000/fps;
    //then = Date.now();
    //startTime = then;
    animate(); 
}

function animate(fps)
{
    //requestAnimationFrame(animate);
    setInterval(function(){
        //now = Date.now();
        //elapsed = now - then;
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
            diego.draw();
        }    
    },1000/fps);

    //requestAnimationFrame(animate);
}
animate(155);

window.addEventListener("keydown", function(e){
    keysdown[e.key] = true;
});

window.addEventListener("keyup", function(e){
    delete keysdown[e.key];
});