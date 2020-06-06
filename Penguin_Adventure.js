var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 

// Richard Ngo
// ECE 4525, Hsiao
// 9/27/2019

//Instructions
//W/S: Move forwards/backwards
//A/D: Turn left/right
//Shift: Slide
//Space: Deploy decoy
//H: Handicap (If the player character touches a wall, it should stop and turn back a little so that it does not get stuck on the wall.)

//Description
//In this game, you play as a hungry penguin who needs to eat. There are polar bears guarding the fish however, so you will have to stealth 
//your way around the 400 by 400 pixel map in order to succeed. In order to win, you must be able to get all 20 fishes in the map. The polar bear's 
//line of sight are indicated by the yellow archs in front of them. If you are caught within the yellow arch, you will be chased. However, if there 
//is a wall between you and the bear, you will not be spotted even if you do get within the yellow arch. When not chasing you, the polar bears will wander. 
//If you are able to lose the bears while being chased,the polar bear will go to the last place that it saw you before resuming to wander. The polar bears 
//will out run your default movement speed, but you are faster then the polar bears while you are sliding. However, the downsides of sliding is that you 
//can only move forwards, can not turn, and that the slide has a start up time before it can be used, so you can not slide around too carelessly.If you 
//are caught before you get to all 20 fish, you will reach the game over screen. If you are able to get all 20 fishes before being caught, you will reach 
//the success screen, and win the game. In the map, there are also decoys that you can pick up and use to distract a polar bear. However, a decoy will run 
//out of energy in 10 seconds and it's affect on polar bears will run out. To start the game, click on the penguin after the animation has finished.


frameRate(60);//60 frames per second
angleMode = "radians";
//tile map
var tilemap = [
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "w              w                                   w",
        "w              w                                   w",
        "w      f b                   b        b            w",
        "w                            wwwwwwwwww            w",
        "wwwwwwwwwwwwwwww                 ff                w",
        "w                        b       ffb       b       w",
        "w                            wwwwwwwwww            w",
        "w     f b                    b        b            w",
        "w              www                                 w",
        "w              w                                   w",
        "wwwwwwwwwwwwwwww                                   w",
        "w              w                                   w",
        "w     f  b     w                                   w",
        "w     www                 wwwwwwwww                w",
        "w                         wd                       w",
        "w              w          w                        w",
        "wwwwwwwwwwwwwwwwwwwwwwwwwww      wwwwwwwwwwwwwwwwwwww",
        "w                b                                 w",
        "w                                                  w",
        "w           wwwwwwwwwwwwww       w             f   w",
        "w     w     w            w       w                 w",
        "w     w        bf        w       w         wwwwww  w",
        "w     w            w     w       w  b      w       w",
        "w     wwwwwwwwwwwwww     w       w         w       w",
        "w                                w         w       w",
        "w                                w         w       w",
        "w       w     w               wwww         wwwww   w",
        "w       w  f  w              w          b      w   w",
        "w       w  b  w              w f               w   w",
        "w                            w                 w d w",
        "w                             wwww         wwwwwwwww",
        "www     w     w   wwwwwwwww      w         w   b   w",
        "w       ww   ww   w       w      w         w   f   w",
        "w        w d ww         f w      w         w  www  w",
        "w        wwwww  b     wwwww      w         w       w",
        "w         fww             w     w                  w",
        "w          w              w    w                   w",
        "wwf        w              w d w     wwwwww         w",
        "w w        w   w  w       wwwww    w      w        w",
        "w  wb      w                      w        w       w",
        "w          w    f                w    ww    w    b w",
        "w          w   w  w       wwwwwww    b       w     w",
        "w     w  w                                   w     w",
        "w     w  wwww                              f w     w",
        "w  w  w    w              wwwwwww            w     w",
        "w fw       w    b                w    ww    w      w",
        "wwww       w                      w        w   b   w",
        "w      d   w      wwwww    b       w      w        w",
        "w             w   w  f              wwwwww         w",
        "w p           w f w                 w    w       d w",
        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",];
//wall object
var wallObj = function(x, y) {
    this.x = x;
    this.y = y;
};

//penguin  (player or decoy)
var penguinObj = function(x,y){
    this.pos = new PVector(x, y);
    this.angle = PI;
    this.slide = false;
    this.score = 0;
    this.charge = frameCount;
    this.capture = false;
    this.active = true;
    this.spawnInv = frameCount + 40;
    this.power = 0;
    this.turned=0;
    this.turn=-0.1;
};

//bear (adversary)
var bearObj = function(x,y){
    this.pos = new PVector(x, y);
    this.angle = 0;
    this.turning = random(-180, 180)/180*PI;
    this.chase = false;
    this.attention = 0;
    //this.wait = true;
    this.travel = new PVector(x, y);
    //this.stress = 0;
    this.stuck = false;
    this.capture = false;
    this.real = false;
};
//fish (collectable)
var fishObj = function(x,y){
    this.pos = new PVector(x, y);
    this.turn=-1;
    this.active = true;
};
//menu and text
var uI = function(){
 this.start = true;
 this.pause = false;
 this.ended = false;
 this.winner = false;
 this.handicap = false;
 this.rand1 = random(0, 255);
 this.rand2 = random(0, 255);
 this.rand3 = random(0, 255);
 this.trans = new PVector(0,0);
 this.zoom = frameCount;
};


//snowflake
var snow = function(){
 this.pos = new PVector(0, 0);
 this.active = false;
};

//holder of snowflakes and fishes
var sky = function(){
 this.cloud = [];
 for(var i = 0; i < 30; i++){
 this.cloud.push(new snow());
 }
 this.count = 0;
};

var decoyObj = function(x,y){
    this.pos = new PVector(x, y);
    
    this.active = true;
};


var walls = [];
var penguin = [];
var bear = [];
var keys = [];
var fish = [];
var decoy = [];
var game = new uI();
var air = new sky();


//DRAWING SECTION

wallObj.prototype.draw = function() {
    //fill(33, 43, 222);
    noStroke();
    fill(133, 221, 237);
   rect(this.x-10, this.y-10, 20, 20);
};

penguinObj.prototype.draw = function() {
    if(!this.capture){
     pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    if(!this.slide){
    fill(46, 44, 46);
    noStroke();
     ellipse(0, 0, 15, 15);
     ellipse(0, 0, 19, 8);
     fill(17, 240, 225);
     ellipse(-3, -4, 3, 4);
     ellipse(3, -4, 3, 4);
     fill(247, 164, 10);
    triangle(-3, -7, 3, -7, 0, -10);
    }
    else
    {
        noStroke();
        fill(247, 164, 10);
     ellipse(5, 12, 4, 7);
     ellipse(-5, 12, 4, 7);
        fill(46, 44, 46);
    ellipse(0, 0, 15, 15);
     ellipse(0, 3, 15, 23);
     ellipse(-7, 4, 4, 16);
     ellipse(7, 4, 4, 16);
    }
    popMatrix();
    }
};

penguinObj.prototype.drawToy = function() {
    if(!this.capture && this.active){
     pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    
    noStroke();
    pushMatrix();
    if(frameCount>this.spawnInv){
    scale(1+this.turned,1);
    }
    fill(8, 56, 7);
     ellipse(-4, 8, 8, 5);
     ellipse(4, 8, 8, 5);
     fill(219, 219, 219);
     ellipse(-4, 8, 4, 3);
     ellipse(4, 8, 4, 3);
     if(!game.pause){
     this.turned+=this.turn;
     
     if((frameCount-this.charge)%10===0)
     {
         this.turn*=-1;
     }
     }
     popMatrix();
     
    fill(87, 86, 87);
     ellipse(0, 0, 15, 15);
     ellipse(0, 0, 19, 8);
     if(this.spawnInv>frameCount)
     {
     fill(255, 255, 255);
     }
     else
     {
         fill(17, 240, 225);
     }
     ellipse(-3, -4, 3, 4);
     ellipse(3, -4, 3, 4);
     fill(247, 164, 10);
    triangle(-3, -7, 3, -7, 0, -10);
    popMatrix();
    }
};

decoyObj.prototype.draw = function() {
    if(this.active){
     pushMatrix();
    translate(this.pos.x, this.pos.y);
    scale(0.8,0.8);
    rotate(PI);
    
    noStroke();
    fill(8, 56, 7);
     ellipse(-4, 8, 8, 5);
     ellipse(4, 8, 8, 5);
     fill(219, 219, 219);
     ellipse(-4, 8, 4, 3);
     ellipse(4, 8, 4, 3);
     
    fill(87, 86, 87);
    noStroke();
     ellipse(0, 0, 15, 15);
     ellipse(0, 0, 19, 8);
     fill(255, 255, 255);
     ellipse(-3, -4, 3, 4);
     ellipse(3, -4, 3, 4);

     fill(247, 164, 10);
    triangle(-3, -7, 3, -7, 0, -10);
    popMatrix();
    }
    
};


bearObj.prototype.draw = function() {
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    fill(255, 255, 255);
    stroke(0,0,0);
     ellipse(0, 0, 20, 15);
     if(this.chase||this.capture){
     ellipse(-8, -6, 4, 15);
    ellipse(8, -6, 4, 15);
     }
     else
     {
      ellipse(-8, -6, 4, 10);
    ellipse(8, -6, 4, 10);   
     }
     ellipse(0, 0, 16, 18);
     ellipse(5, 2, 7, 3);
     ellipse(-5, 2, 7, 3);
     fill(0, 0, 0);
     ellipse(0, -8, 2, 2);
     ellipse(-4, -4, 2, 2);
     ellipse(4, -4, 2, 2);
     
     if(this.capture){
     var heldpos = -16;
     fill(87, 86, 87);
     if(this.real){
         fill(46, 44, 46);
         }
    noStroke();
     ellipse(0, heldpos, 15, 15);
     ellipse(0, heldpos, 19, 8);
     fill(255, 255, 255);
     if(this.real){
         fill(17, 240, 225);
         }
     ellipse(-3, -4+heldpos, 3, 4);
     ellipse(3, -4+heldpos, 3, 4);
     fill(247, 164, 10);
    triangle(-3, -7+heldpos, 3, -7+heldpos, 0, -10+heldpos);
    if(!game.pause || this.real){
    this.angle+=PI/75;
    }
     }
     popMatrix();
};

bearObj.prototype.drawSight = function() {
    if(!game.pause && !this.capture){
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    noStroke();
    fill(251, 255, 214);
    arc(0, 0, 165, 165, PI+PI/4.5, 2*PI-PI/4.5);
    popMatrix();
    }
};

fishObj.prototype.draw = function() {
    if(this.active){
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI/10*this.turn);
    rotate(-this.angle);
    stroke(0,0,0);
    fill(178, 179, 168);
    
    triangle(-9,8,-9,-8,-4,0);
    ellipse(1, 0, 16, 10);
    triangle(0,2,0,-1,-4,0);
    triangle(5,-5,-2,-5,0,-9);
    triangle(5,5,-2,5,-4,8);
    ellipse(5, -1, 1, 1);
    popMatrix();
    
    if(frameCount%60 === 0 && (!game.pause || penguin[0].score===20))
    {
     this.turn *=-1;   
    }
    }
};

uI.prototype.draw = function() {
    if(!this.ended)//if game is running
    {
        textSize(12);
        fill(255, 255, 0);
        
    if(this.handicap)
    {
        text("H", 385, 15);
    }
    
    fill(0, 0, 0);
    text("Score: "+ penguin[0].score, 175, 15);
    text("Decoys: "+ penguin[0].power, 175, 395);
    if(this.pause){//initial state
       fill(97, 5, 97);
        textSize(14);
        text("Its Time to Eat!", 165, 95);
        fill(97, 5, 97);
        textSize(12);
        text("Collect all 20 of the fishes to get your fill.", 90, 130);
        text("Avoid hungry polar bears by avoiding sightlines", 90, 147);
        text("and hiding behind ice blocks for cover.", 90, 164);
        fill(9, 110, 9);
        textSize(14);
        text("Click Anywhere to Begin", 130, 190);
        textSize(10);
        fill(9, 110, 9);
        text("W/S: Move forwards/backwards", 130, 215);
        text("A/D: Turn left/right", 130, 230);
        text("Spacebar: Slide", 130, 245);
        text("H: Handicap (stop and turns player back abit", 130, 260);
        text("     whenever player touches a wall)", 130, 275);
        stroke(250, 13, 250);
        line(100,200,300, 200);
        
    }
    }
    
    if(this.ended)//if game over
    {
        
        if(penguin[0].score ===20)
        {
            if(!this.winner)
            {
            air.party();
            this.winner = true;
            }
            background(0,0,0);
            textSize(24);
    fill(247, 255, 0);
    text("You did it!", 146, 175);    
    textSize(18);
    if(frameCount %5 === 0){
        this.rand1 = random(0, 255);
        this.rand2 = random(0, 255);
        this.rand3 = random(0, 255);
    }
    fill(this.rand1, this.rand2, this.rand3);
    
    text("Final Score: "+ penguin[0].score, 140, 200);
    textSize(12);
    fill(255,255,255);
    text("Click Anywhere to Try Again", 125, 220);
    }
        else{
    textSize(24);
    fill(255,0,0);
    text("Game Over", 130, 175);    
    textSize(18);
    fill(0,0,0);
    text("Final Score: "+ penguin[0].score, 140, 200);
    textSize(12);
    fill(0,0,0);
    text("Click Anywhere to Try Again", 125, 220);
    }
    }
    
  

};

  uI.prototype.starting = function() {
      if(this.start)
      {
       this.zoom = frameCount;   
      }
        background(127, 193, 240);
         
         
         
        
         
         
         
         
         //fish
         if(frameCount<100){
    pushMatrix();
    translate(200, 200);
    scale(3,3);
    if(frameCount>60){
    rotate(PI/10);
    }
    else{
    rotate(-PI/10);
    }
    stroke(0,0,0);
    fill(178, 179, 168);
    
    triangle(-9,8,-9,-8,-4,0);
    ellipse(1, 0, 16, 10);
    triangle(0,2,0,-1,-4,0);
    triangle(5,-5,-2,-5,0,-9);
    triangle(5,5,-2,5,-4,8);
    ellipse(5, -1, 1, 1);
    popMatrix();
         }
    
    
    
        
        //peng
        pushMatrix();
        if(frameCount < 100)
        {
    translate(200, 2*frameCount);
        }
        else
        {
            translate(200, 200+(frameCount-this.zoom)*10);
        }
    rotate(PI);
    scale(3,3);
    var shift3 = 0;
    if(frameCount>200){
    var shift3 = -5;
    }
    if(frameCount<150 || (frameCount > 350 && mouseX >200-30 && mouseX <200+30 && mouseY >200-20 && mouseY <200+20)){
        noStroke();
    fill(247, 164, 10);
     ellipse(5, 12+shift3, 4, 7);
     ellipse(-5, 12+shift3, 4, 7);
        fill(46, 44, 46);
    ellipse(0, 0+shift3, 15, 15);
     ellipse(0, 3+shift3, 15, 23);
     ellipse(-7, 4+shift3, 4, 16);
     ellipse(7, 4+shift3, 4, 16);
    }
    else
    {
     
    fill(46, 44, 46);
    noStroke();
     ellipse(0, 0, 15, 15);
     ellipse(0, 0, 19, 8);
     fill(17, 240, 225);
     ellipse(-3, -4, 3, 4);
     ellipse(3, -4, 3, 4);
     fill(247, 164, 10);
    triangle(-3, -7, 3, -7, 0, -10);
    }
    popMatrix();
    
   
    
    //bear right
     pushMatrix();
     if(frameCount < 250)
        {
    translate(350, -375+frameCount*2);
        }
        else
        {
            translate(350, 125);
        }
    rotate(PI);
    if(frameCount > 300){
    rotate(PI/3.3-(frameCount-this.zoom)/70);
    }
    scale(3,3);
    fill(255, 255, 255);
    stroke(0,0,0);
     ellipse(0, 0, 19, 15);
     
     ellipse(-8, -6, 4, 15);
    ellipse(8, -6, 4, 15);
     
     ellipse(0, 0, 16, 18);
     ellipse(5, 2, 7, 3);
     ellipse(-5, 2, 7, 3);
     fill(0, 0, 0);
     ellipse(0, -8, 2, 2);
     ellipse(-4, -4, 2, 2);
     ellipse(4, -4, 2, 2);
    popMatrix();
    
    //left bear
    pushMatrix();
    if(frameCount < 225)
        {
    translate(50, -212+frameCount*1.5);
        }
        else
        {
    translate(50, 125);
        }
    rotate(PI);
    if(frameCount > 300){
    rotate(-PI/3.3+(frameCount-this.zoom)/70);
    }
    scale(3,3);
    fill(255, 255, 255);
    stroke(0,0,0);
     ellipse(0, 0, 19, 15);
     
     ellipse(-8, -6, 4, 15);
    ellipse(8, -6, 4, 15);
     
     ellipse(0, 0, 16, 18);
     ellipse(5, 2, 7, 3);
     ellipse(-5, 2, 7, 3);
     fill(0, 0, 0);
     ellipse(0, -8, 2, 2);
     ellipse(-4, -4, 2, 2);
     ellipse(4, -4, 2, 2);
    popMatrix();
    
    //center bear
    pushMatrix();
    if(frameCount < 200)
        {
    translate(200, -170+frameCount);
        }
        else
        {
            translate(200, 30);
        }
    
    rotate(PI);
    if(false){
    rotate(PI/4);
    }
    scale(3,3);
    fill(255, 255, 255);
    stroke(0,0,0);
     ellipse(0, 0, 19, 15);
     
     ellipse(-8, -6, 4, 15);
    ellipse(8, -6, 4, 15);
     
     ellipse(0, 0, 16, 18);
     ellipse(5, 2, 7, 3);
     ellipse(-5, 2, 7, 3);
     fill(0, 0, 0);
     ellipse(0, -8, 2, 2);
     ellipse(-4, -4, 2, 2);
     ellipse(4, -4, 2, 2);
    popMatrix();
    
    //text
     pushMatrix();
         if(frameCount < 350)
        {
    translate(3500-frameCount*10, 0);
        }
        else
        {
            translate(0, 0);
        }
        if(frameCount-this.zoom===0){
         var shift1 = -15;
          fill(97, 5, 97);
        textSize(14);
        text("Its Time to Eat!", 150, 95);
        fill(97, 5, 97);
        textSize(12);
        text("Collect all 20 of the fishes to get your fill.", 90, 115);
        text("Avoid hungry polar bears by avoiding ", 100, 147+shift1);
        text("sightlines, hiding behind ice blocks ", 100, 164+shift1);
        text("for cover and using decoys to distract.", 100, 181+shift1);
        fill(9, 110, 9);
        textSize(14);
        var shift2 = 70;
        text("Controls", 170, 195 + shift2);
        textSize(10);
        fill(9, 110, 9);
        text("W/S: Move forwards/backwards", 130, 215+ shift2);
        text("A/D: Turn left/right", 130, 230+ shift2);
        text("Shift: Slide", 130, 245+ shift2);
        text("Spacebar: Send out decoy", 130, 260+ shift2);
        //text("H: Handicap (stop and turns player back abit", 130, 275+ shift2);
        //text("     whenever player touches a wall)", 130, 290+ shift2);
        stroke(250, 13, 250);
        line(100,200+ shift2,300, 200+ shift2);
         popMatrix();
        }
    if(this.start && frameCount > 350)
        {
         textSize(12);
         fill(255, 255, 255);
        text("Start",186,200);
        }
    
    };
    

snow.prototype.draw = function() {
    stroke(255, 255, 255);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
};

//ACTING SECTION (where characters move and interact with enviroment)




bearObj.prototype.act = function() {
     
     //println("before"+this.angle);
		this.angle = atan2(sin(this.angle),cos(this.angle));//normalize
		//println("after"+this.angle);
     if(!this.capture){
   var see = true;
   //if within range
   for(var i = 0; i <penguin.length;i++){
       if(!penguin[i].capture && frameCount > penguin[i].spawnInv){
        if(mag(this.pos.x-penguin[i].pos.x,this.pos.y-penguin[i].pos.y)<90){
            //println("inrange");
            //bear is facing right direction
            if(atan2(penguin[i].pos.x-this.pos.x,penguin[i].pos.y-this.pos.y)<this.angle+PI/2-PI/5 && atan2(penguin[i].pos.x-this.pos.x,penguin[i].pos.y-this.pos.y)>this.angle-PI/2+PI/5){
                //println("right direction");
                //check for walls
            for(var j = 0; j <walls.length;j++){
            if(mag(walls[j].x-this.pos.x,walls[j].y-this.pos.y)+mag(penguin[i].pos.x-walls[j].x,penguin[i].pos.y-walls[j].y) < mag(this.pos.x-penguin[i].pos.x,this.pos.y-penguin[i].pos.y)+10){
        see = false;//if wall, can't see
        break;
            }
            }
            if(see){//if can see, update target location and set chase to true
            this.travel.x = penguin[i].pos.x;
            this.travel.y = penguin[i].pos.y;
			this.chase = true;
			//println("found");
            }
            }
		}
       }
   }
		//line(this.pos.x+sin(this.angle)*100,this.pos.y+cos(this.angle)*100,this.pos.x,this.pos.y);
		//println(this.turning/PI*180);
			//if not chasing, wander
         if(!this.chase){
             
             
             //stay stil for first second, turn and move for second second
     if(frameCount-this.attention>120 && frameCount-this.attention<240){
     
         if(this.turning===0){//don't move forward until correct direction is faced
             //move forward
             this.pos.x += sin(this.angle)*1;
			 this.pos.y += cos(this.angle)*1;
         }
         else {//turn left or right
             if(abs(this.turning) < PI/75)//prevents overshooting
             {
             this.angle = this.angle + this.turning;
             this.turning = 0;
             }
             else
             {
                 //turn left or right
                 this.angle = this.angle + PI/75*this.turning/abs(this.turning);
                 this.turning -= PI/75*this.turning/abs(this.turning);
             }
         }
         
     }
	 else if(frameCount-this.attention>240){//if past 2 second wandering cycle, reset
		 this.attention = frameCount;
		 this.turning = random(-180, 180)/180*PI;
	 }
    }
	else{
		
		//chasing

		
		//angle to end location
		var turning = atan2(this.travel.x-this.pos.x,this.travel.y-this.pos.y);
		//println(turning);
		stroke(0,0,0);
		//line(this.travel.x, this.travel.y,this.pos.x,this.pos.y);
		//line(this.pos.x+sin(turning)*100,this.pos.y+cos(turning)*100,this.pos.x,this.pos.y);
		//line(this.pos.x+sin(this.angle)*100,this.pos.y+cos(this.angle)*100,this.pos.x,this.pos.y);
		
		//turn towards location
			var right = new PVector(0,0);
		right.x = this.pos.x+sin(this.angle-PI/2);
		right.y = this.pos.y+cos(this.angle-PI/2);
		var left = new PVector(0,0);
		left.x = this.pos.x-sin(this.angle-PI/2);
		left.y = this.pos.y-cos(this.angle-PI/2);
		
		
		if(abs(this.angle-turning) < PI/75)
             {
             this.angle = turning;
            // println("faced");
             }
             else
             {
                 //turn left or right
                 if(mag(right.x-this.travel.x,right.y-this.travel.y)<mag(left.x-this.travel.x,left.y-this.travel.y)){
                 this.angle = this.angle - PI/100;
                 }
                 else{
                     this.angle = this.angle + PI/100; 
                 }
             
             }
             //move forward
			 if(mag(this.pos.x-this.travel.x,this.pos.y-this.travel.y)>15){
			 this.pos.x += sin(this.angle)*1;
			 this.pos.y += cos(this.angle)*1;
			 }
			 else if(this.angle === turning){//finish chase

				 this.chase = false;
				 this.turning = random(-180, 180)/180*PI;
				 this.attention = frameCount;
				 
				 //println("finished");
	}
	}
     }
//wall collision
         var near = 0;
   for(var i = 1; i <walls.length;i++){
      if(mag(this.pos.x-walls[i].x,this.pos.y-walls[i].y) < mag(this.pos.x-walls[near].x,this.pos.y-walls[near].y)){
          near = i;
      }
   }
      
      
       
      if(abs(this.pos.x-walls[near].x)<=20 &&abs(this.pos.y-walls[near].y)<=20){
          if(!this.stuck)
          {
          this.attention = frameCount-200;
		 this.turning = PI*3/4;
		 this.stuck = true;
          }
          var right = new PVector(walls[near].x-10, walls[near].y);
          var left = new PVector(walls[near].x+10, walls[near].y);
          var up = new PVector(walls[near].x, walls[near].y+10);
          var down = new PVector(walls[near].x, walls[near].y-10);
         
         var normalwall = Math.min(mag(this.pos.x-right.x,this.pos.y-right.y), mag(this.pos.x-left.x,this.pos.y-left.y), mag(this.pos.x-up.x,this.pos.y-up.y),mag(this.pos.x-down.x,this.pos.y-down.y));
        // println(normalwall);
         if(normalwall === mag(this.pos.x-right.x,this.pos.y-right.y)){
             this.pos.x -= 4;
         }
         else if(normalwall === mag(this.pos.x-left.x,this.pos.y-left.y)){
             this.pos.x += 4;
         }
         else if(normalwall===mag(this.pos.x-up.x,this.pos.y-up.y)){
             this.pos.y += 4;
         }
         else if(normalwall===mag(this.pos.x-down.x,this.pos.y-down.y)){
             this.pos.y -= 4;
         }
         
          
          
          
      
     }
     else
     {
         this.stuck = false;
     }
     
     
     if(abs(this.pos.x-penguin[0].pos.x)<15 &&abs(this.pos.y-penguin[0].pos.y)<20){
     game.ended = true;
     game.pause = true;
     this.capture = true;
     this.real = true;
     penguin[0].capture = true;
      }
     
     for(var i = 1; i <penguin.length;i++){
      if(abs(this.pos.x-penguin[i].pos.x)<15 &&abs(this.pos.y-penguin[i].pos.y)<20){
          if(penguin[i].active && !penguin[i].capture){
     this.capture = true;
     penguin[i].capture = true;
          }
          else if(!penguin[i].active && penguin[i].capture){
              this.capture = false;
               this.chase = false;
				 this.turning = random(-180, 180)/180*PI;
				 this.attention = frameCount;
          }
      }
      }
     
};

penguinObj.prototype.act = function() {
//handles multiple key presses and releases
if(keys[0] && !this.slide)
    {
     this.pos.x += sin(this.angle)*0.7;
	 this.pos.y += cos(this.angle)*0.7;   
    }
    if(keys[1] && !this.slide)
    {
     this.pos.x -= sin(this.angle)*0.7;
	 this.pos.y -= cos(this.angle)*0.7;   
    }
    if(keys[2] && !this.slide)
    {
        this.angle = this.angle+PI/60;
    }
    if(keys[3] && !this.slide)
    {
        this.angle = this.angle-PI/60;
    }
    if(keys[4])
    {
     this.slide=true;
     if(frameCount-this.charge>20){
     this.pos.x += sin(this.angle)*2.0;
	 this.pos.y += cos(this.angle)*2.0;  
     }
    }
    else
    {
     this.slide = false;  
     this.charge = frameCount;
    }
    //wall collision and detector
    var near = 0;
   for(var i = 1; i <walls.length;i++){
      if(mag(this.pos.x-walls[i].x,this.pos.y-walls[i].y) < mag(this.pos.x-walls[near].x,this.pos.y-walls[near].y)){
          near = i;
      }
   }
      
      
       
      if(abs(this.pos.x-walls[near].x)<=20 &&abs(this.pos.y-walls[near].y)<=20){
          
          if(game.handicap){
              this.angle+=PI/70;
          }
          
          var right = new PVector(walls[near].x-10, walls[near].y);
          var left = new PVector(walls[near].x+10, walls[near].y);
          var up = new PVector(walls[near].x, walls[near].y+10);
          var down = new PVector(walls[near].x, walls[near].y-10);
         
         var normalwall = Math.min(mag(this.pos.x-right.x,this.pos.y-right.y), mag(this.pos.x-left.x,this.pos.y-left.y), mag(this.pos.x-up.x,this.pos.y-up.y),mag(this.pos.x-down.x,this.pos.y-down.y));
        // println(normalwall);
         if(normalwall === mag(this.pos.x-right.x,this.pos.y-right.y)){
             this.pos.x -= 4;
         }
         else if(normalwall === mag(this.pos.x-left.x,this.pos.y-left.y)){
             this.pos.x += 4;
         }
         else if(normalwall===mag(this.pos.x-up.x,this.pos.y-up.y)){
             this.pos.y += 4;
         }
         else if(normalwall===mag(this.pos.x-down.x,this.pos.y-down.y)){
             this.pos.y -= 4;
         }
         
     }
     
      for(var i = 0; i <fish.length;i++){
      if(abs(this.pos.x-fish[i].pos.x)<15 &&abs(this.pos.y-fish[i].pos.y)<15&&fish[i].active){
     penguin[0].score += 1;
     fish[i].active = false;
     if(penguin[0].score === 20){
         game.ended = true;
         game.pause = true;
     }
      }
      }
      
      for(var i = 0; i <decoy.length;i++){
      if(abs(this.pos.x-decoy[i].pos.x)<14 &&abs(this.pos.y-decoy[i].pos.y)<14&&decoy[i].active){
     penguin[0].power += 1;
     decoy[i].active = false;
      }
      }
      /*
      for(var i = 0; i <bear.length;i++){
      if(abs(this.pos.x-bear[i].pos.x)<15 &&abs(this.pos.y-bear[i].pos.y)<20){
     game.ended = true;
     game.pause = true;
     this.capture = true;
     bear[i].capture = true;
      }
      }
      */
};


penguinObj.prototype.toy = function() {
    
    if(!this.capture && frameCount-this.spawnInv>0 && frameCount-this.spawnInv<600){
     this.pos.x += sin(this.angle)*0.7;
	 this.pos.y += cos(this.angle)*0.7;
	 
    
    //wall collision and detector
    var near = 0;
   for(var i = 1; i <walls.length;i++){
      if(mag(this.pos.x-walls[i].x,this.pos.y-walls[i].y) < mag(this.pos.x-walls[near].x,this.pos.y-walls[near].y)){
          near = i;
      }
   }
       
      if(abs(this.pos.x-walls[near].x)<=20 &&abs(this.pos.y-walls[near].y)<=20){
          var right = new PVector(walls[near].x-10, walls[near].y);
          var left = new PVector(walls[near].x+10, walls[near].y);
          var up = new PVector(walls[near].x, walls[near].y+10);
          var down = new PVector(walls[near].x, walls[near].y-10);
         
         var normalwall = Math.min(mag(this.pos.x-right.x,this.pos.y-right.y), mag(this.pos.x-left.x,this.pos.y-left.y), mag(this.pos.x-up.x,this.pos.y-up.y),mag(this.pos.x-down.x,this.pos.y-down.y));
        // println(normalwall);
         if(normalwall === mag(this.pos.x-right.x,this.pos.y-right.y)){
             this.pos.x -= 4;
         }
         else if(normalwall === mag(this.pos.x-left.x,this.pos.y-left.y)){
             this.pos.x += 4;
         }
         else if(normalwall===mag(this.pos.x-up.x,this.pos.y-up.y)){
             this.pos.y += 4;
         }
         else if(normalwall===mag(this.pos.x-down.x,this.pos.y-down.y)){
             this.pos.y -= 4;
         }
         
     }
      /*
      for(var i = 0; i <bear.length;i++){
      if(abs(this.pos.x-bear[i].pos.x)<15 &&abs(this.pos.y-bear[i].pos.y)<20){
     this.capture = true;
     bear[i].capture = true;
      }
      }
      */
      
    }
    else if(frameCount-this.spawnInv>600)
    {
        this.active = false;
        // println(frameCount-this.charge);
    }
   
};

uI.prototype.findPen = function() {
    if(penguin[0].pos.x <= 200)
    {
        this.trans.x = 0;
    }
    else if(penguin[0].pos.x >= 800)
    {
        this.trans.x = -600;
    }
    else
    {
        this.trans.x = 200-penguin[0].pos.x;
    }
    if(penguin[0].pos.y <= 200)
    {
        this.trans.y = 0;
    }
    else if(penguin[0].pos.y >= 800)
    {
        this.trans.y = -600;
    }
    else
    {
        this.trans.y = 200-penguin[0].pos.y;
    }
    if(!penguin[penguin.length-1].active)
    {
     penguin.pop();   
    }
};

//snowing animation
sky.prototype.act = function() {
    if(frameCount%8 ===0){
     this.cloud[this.count].pos.x = random(10,390);
     this.cloud[this.count].pos.y = 0;
     this.cloud[this.count].active = true;
     this.count += 1;
     if(this.count ===30){
      this.count = 0;   
     }
    }
     
     for (var i=0; i<this.cloud.length; i++) {
         if(this.cloud[i].active){
        this.cloud[i].pos.y+=2;
        if(this.cloud[i].pos.y>400){
            this.cloud[i].active = false;
        }
        else{
        this.cloud[i].draw();
        }
         }
    }
     
    
};

//snows fishes for victory screen
sky.prototype.party = function() {
    this.cloud = [];
    this.count = 0;
    for(var i = 0; i < 30; i++){
 this.cloud.push(new fishObj());
 this.cloud.active = false;
 }
};

//resets game to initial state, sets up tilemap
var initTilemap = function() {
    walls = [];
    penguin = [];
    bear = [];
    fish = [];
    air.cloud = [];
    for(var i = 0; i < 30; i++){
 air.cloud.push(new snow());
 }
    
    for (var i = 0; i< tilemap.length; i++) {
        for (var j =0; j < tilemap[i].length; j++) {
            switch (tilemap[i][j]) {
                case 'w': walls.push(new wallObj(j*20+10-20, i*20+10-20));
                    break;
                case 'p': penguin.push(new penguinObj(j*20+10-20, i*20+10-20));
                    break;
                case 'b': bear.push(new bearObj(j*20+10-20, i*20+10-20));
                    break;
                case 'f': fish.push(new fishObj(j*20+10-20, i*20+10-20));
                    break;
                case 'd': decoy.push(new decoyObj(j*20+10-20, i*20+10-20));
                    break;
            }
        }
    }
};

//calls game reset
uI.prototype.reset = function() {
    initTilemap();
    game.pause = false;
    game.ended = false;
    game.winner = false;
};

//sets up game
initTilemap();

//when mouse is released after click (used to start game)
var mouseReleased = function() {
    //penguin[0].pos.x = mouseX - game.trans.x;
    //penguin[0].pos.y = mouseY - game.trans.y;
    
    if(game.start && frameCount > 350 && mouseX >200-30 && mouseX <200+30 && mouseY >200-20 && mouseY <200+20){
        game.start = false;
    }
    
    if(game.ended){
  
        game.reset();//reset
        
        }
};

//key presses
keyPressed = function() {

    if(keyCode === 87)//w
    {
     keys[0] = true;
    }
    if(keyCode === 83)//s
    {
        keys[1] = true; 
    }
    if(keyCode === 65)//a
    {
       keys[2] = true; 
    }
    if(keyCode === 68)//d
    {
        keys[3] = true; 
    }
    if(keyCode === 16)//shift
    {
        keys[4] = true; 
    }
    

};
//key releases
keyReleased = function() {

    if(keyCode === 87)//w
    {
     keys[0] = false;
    }
if(keyCode === 83)//s
    {
        keys[1] = false; 
    }
    if(keyCode === 65)//a
    {
       keys[2] = false; 
    }
    if(keyCode === 68)//d
    {
        keys[3] = false; 
    }
    if(keyCode === 16)//shift
    {
        keys[4] = false; 
        
    }
    if(keyCode === 32 && penguin[0].power > 0)//spacebar
    {
        penguin.push(new penguinObj(penguin[0].pos.x+sin(penguin[0].angle)*10, penguin[0].pos.y+cos(penguin[0].angle)*10));
        penguin[penguin.length-1].angle = penguin[0].angle;
        penguin[0].power = penguin[0].power-1;
    }
    
    
    if(keyCode === 72)//h (toggles handicap)
    {
        game.handicap =  !game.handicap;
    }
};





//where all game elements are called
var draw = function() {
    if(frameCount-game.zoom<50)
    {
    game.starting();
    }
    else{
    background(219, 219, 219);
    game.findPen();
    pushMatrix();
    translate(game.trans.x, game.trans.y);
    //translate(0, -600);
    for (var i=0; i<bear.length; i++) {
        bear[i].drawSight();
    }
    for (var i=0; i<fish.length; i++) {
        fish[i].draw();
    }
    for (var i=0; i<decoy.length; i++) {
        decoy[i].draw();
    }
    for (i=1; i<penguin.length; i++) {
        penguin[i].drawToy();
        if(!game.pause){
        penguin[i].toy();
        }
    }
    penguin[0].draw();
        if(!game.pause){
        penguin[0].act();
        }
        for (var i=0; i<walls.length; i++) {
        walls[i].draw();
    }
    
    
    
    
    for (i=0; i<bear.length; i++) {
        bear[i].draw();
        if(!game.pause){
        bear[i].act();
        }
    }
    popMatrix();
    game.draw();
    if(!game.pause || penguin[0].score === 20){
       //println(air.cloud[0].pos.y);
    air.act();
    }
    
    }
};









}};
