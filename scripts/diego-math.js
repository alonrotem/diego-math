const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const keysdown= [];

function Character(sprite, x, y, width, height, directionSpiteCoords)
{
    this.sprite = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = width;
    this.height = height;
    this.directionSpiteCoords = directionSpiteCoords;
    this.speed = 3;
    this.currentSpriteMoveCoords = 1;
    this.jumpHeight = 150;
    this.jumpSpeed = 4;
    this.gravity = (this.jumpSpeed / this.jumpHeight) * 2;
    this.jumpDirection = "";

    this.draw = function() {
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
        if (keysdown[" "] || keysdown["ArrowUp"] || this.jumpDirection != "")
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
                    this.y -= this.jumpSpeed;
                    this.jumpSpeed -= this.gravity;
                }
                else
                {
                    this.jumpDirection = "D";
                }
            }
            //falling down
            else if(this.jumpDirection == "D")
            {
                if(this.y < this.baseY)
                {
                    this.y += this.jumpSpeed;
                    this.jumpSpeed += this.gravity;
                }
            }
            //hitting the floor
            if(this.jumpDirection && this.y >= this.baseY)
            {
                this.y = this.baseY;
                this.jumpSpeed = 4;
                this.jumpDirection = "";
            }
        }

        //standing or jumping
        if(direction == "X" || direction == "J")
        {
            spriteCoordX = this.width * this.directionSpiteCoords[direction][0];
            spriteCoordY = this.height * this.directionSpiteCoords[direction][1];            
        }
        //walking left or right
        else
        {
            if(this.directionSpiteCoords[direction] && this.directionSpiteCoords[direction].length > 0)
            {
                this.currentSpriteMoveCoords++;
                if(this.currentSpriteMoveCoords >= this.directionSpiteCoords[direction].length)
                {
                    this.currentSpriteMoveCoords = 0;
                }
                spriteCoordX = this.width * this.directionSpiteCoords[direction][this.currentSpriteMoveCoords][0];
                spriteCoordY = this.height * this.directionSpiteCoords[direction][this.currentSpriteMoveCoords][1];
            }
        }
        ctx.drawImage(this.sprite, spriteCoordX, spriteCoordY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

const background = new Image();
background.src = "images/background/backgroundColorGrass-scaled.png";

const diego = new Character("images/sprites/diego.png", canvas.width / 2 - 48, 320, 96, 128,
    {
        "X": [0,0],
        "R": [[6,2], [7, 2], [8,2]],
        "L": [[2, 5], [1, 5], [0, 5]],
        "J": [4, 0]
    }
);

function animate()
{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    diego.draw();

    requestAnimationFrame(animate);
}
animate();

window.addEventListener("keydown", function(e){
    keysdown[e.key] = true;
});

window.addEventListener("keyup", function(e){
    delete keysdown[e.key];
});