var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 

// Richard Ngo
// ECE 4525, Hsiao
// 10/5/2019

//Instructions
//up: jump
//left/right: move left/right
//down: drop a ball
//Description
//To win, you must collect all the 5 fishes and reach the top platform afterwards, to avoid losing, 
//you must avoid being touched by bears, who will chase you if you enter their sight range. To defend yourself, 
//you can drop balls, which will get rid of the bear if it hits them from above. The balls however will dissapear 
//instead if they hit the bear from the side or from below. You also only have 10 balls

frameRate(60);//60 frames per second
angleMode = "radians";
var tilemap = [
        "wwwwwwwwwwwwwwwwwwwwww",
        "w                    w",
        "w   e      p    e    w",
        "w   p      f         w",
        "w         e          w",
        "w                    w",
        "w            e  f    w",
        "w     p         p    w",
        "w  e                 w",
        "w                    w",
        "w          p         w",
        "w   f            e   w",
        "w   p                w",
        "w                 p  w",
        "w         p          w",
        "w                    w",
        "w         f   e      w",
        "w    p           p   w",
        "w                    w",
        "w                    w",
        "w c               f  w",
        "wwwwwwwwwwwwwwwwwwwwww",];


var ballman = function(x,y){
    this.pos = new PVector(x, y);
    this.velo = new PVector(0, 0);
    this.jump = false;
    this.grounded = true;
    this.balls = 10;
	this.score = 0;
    this.capture = false;
    this.angle = PI/2;
};

var ball = function(x,y, velox, veloy){
    this.pos = new PVector(x, y);
    this.velo = new PVector(0, veloy);
    this.grounded = false;
    this.active = true;
};

var enemy = function(x,y){
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
    this.active = true;
};

var plat = function(x,y){
    this.pos = new PVector(x, y);
};

var wallObj = function(x, y) {
    this.x = x;
    this.y = y;
};

var fishObj = function(x,y){
    this.pos = new PVector(x, y);
    this.turn=-1;
    this.active = true;
};

var uI = function(){
 this.pause = true;
 this.ended = false;
 this.winner = false;
 this.handicap = false;
 this.rand1 = random(0, 255);
 this.rand2 = random(0, 255);
 this.rand3 = random(0, 255);
};

var player = new ballman(0, 0);
var balls = [];
var enemys = [];
var plats = [];
var keys = [];
var walls = [];
var fish = [];
var game = new uI();

keyPressed = function() {
if(!game.pause){
    if(keyCode === 38)//w
    {
     keys[0] = true;
     
    }
    if(keyCode === 40)//s
    {
        keys[1] = true; 
    }
    if(keyCode === 37)//a
    {
       keys[2] = true; 
    }
    if(keyCode === 39)//d
    {
        keys[3] = true; 
    }
}
};

keyReleased = function() {
    if(!game.pause){
    if(keyCode === 38)//w
    {
     keys[0] = false;
     
    }
    if(keyCode === 40)//s
    {
        keys[1] = false;
        if(player.balls>0){
            if(player.velo.y>0){
            balls.push(new ball(player.pos.x, player.pos.y, player.velo.x, player.velo.y+1));
        }
        else{
           balls.push(new ball(player.pos.x, player.pos.y, player.velo.x, 0)); 
        }
        
            player.balls--;
        }
    }
    if(keyCode === 37)//a
    {
       keys[2] = false; 
    }
    if(keyCode === 39)//d
    {
        keys[3] = false; 
    }
}
};

var mouseReleased = function() {
    //penguin[0].pos.x = mouseX;
    //penguin[0].pos.y = mouseY;
    if(!game.ended){
  game.pause = false;
    }
    else{
        game.reset();//reset
        }
};


ballman.prototype.act = function() {
   /* if(this.grounded&&(!keys[3]&&this.velo.x>0 ||!keys[2]&&this.velo.x<0 || (keys[3]&&keys[2]))){
        this.velo.x=0;
    }
    */if(this.grounded&&(!keys[3]&&this.velo.x>0 ||!keys[2]&&this.velo.x<0 ||(keys[3]&&keys[2]))){
    if(abs(this.velo.x) < 9.8/15)
    {
        this.velo.x = 0;
    }
    if(this.velo.x < 0){
        this.velo.x += 9.8/15;
    }
    if(this.velo.x > 0){
        this.velo.x -= 9.8/15;
    }
    }
    
    
    if(keys[3] && this.velo.x < 4.9){
        this.velo.x += 9.8/30;
    }
    if(keys[2] && this.velo.x > -4.9){
        this.velo.x -= 9.8/30;
    }
    
    this.velo.y += 9.8/60;
    
    if(this.jump && this.grounded)
    {
        this.velo.y = -6.0;
        this.grounded = false;
        this.jump = false;
    }
    
     if(keys[0]){
     if(this.grounded){
     this.jump = true;
     this.grounded = false;
     }
     }
     else if(this.velo.y<-2)
     {
         this.velo.y = -2;
     }
   
    //might be trouble walking off plat
    var fpos =  new PVector(0, 0);
    fpos.x = this.pos.x+this.velo.x;
    fpos.y =  this.pos.y+this.velo.y;
    var slope = (fpos.x-this.pos.x)/(fpos.y-this.pos.y);
    
    
    for(var i = 0; i <plats.length;i++){
        
        if(this.pos.y+5 <= plats[i].pos.y && fpos.y+5 >= plats[i].pos.y){
           // println("height");
        if(slope*(plats[i].pos.y-(this.pos.y+5))+this.pos.x >= plats[i].pos.x - 49 && slope*(plats[i].pos.y-(this.pos.y+5))+this.pos.x <= plats[i].pos.x + 50){
              fpos.y = plats[i].pos.y - 5;
              this.velo.y = 0;
              this.grounded = true;
              if(player.score === 5 &&plats[i].pos.y === 30){
         game.ended = true;
         game.pause = true;
     }
              
              break;
              }
          }
       }
       
    //if hit a wall, bounce back   
    if(fpos.x-5 < 0 && this.velo.x < 0){
        this.velo.x *= -0.9;
        fpos.x -= 2*(fpos.x-5);
    }
    if(fpos.x+5>400 && this.velo.x > 0){
        this.velo.x *= -0.9;
        fpos.x = fpos.x-2*((fpos.x+5)-400);
    }
    
    //if hits bottem
    if(fpos.y+5 >= 400){
        fpos.y = 395;
        this.velo.y = 0;
        this.grounded = true;
    }
    
    this.pos.x = fpos.x;
    this.pos.y = fpos.y;

//println("here");
    
     for(var i = 0; i <fish.length;i++){
      if(abs(this.pos.x-fish[i].pos.x)<15 &&abs(this.pos.y-fish[i].pos.y)<15&&fish[i].active){
     player.score += 1;
     fish[i].active = false;
    /* if(player.score === 5){
         game.ended = true;
         game.pause = true;
     }*/
      }
      }
      
     
      for(var i = 0; i <enemys.length;i++){
      if(enemys[i].active && abs(this.pos.x-enemys[i].pos.x)<15 &&abs(this.pos.y-enemys[i].pos.y)<20){
          
     game.ended = true;
     game.pause = true;
     this.capture = true;
     enemys[i].capture = true;
     
      }
      }
       
};

ball.prototype.act = function() {
    var fpos =  new PVector(0, 0);
    
    
    
    
    if(this.grounded){
    if(abs(this.velo.x) <= 4.9/110)
    {
        this.velo.x = 0;
    }
    if(this.velo.x < 0){
        this.velo.x += 4.9/100;
    }
    if(this.velo.x > 0){
        this.velo.x -= 4.9/110;
    }
    }
    else
    {
        this.velo.y += 9.8/60;
    }
    if(abs(this.velo.y) < 9.8/60 && this.pos.y >= 394)
    {
        this.velo.y = 0;
        this.grounded = true;
    }
    
    fpos.x = this.pos.x+this.velo.x;
    fpos.y = this.pos.y+this.velo.y;
    
    //if hit a wall, bounce back   
    if(fpos.x-5 < 0 && this.velo.x < 0){
        this.velo.x *= -0.9;
        fpos.x -= 2*(fpos.x-5);
    }
    if(fpos.x+5>400 && this.velo.x > 0){
        this.velo.x *= -0.9;
        fpos.x = fpos.x-2*((fpos.x+5)-400);
    }
    
    //if hits bottem
    if(fpos.y+5 >= 400){
        this.velo.y *= -0.8;
        fpos.y = fpos.y-2*((fpos.y+5)-400);
        //this.grounded = true;
    }
    
    this.pos.x = fpos.x;
    this.pos.y = fpos.y;
    
     for(var i = 0; i <enemys.length;i++){
      if(enemys[i].active&&abs(this.pos.x-enemys[i].pos.x)<15 &&abs(this.pos.y-enemys[i].pos.y)<15){
          if(this.pos.y+2<enemys[i].pos.y)
          {
              enemys[i].active = false;
              
          }
          else
          {
              this.active = false;
          }
      }
     }
};


enemy.prototype.act = function() {
     
     //println("before"+this.angle);
		this.angle = atan2(sin(this.angle),cos(this.angle));
		//println("after"+this.angle);
     
   //if within range
        if(mag(this.pos.x-player.pos.x,this.pos.y-player.pos.y)<90){
            //println("inrange");
            //bear is facing right direction
            if(atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)<this.angle+PI/2-PI/5 && atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)>this.angle-PI/2+PI/5){
              //  println("right direction");

            this.travel.x = player.pos.x;
            this.travel.y = player.pos.y;
			this.chase = true;
			//println("found");
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
		 this.turning = PI;//atan2(this.pos.x-200,this.pos.y-200);//PI*3/4;
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
};



ballman.prototype.draw = function() {
    if(!this.capture){
     pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    //rotate(-this.angle);
    if(!this.grounded || this.velo.x!== 0){
	this.angle =atan2(this.velo.x, this.velo.y);
    }
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
    //stroke(250, 13, 250);//purple
    //line(this.pos.x, this.pos.y, this.pos.x-this.velo.x*5, this.pos.y-this.velo.y*5);
};

ball.prototype.draw = function() {
    fill(250, 15, 46);//default color
    ellipse(this.pos.x, this.pos.y, 20, 20);
    
    stroke(250, 15, 46);//purple
    line(this.pos.x, this.pos.y, this.pos.x-this.velo.x*5, this.pos.y-this.velo.y*5);
};

plat.prototype.draw = function() {
    stroke(47, 0, 255);//blue
    line(this.pos.x-49, this.pos.y, this.pos.x+50, this.pos.y);
    //println("here");
};

enemy.prototype.draw = function() {
   pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    fill(255, 255, 255);
    stroke(0,0,0);
     ellipse(0, 0, 20, 15);
     if(this.chase||this.capture){
     ellipse(-6, -6, 4, 15);
    ellipse(6, -6, 4, 15);
     }
     else
     {
      ellipse(-6, -6, 4, 10);
    ellipse(6, -6, 4, 10);   
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
     fill(46, 44, 46);
    noStroke();
     ellipse(0, heldpos, 15, 15);
     ellipse(0, heldpos, 19, 8);
     fill(17, 240, 225);
     ellipse(-3, -4+heldpos, 3, 4);
     ellipse(3, -4+heldpos, 3, 4);
     fill(247, 164, 10);
    triangle(-3, -7+heldpos, 3, -7+heldpos, 0, -10+heldpos);
    this.angle+=PI/75;
     }
     popMatrix();
};

enemy.prototype.drawSight = function() {

    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    noStroke();
    fill(251, 255, 214);
    arc(0, 0, 165, 165, PI+PI/4.5, 2*PI-PI/4.5);
    popMatrix();

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
    
    if(frameCount%60 === 0 && (!game.pause || player.score===20))
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
    
    fill(255, 255, 255);
    text("Balls: "+ player.balls, 175, 15);
    if(this.pause){//initial state
       fill(230, 122, 230);
        textSize(14);
        text("Its Time to Eat!", 165, 95);
        fill(230, 122, 230);
        textSize(12);
        text("Collect all 5 fishes and reach the top platform to win.", 90, 130);
        text("Avoid hungry polar bears by avoiding sightlines", 90, 147);
        text("and dropping balls on top of them to defeat them.", 90, 164);
        fill(9, 240, 9);
        textSize(14);
        text("Click Anywhere to Begin", 130, 190);
        textSize(10);
         fill(9, 240, 9);
        text("Up Arrow: Jump", 130, 215);
        text("Down Arrow: Drop Ball", 130, 230);
        text("Left/Right Arrow: Move Left/Right", 130, 245);
        //text("H: Handicap (stop and turns player back abit", 130, 260);
        //text("     whenever player touches a wall)", 130, 275);
        stroke(250, 13, 250);
        line(100,200,300, 200);
        
    }
    }
    
    
    if(this.ended)//if game over
    {
        
        if(player.score ===5)
        {
            if(!this.winner)
            {
            //air.party();
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
    
    text("Final Score: "+ player.score, 140, 200);
    textSize(12);
    fill(255,255,255);
    text("Click Anywhere to Try Again", 125, 220);
    }
        else{
    textSize(24);
    fill(255,0,0);
    text("Game Over", 130, 175);    
    textSize(18);
    fill(255,255,255);
    text("Final Score: "+ player.score, 140, 200);
    textSize(12);
    fill(255,255,255);
    text("Click Anywhere to Try Again", 125, 220);
    }
    }

};


var initTilemap = function() {
     balls = [];
     enemys = [];
     plats = [];
     keys = [];
	 fish = [];
	 player = new ballman();
for (var i = 0; i< tilemap.length; i++) {
        for (var j =0; j < tilemap[i].length; j++) {
            switch (tilemap[i][j]) {
                case 'w': walls.push(new wallObj(j*20+10-20, i*20+10-20));
                    break;
                case 'p': plats.push(new plat(j*20+10-20, i*20+10-20));
                    break;
                case 'e': enemys.push(new enemy(j*20+10-20, i*20+10-20));
                    break;
				case 'f': fish.push(new fishObj(j*20+10-20, i*20+10-20));
                    break;
                    case 'c': //player = new ballman(j*20+10-20, i*20+10-20);
                    player.pos.x = j*20+10-20;
                    player.pos.y = i*20+10-20;
                    break;
            }
        }
    }
};


//calls game reset
uI.prototype.reset = function() {
    initTilemap();
    game.pause = true;
    game.ended = false;
    game.winner = false;
};

initTilemap();

var draw = function() {
    background(69, 5, 69);
    //println(plats.length);
    for (var i=0; i<enemys.length; i++) {
        if(!game.pause && enemys[i].active){
        enemys[i].drawSight();
        }
    }
    if(!game.pause){
        player.act();
        }
    player.draw();
for (var i=0; i<balls.length; i++) {
    if(balls[i].active){
        if(!game.pause){
        balls[i].act();
        }
        balls[i].draw();
    }
    }
    for (i=0; i<plats.length; i++) {
        plats[i].draw();
        //println("here");
    }
    for (i=0; i<enemys.length; i++) {
        if(enemys[i].active){
        enemys[i].draw();
        if(!game.pause){
        enemys[i].act();
        }
        }
    }
	for (i=0; i<fish.length; i++) {
        fish[i].draw();        
    }
game.draw();
//println(player.capture);
};








}};
