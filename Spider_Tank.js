var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 

// Richard Ngo
// ECE 4525, Hsiao
// 9/13/2019

//Instructions
//Mouse: Aim
//Left Click: Grapple to forground and start swinging
//Right Click: Ungrapple/Shoot
//W Key: Rise
//S Key: Fall
//Spacebar Key: Restart game when Game Over Occurs.

//Description
//Using a mouse is reccomended
//To start the program, left click on the capital R in order to watch the logo animation, and start the game. 
//The game is about a green spider tank, whose mission is to take out all the red demons turrets. The game uses pendulum 
//physics for its movement, and allows spider tank to swing around any point on the screen that is left clicked on. 
//However, spider tank is unable to shoot while swinging. Though demons are still susceptible to being tank body slammed, 
//demons are primarily dealt with by light bullets. To stop swinging and start shooting, right click while using the cursor to aim.
//The more demons that are sent to hells hell, the more frequently that they will appear. In a rough spot, spider tank can also climb 
//up and down its webbings using the w and s keys. If spider tank is hit by a demon tank's bullet, or touches the ground, spider tank will die,
//and a Game Over screen will appear. When this happens, activate spider tank's time travel device by pressing the spacebar key, to revert time
frameRate(60);//60 frames per second
angleMode = "radians";
//PROJECT 0, LOGO
//dust object
var dustObj = function(xmin, ymin, x, y) {
    this.xmin = xmin;//base location
    this.ymin = ymin;
    this.x = x;//new location
    this.y = y;
    this.create = false;//if dust is shown or not
};

//initials object
var rnObj = function(x, y) {
    this.paused = true;
    this.close = false;
    this.x = x;//base location
    this.y = y;
    this.yr = y;//height of R
    this.yn = y+10;//height of N
    this.air = [];//holds dust objects
    
    this.fin = false;//if dust is finished
    this.textColor = 255;//color of text
    this.backFade = 255;//backround fade
    this.ran1 = 0;//random colors
    this.ran2 = 0;
    this.ran3 = 0;
    this.textTime = 0;//keeps track of text
    
    for (var i=-2; i<80; i= i+1) {
        this.air.push(new dustObj(x, y, x+i, random(y, y+64)));//fills air with dust
    }
};


//Displays initials
rnObj.prototype.display = function(move) {
    
    if(move){//if R and N are moving
    background(255, 255, 255);//white
        if(this.yr<=this.y+10){//alternate general heights of letters
            this.yr = random(this.y+10, this.y+20);
            this.yn = random(this.y, this.y+10);
            this.ran1=random(0, 255);
            this.ran2=random(0, 255);
            this.ran3=random(0, 255);
        }
        else
        {
            this.yr = random(this.y, this.y+10);
            this.yn = random(this.y+10, this.y+20); 
        }
    }
    //displays R and N
    //R
    
    fill(this.ran1, this.ran2, this.ran3); // black
    ellipse(this.x+16, this.yr+13, 30, 25);//curve
    fill(this.backFade, this.backFade, this.backFade); // white
    ellipse(this.x+15, this.yr+13, 18, 13);//curve hole
    fill(this.ran1, this.ran2, this.ran3); // black
    rect(this.x, this.yr, 8, 44);//left leg
    rect(this.x, this.yr, 20, 8);//upper curve
    rect(this.x, this.yr+17, 20, 8);//lower curve
    quad(this.x, this.yr+17, this.x+8, this.yr+17,  this.x+33, this.yr+44, this.x+24, this.yr+44);//right leg
    //N
    rect(this.x+45, this.yn, 8, 44);//left leg
    quad(this.x+45, this.yn, this.x+53, this.yn,  this.x+77, this.yn+44, this.x+69, this.yn+44);//leg connect
    rect(this.x+69, this.yn, 8, 44);//right leg
};

//Moves dust particles accross initials
rnObj.prototype.move = function() {
    this.display(false);//displays initials without moving letters
for (var i=0; i< this.air.length; i++) {
    this.air[i].move();//moves dust in air
}
if (this.air[0].create && !this.air[1].create && frameCount > 5){
    this.fin=true;//if dust has finished
}
};

dustObj.prototype.move = function() {
    this.x++;//moves particles
    //if dust reaches the end, send back to beggining with new height
    if (this.x > this.xmin+80) {
        this.x = this.xmin-2;
        this.y = random(this.ymin, this.ymin+64);
        if(this.create){//shows or hides dust
            this.create = false;
        }
        else{
        this.create = true;
        }
    }
    if(this.create){
        stroke(255, 255, 255);//white dust
        //stroke(random(0, 255), random(0, 255), random(0, 255));//flashing rambow dust
        strokeWeight(1);
        line (this.x,this.y, this.x-2, this.y);
        stroke(0, 0, 0);//resets stroke
    }
};

//shows and hides text
rnObj.prototype.showText = function() {
    var textPlacement = this.yr + 55;
    if (this.yr < this.yn){//text located below lowest letter
        textPlacement = this.yn + 55;
    }
    //text fades in
    if(frameCount>=this.textTime+20 && frameCount < this.textTime+105){
        this.textColor = this.textColor-3;
        fill(this.textColor, this.textColor, this.textColor);
        text("Richard's Games", this.x, textPlacement);
    }
    //about 2 seconds later, text fades out
    if(frameCount>=this.textTime+205 && frameCount<this.textTime+290){
        this.textColor = this.textColor+3;
        fill(this.textColor, this.textColor, this.textColor);
        text("Richard's Games", this.x, textPlacement);
    }
    
    if(frameCount>=this.textTime+290 && frameCount<this.textTime+410){
        if(this.backFade > 0)
        {
        this.backFade = this.backFade-3;
        fill(this.backFade, this.backFade, this.backFade);
        background(this.backFade, this.backFade, this.backFade);
        text("Richard's Games", this.x, textPlacement);
        this.display(false);
        
        }
    }
    
    if(frameCount>this.textTime+410){//2 seconds later
        this.close = true;//enter game
        
    }
};


//PROJECT 1, GAME

//bullet
var pbullet = function() {
    this.pos = new PVector(0, 0);//position in game
    this.angle = 0;//direction, atan2(bx-ax,by-ay)
    this.velocity = 0;//speed
    this.active = false;//check if exists
};

//enemy tanks
var tank = function(x, y) {
    this.pos = new PVector(x, y);//position in game
    this.angle = 180;//direction, atan2(bx-ax,by-ay)
    this.active = false;//check if exists
    this.shot = 0;//frame where tank last shot
    
};

////player tank
var spider = function(x, y) {
    this.hang = new PVector(0, 0);//grapple location
    this.pos = new PVector(x, y);//tank location
    this.velocity = new PVector(0, 0);//velocity of tank
    this.attached=false;//grapple checker
};

var swingGame = function(x, y) {
    this.running = true;//check if game is running
    this.fail = false;//check if game over has occured
    this.player = new spider(200, 100);//initial location of player
    this.pause = true;//check if game is paused
    this.score = 0;//score
    this.magClip = [];//contains all bullets
    for (var i=0; i<50; i= i+1) {//50 bullets maximum on screen
        this.magClip.push(new pbullet());
    }
    this.drafted = 0;//current number of bullets on screen
    this.spawn = -300;//frame where turret was last spawned
    this.spawnRate = 210;//frames until next enemy spawns
    this.enemy = [];
    for (var i=0; i<20; i= i+1) {//20 enemies maximum on screen
        this.enemy.push(new tank());
    }
    
    
};

//resets game to initial state after logo
swingGame.prototype.startOver = function() {
    //reset player
    this.player.hang.x = 0;
    this.player.hang.y = 0;
    this.player.pos.x = 200;
    this.player.pos.y = 100;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
    this.player.attached=false;
    
    //reset bullets
    for (var i=0; i<50; i= i+1) {
        this.magClip[i].active = false;
    }
    
    //reset enemies
    for (var i=0; i<20; i= i+1) {
        this.enemy[i].active = false;
    }
    
    this.score = 0;
    this.drafted = 0;
    this.spawn = -300;
    this.spawnRate = 210;
    
    this.fail = false;
    this.running = true;
    
};

//moves and determines what happens to all objects in game
//player movement
swingGame.prototype.playerMove = function() {
     //PLAYER
    if(this.player.attached === true){//if grappled
    //gravity while swinging
    this.player.velocity.y = 9.8/60 + this.player.velocity.y;
    var xlen = this.player.pos.x-this.player.hang.x;
    var ylen = this.player.pos.y-this.player.hang.y;
    var angle = atan2(xlen,ylen);
   // println("pre y velocity: " +this.vel.y);
    var angleV = acos((xlen*this.player.velocity.x+ylen*this.player.velocity.y)/(mag(xlen,ylen)*mag(this.player.velocity.x,this.player.velocity.y)));
    //tension from web
    var normal = mag(this.player.velocity.x,this.player.velocity.y)*cos(angleV);
    this.player.velocity.x = this.player.velocity.x-normal*sin(angle);
    this.player.velocity.y = this.player.velocity.y-normal*cos(angle);
    //updated location
    this.player.pos.x = this.player.pos.x + this.player.velocity.x;
    this.player.pos.y = this.player.pos.y + this.player.velocity.y;
    
    var xlen2 = this.player.pos.x-this.player.hang.x;
    var ylen2 = this.player.pos.y-this.player.hang.y;
    //auto corrects errors caused by descrete incrementation of frames instead of continuous flow of time
    this.player.pos.x = mag(xlen,ylen)*sin(atan2(xlen2,ylen2))+this.player.hang.x;
    this.player.pos.y = mag(xlen,ylen)*cos(atan2(xlen2,ylen2))+this.player.hang.y;
    }
    //when not grappling
    else
    {
        //fun low gravity when not grappling
        this.player.velocity.y = 4.2/60 + this.player.velocity.y;
        //updated location
    this.player.pos.x = this.player.pos.x + this.player.velocity.x;
    this.player.pos.y = this.player.pos.y + this.player.velocity.y;
    }
};

//enemy movement and spawner
swingGame.prototype.enemyMove = function() {
    //Enemy
    for (var i=0; i<20; i= i+1) {
        //find enemies that exist in game
        if(this.enemy[i].active === true)
        {
            //enemies have slightly delayed aim
    this.enemy[i].angle = atan2((this.player.pos.x-this.player.velocity.x*10)-this.enemy[i].pos.x,(this.player.pos.y-this.player.velocity.y*10)-this.enemy[i].pos.y);
    //enemies shoot every 2 seconds
    if(frameCount-this.enemy[i].shot>=120)
    {
         for(var j = 0; j < 50; j = j+1)
            {
                //find first free bullet, spawn starting from enemy, sent toward player
                if(this.magClip[j].active === false)
                {
        this.enemy[i].shot = frameCount;
        this.magClip[j].pos.x = this.enemy[i].pos.x+34*sin(this.enemy[i].angle);
        this.magClip[j].pos.y = this.enemy[i].pos.y+34*cos(this.enemy[i].angle);
        this.magClip[j].angle = this.enemy[i].angle;
        //velocity of bullet is 2 pixels per frame
        this.magClip[j].velocity = 2;
        this.magClip[j].active = true;
        break;
                }
            }
    }
        }
    }
    
    //enemy spawner
    if (frameCount-this.spawn > this.spawnRate) {
    if(this.drafted < 20){
    for (var i=0; i<20; i= i+1) {
        if(this.enemy[i].active === false)
        {
        this.enemy[i].active = true;
        //random location within screen realestate
        this.enemy[i].pos.x = random(15, 385);
        //bottem of screen
        this.enemy[i].pos.y = 400;
        
        //this.enemy[i].shot = random(frameCount-120, frameCount);
        var shotDelay = random(frameCount-120, frameCount);
        if(shotDelay < frameCount - 80){
            shotDelay = frameCount - 80;//keeps danger reactable
        }
        this.enemy[i].shot = shotDelay;
        this.drafted = this.drafted + 1;
        break;
        }
    }
        this.spawn = frameCount;//refresh timer
    }
    
    }
};

//bullet movement
swingGame.prototype.bulletMove = function() {
    for (var i=0; i<50; i= i+1) {
        if(this.magClip[i].active){
            this.magClip[i].pos.x = this.magClip[i].velocity*sin(this.magClip[i].angle)+ this.magClip[i].pos.x;
            this.magClip[i].pos.y = this.magClip[i].velocity*cos(this.magClip[i].angle)+ this.magClip[i].pos.y;
            if(this.magClip[i].pos.x <-200 || this.magClip[i].pos.x > 600 || this.magClip[i].pos.y <-100 || this.magClip[i].pos.y > 450)
            {
                this.magClip[i].active = false;//despawn when out of range
            }
            //println(this.mag[i].y);
        }
    }
};


//checks for game events
swingGame.prototype.eventCheck = function() {
    //game over when player hits the floor
    if(this.player.pos.y >=390){
               this.pause = true;
               this.running = false;
               this.fail = true;
    }
    
    //player killing enemy using collision
    for (var i=0; i<20; i= i+1) {
        if(this.enemy[i].active){
    if(mag(this.enemy[i].pos.x-this.player.pos.x, this.enemy[i].pos.y-this.player.pos.y) < 30){
        
                this.enemy[i].active = false;//enemy defeated
                this.score = this.score + 1;//score increased
                this.spawnRate = this.spawnRate - 5;//spawn rate increase
                this.drafted = this.drafted - 1;
            }
    }
    }
    
     for (var i=0; i<50; i= i+1) {
        if(this.magClip[i].active){
            //front of bullet
            var front = new PVector(this.magClip[i].pos.x, this.magClip[i].pos.y);
            //back of bullet
            var back = new PVector(this.magClip[i].pos.x-20*sin(this.magClip[i].angle), this.magClip[i].pos.y-20*cos(this.magClip[i].angle));
            
            
            //game over when player is hit by bullet
            if(this.magClip[i].velocity === 2){
            if(mag(this.player.pos.x-front.x,this.player.pos.y-front.y)< 10 || mag(this.player.pos.x-back.x,this.player.pos.y-back.y)< 10){
                this.pause = true;
                this.running = false;
                this.fail = true;
            }
            }
            
            
            //enemy killed when hit by bullet
            if(this.magClip[i].velocity === 10){
            for (var j=0; j<20; j= j+1) {
        if(this.enemy[j].active){
            if(mag(this.enemy[j].pos.x-front.x,this.enemy[j].pos.y-front.y)< 15 || mag(this.enemy[j].pos.x-back.x,this.enemy[j].pos.y-back.y)< 15){
                this.magClip[i].active= false;//bullet despawns
                this.enemy[j].active = false;//enemy defeated
                this.score = this.score + 1;//score incremented
                this.spawnRate = this.spawnRate - 5;//spawnrate increased
                this.drafted = this.drafted - 1;
            }
            
            
        }
            }
            
           //string cut (cut feature, would of caused an ungrapple upon the string being shot)
           if(mag(this.player.pos.x-front.x,this.player.pos.y-front.y)+mag(this.player.hang.x-front.x,this.player.hang.y-front.y) < (mag(this.player.pos.x-this.player.hang.x, this.player.pos.y-this.player.hang.y)+1) || mag(this.player.pos.x-back.x,this.player.pos.y-back.y)+mag(this.player.hang.x-back.x,this.player.hang.y-back.y) < (mag(this.player.pos.x-this.player.hang.x, this.player.pos.y-this.player.hang.y)+1)){
               
               //this.player.attached = false;
           }
            }
         
            
        }
     }
    
    
    
};

//draws all objects currently inside the game
swingGame.prototype.draw = function() {
    //Player
    if(this.player.attached === false)    {
        //player barrel
    stroke(255,255,255);
    strokeWeight(2.0);
    var aim = atan2(mouseX-this.player.pos.x,mouseY-this.player.pos.y);
    line(this.player.pos.x, this.player.pos.y, this.player.pos.x+16*sin(aim),this.player.pos.y+16*cos(aim));
    }
    
    noStroke();
    //player body
    if(mag(this.player.velocity.x,this.player.velocity.y)>6 && this.running){
        //flashes when moving faster than 6 pixels per frame
    fill(random(0, 255), random(0, 255), random(0, 255));
    }
    else{
    fill(0, 255,9);//default color
    }
    ellipse(this.player.pos.x, this.player.pos.y, 20, 20);
    
    fill(255,0,0);
    strokeWeight(1.0);
    if(this.player.attached === true){
    
    //ellipse(this.hang.x, this.hang.y, 10, 10);
    
    //grapple web
    stroke(255,255,255);
    
    line(this.player.pos.x, this.player.pos.y, this.player.hang.x, this.player.hang.y);
    }
    //stroke(7, 168, 39);//dark green
    //velocity indicator
    stroke(250, 13, 250);//purple
    line(this.player.pos.x, this.player.pos.y, this.player.pos.x-this.player.velocity.x*5, this.player.pos.y-this.player.velocity.y*5);
    
    
    
    
    
    
    // line(this.enemy.bullet.pos.x, this.enemy.bullet.pos.y, this.enemy.bullet.pos.x-20*sin(this.enemy.bullet.angle), this.enemy.bullet.pos.y-20*cos(this.enemy.bullet.angle));
     
     //ellipse(this.enemy.bullet.pos.x, this.enemy.bullet.pos.y, 5, 5);
     
     //Enemies
     for (var i=0; i<20; i= i+1) {
        if(this.enemy[i].active === true)
        {
            //enemy barrel
    stroke(255,255,255);
    strokeWeight(3.0);
    line(this.enemy[i].pos.x, this.enemy[i].pos.y, this.enemy[i].pos.x+25*sin(this.enemy[i].angle), this.enemy[i].pos.y+25*cos(this.enemy[i].angle));
    noStroke();
    //enemy body
    ellipse(this.enemy[i].pos.x, this.enemy[i].pos.y, 30, 30);
        }
     }
    
    //bullets
    for (var i=0; i<50; i= i+1) {
        if(this.magClip[i].active){
            stroke(255,255,255);
    strokeWeight(1.0);
            line(this.magClip[i].pos.x, this.magClip[i].pos.y, this.magClip[i].pos.x-20*sin(this.magClip[i].angle), this.magClip[i].pos.y-20*cos(this.magClip[i].angle));
            
           // this.mag[i].pos.x = 15*sin(this.mag[i].angle)+ this.mag[i].pos.x;
           // this.mag[i].pos.y = 15*cos(this.mag[i].angle)+ this.mag[i].pos.y;
            //println(this.mag[i].y);
        }
    }
   
   //TEXT
    if(this.running)//if game is running
    {
    textSize(12);
    
    if(this.score >=40){
    fill(random(0, 255), random(0, 255), random(0, 255));
    }
    else{
    fill(255,255,255);
    }
    text("Score: "+ this.score, 175, 15);
    if(this.pause){//initial state
        fill(255,255,255);
        textSize(14);
        text("Shoot as many red tanks as you can!", 90, 55);
        text("Avoid bullets and don't hit the ground", 90, 72);
        text("Click Anywhere to Begin", 130, 190);
        textSize(10);
        fill(255, 247, 0);
        text("Mouse: Aim", 130, 215);
        text("Left Click: Grapple", 130, 230);
        text("Right Click: Ungrapple/Shoot", 130, 245);
        text("W/S Keys: Rise/Fall", 130, 260);
        stroke(250, 13, 250);
        line(100,200,300, 200);
        
    }
    }
    
    if(this.fail)//if game over
    {
    textSize(24);
    fill(255,0,0);
    text("Game Over", 130, 175);    
    textSize(18);
    if(this.score >=40){
    fill(random(0, 255), random(0, 255), random(0, 255));
    }
    else{
    fill(255,255,255);
    }
    text("Final Score: "+ this.score, 140, 200);
    textSize(12);
    fill(255,255,255);
    text("Use Spacebar to Try Again", 125, 220);
    }

    
    
};


var game = new swingGame(200, 100);//game
var initials = new rnObj(160, 140);//logo

//mouse input handler
var mouseReleased = function() {
    if(initials.close===false){//if logo is still happening
        if(mouseButton === LEFT){
            if(mouseX>=160 && mouseY >= 140){//boundaries of letter R
                if(mouseX<=192 && mouseY <= 184){
                    initials.paused = false;//start logo animation
                }
            }
    }
    }
    else
    {
    if(game.fail === false){//if not game over
    game.pause = false;
    if(mouseButton === LEFT){
        
        
        //player shoots in direction of cursor
     game.player.hang.x = mouseX;
     game.player.hang.y = mouseY;
     game.player.attached = true;
    }
    else if(mouseButton === RIGHT){
        if(game.player.attached === false){//shoot
            for(var i = 0; i < 50; i = i+1)
            {
                if(game.magClip[i].active === false)
                {
            var aim = atan2(mouseX-game.player.pos.x,mouseY-game.player.pos.y);
            game.magClip[i].pos.x= game.player.pos.x+25*sin(aim);
            game.magClip[i].pos.y= game.player.pos.y+25*cos(aim);
            game.magClip[i].angle = aim;
            //player bullets travel 10 pixels per frame
            game.magClip[i].velocity= 10; 
           // println(swing.mag[swing.ammo].pos.x);
           // println(swing.mag[swing.ammo].pos.y);
            //println(swing.mag[swing.ammo].angle);
            game.magClip[i].active= true;
            break;
                }
            }
        }
     game.player.attached = false;//dettach
    }
    }
    }
};
//keyboard input handler
keyPressed = function() {
    
    if(game.fail === false){
    if(game.pause === false){
    if(keyCode === 87){//w, rise up towards grapple
    var xlen =  game.player.pos.x- game.player.hang.x;
    var ylen =  game.player.pos.y- game.player.hang.y;
     game.player.pos.x =  game.player.pos.x-2*sin(atan2(xlen,ylen));
     game.player.pos.y =  game.player.pos.y-2*cos(atan2(xlen,ylen));
    }
    
    if(keyCode === 83 &&  game.player.pos.y >  game.player.hang.y){//s, travel away from grapple when underneath it
    var xlen =  game.player.pos.x- game.player.hang.x;
    var ylen =  game.player.pos.y- game.player.hang.y;
     game.player.pos.x =  game.player.pos.x+2*sin(atan2(xlen,ylen));
     game.player.pos.y =  game.player.pos.y+2*cos(atan2(xlen,ylen));
    }
    }
    }
    else{
        if(keyCode === 32){//space bar, reset game to initial state after logo
         game.startOver();   
        }
        
    }
    
};

//per frame actions
var draw = function() {
    if(initials.close === false)//if logo is still running
    {
    if(initials.paused === false){
if(!initials.fin){//if dust animation isn't finished
    
    if(frameCount%40===0){
        initials.display(true);//change R and N location every 2/3 of a second
    }
    initials.move();//moves dust
    initials.textTime = frameCount;//updates current frame
}
else{
    initials.showText();//show subtext
}
}
else{
  //before R has been clicked
  fill(0, 0, 0); // black
  background(255, 255, 255);
            text("Click the R to start", 130, 120);
            line(145, 122, 158, 138);
            initials.display(false);
  //println(mouseX + " " + mouseY);
}
    }
    else//gamelogic
    {
    background(0, 0, 0);
    if(game.pause === false){
        //do not run game while paused
        game.playerMove();
        game.enemyMove();
        game.bulletMove();
    game.eventCheck();
    }
    //draws graphics
    game.draw();
    }
    
};









}};
