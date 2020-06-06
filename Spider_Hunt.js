var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 

// Richard Ngo
// ECE 4525, Hsiao
// 10/11/2019

//Instructions
//Left/right: aim
//Spacebar: shoot


//Description
//In this game, you are trying to shoot down 3 fuzzy spiders that move by swinging across the screen. 
//Each spider will take 3 shots in order to be defeated. Each spider also behaves diffrently. The purple 
//spider is very reactionary, and will try to dodge projectiles at the last second. The yellow spider 
//has a slow reaction time, and will attempt dodge projectiles in advance to compensate. The yellow spider 
//however is also the most quickest and biggest. The blue spider is the most aggresive out of the 3 and will 
//react the least often. The blue spider also has the longest web length and travel distance per web. There 
//is also a secret white spider at the end of the game if you can beat it. All the spiders also have varying 
//swing characteristics. The best strategy to beat this game is to use the water to herd them away from the 
//right and finish them off.



frameRate(60);//60 frames per second
angleMode = "radians";

var uI = function(){
 this.started = true;
 this.ended = false;
 this.winner = false;
 this.handicap = false;
 this.rand1 = random(0, 255);
 this.rand2 = random(0, 255);
 this.rand3 = random(0, 255);
};

var spider = function(x, y, g, l, s, f, r, d, tw, reh, rew, str, c1, c2, c3) {
    this.hang = new PVector(x+30, y);//grapple location
    this.pos = new PVector(x, y);//tank location
    this.velo = new PVector(0, 0);//velo of tank
    this.attached=true;//grapple checker
    
    
    this.grav = g;
    this.posP = new PVector(x,y);
    this.veloP = new PVector(0,0);
    this.delay = frameCount;
    this.check = 0;
    this.stable = false;
    this.stringL = l;
    this.ampl = 30;
    this.size = s;
    this.angle = 0;
    this.fear = f;
    this.react = r;
    this.dex = d;
    this.reachH = reh;
    this.reachW = rew;
    this.strengh = str;
    this.twitchy = tw;
    this.color1 = c1;
    this.color2 = c2;
    this.color3 = c3;
    
    this.life = 3;
    
};

var turret = function(){
    this.angle = 0;
    this.delay = 0;
};

var ball = function(){
    this.pos = new PVector(-6, -6);
    this.velo = new PVector(0, 0);
    this.angle = 0;
    this.active = false;
    this.size = 5;
};
var spiders = [];
spiders.push(new spider(20, 50, 9.8/180, 30, 11, 60, 20, 30, true, 40, 40, 3, 242, 234, 9));
spiders.push(new spider(20, 100, 9.8/180, 50, 9, 30, 10, 40, true, -40, 50, 2, 0, 225, 213));
spiders.push(new spider(20, 150, 9.8/180, 30, 10, 30, 10, 0, false, 60, 40, 1, 255, 0, 213));
var player = new turret();
var balls = [];
for (var i=0; i<50; i= i+1) {//50 bullets maximum on screen
        balls.push(new ball());
    }
    
var keys = [];

var game = new uI();

spider.prototype.move = function() {
     //PLAYER
     this.posP.x = this.pos.x;
     this.posP.y = this.pos.y;
     this.veloP.x = this.velo.x;
     this.veloP.y = this.velo.y;
     
    if(this.attached === true){//if grappled
    //gravity while swinging
    this.velo.y = 9.8/180 + this.velo.y;
    var xlen = this.pos.x-this.hang.x;
    var ylen = this.pos.y-this.hang.y;
    var angle = atan2(xlen,ylen);
    this.angle = angle;
    //println(angle/PI*180);
    var angleV = acos((xlen*this.velo.x+ylen*this.velo.y)/(mag(xlen,ylen)*mag(this.velo.x,this.velo.y)));
    //tension from web
    var normal = mag(this.velo.x,this.velo.y)*cos(angleV);
    this.velo.x = this.velo.x-normal*sin(angle);
    this.velo.y = this.velo.y-normal*cos(angle);
    //updated location
    this.pos.x = this.pos.x + this.velo.x;
    this.pos.y = this.pos.y + this.velo.y;
    
    var xlen2 = this.pos.x-this.hang.x;
    var ylen2 = this.pos.y-this.hang.y;
    //auto corrects errors caused by descrete incrementation of frames instead of continuous flow of time
    this.pos.x = mag(xlen,ylen)*sin(atan2(xlen2,ylen2))+this.hang.x;
    this.pos.y = mag(xlen,ylen)*cos(atan2(xlen2,ylen2))+this.hang.y;
    }
    //when not grappling
    else
    {
        //fun low gravity when not grappling
        this.velo.y = 9.8/60 + this.velo.y;
        //updated location
    this.pos.x = this.pos.x + this.velo.x;
    this.pos.y = this.pos.y + this.velo.y;
    }
};

spider.prototype.act = function() {
    var xlen = this.pos.x-this.hang.x;
var ylen = this.pos.y-this.hang.y;
var grav = 9.8/180;

var dangerD;
var dangerSt = 0;
var dangerSx;
var dangerFt;
var dangerFx;
var distance;
var angle;
var nearest = 0;

var outB;
var dodge = false;


for(var i = 0; i < balls.length; i++){
   if( balls[i].active && mag(this.pos.x-balls[i].pos.x,this.pos.y-balls[i].pos.y) < 2*(this.size/2+balls[i].size/2)){
      this.life -=1;
      balls[i].active = false;
      balls[i].velo.x*=-1*sin(atan2(this.pos.x-balls[i].pos.x,-this.pos.y+balls[i].pos.y));
      balls[i].velo.y*=-1*cos(atan2(this.pos.x-balls[i].pos.x,-this.pos.y+balls[i].pos.y));
      if(this.life ===0){
          this.attached = false;
      }
   }
}
for(var i = 0; i < spiders.length; i++){
    
    if(this.pos.x >= 400 && this.attached && !game.winner){
        
        game.ended = true;
        
    }
    
    if(this.pos.x !== spiders[i].pos.x && this.pos.y !== spiders[i].pos.y){
     
     
     
     if(mag(this.pos.x-spiders[i].pos.x,this.pos.y-spiders[i].pos.y) < 2*(this.size/2+spiders[i].size/2)){
         if(this.pos.x<spiders[i].pos.x){
             this.velo.x*=-1;
             this.hang.x = this.pos.x+20;
             this.hang.y = this.pos.y+10;
             
         }
         if(this.pos.y<spiders[i].pos.y){
            
             this.hang.y -= 1;
             this.pos.y -= 1;
             
         }

     }
      
      
    }
}

if(this.pos.x<5){
    
this.hang.x = this.pos.x+40;
this.delay = frameCount+50;
this.velo.x+=0.01;
}

if(this.pos.y>360){
    
this.hang.y = this.pos.y-50;
this.velo.x+=0.01;
//this.delay = frameCount+50;
}

if(frameCount > this.delay){
//get all threats
if(true||frameCount%5===0 || frameCount === this.delay+1){//frequency balls are checked to speed up
for (var i = 0; i < balls.length; i++){
    if(true){
        distance = mag(balls[i].pos.x-this.hang.x, balls[i].pos.y-this.hang.y);
        angle = player.angle-atan2(this.hang.x-balls[i].pos.x,-this.hang.y+balls[i].pos.y);//angle between ball direction and spider hanging point
        //angle = abs(angle);
       // println(distance*sin(angle));
        outB = this.stringL+this.size/2+balls[i].size/2;
        //outB = this.stringL-(this.size/2+balls[i].size/2);
	//	background(0, 0, 0);
    //text(distance*sin(angle), 350, 50);
    //text(angle/PI*180, 350, 100);
    //fill(255, 0, 0);
//arc(balls[i].pos.x, balls[i].pos.y-20, 20, 20, -angle-PI/2, -PI/2);
 if(distance*sin(angle)<outB && (distance-outB)/(mag(balls[i].velo.x,balls[i].velo.y)*cos(angle))<this.fear){//backup algorithm, quick worst case check
    dangerD= distance*cos(angle)-pow(pow(outB,2)-pow(distance,2)*pow(sin(angle),2),0.5);
    stroke(255, 0, 0);
    //var tester = PI-(asin(distance*sin(angle)/outB)+angle);
    //var tester2 = sin(tester)*outB/sin(angle);
    //text(abs(dangerD)-abs(tester2), 200, 75);
    //text(tester/PI*180, 200, 100);
    
    
    
    

    //text(dangerD, 200, 75);
    //text(dangerD, 200, 75);
    if(dangerD>=0){
        //line(balls[i].pos.x,balls[i].pos.y,balls[i].pos.x+dangerD*sin(angle),balls[i].pos.y-dangerD*cos(angle));
    //text(dangerSt, 200, 75);
    if(dangerSt>dangerD/(mag(balls[i].velo.x,balls[i].velo.y))||dangerSt===0){
        dangerSt = dangerD/(mag(balls[i].velo.x,balls[i].velo.y));
        
        nearest = i;
  //      line(balls[i].pos.x,balls[i].pos.y,balls[i].pos.x+dangerD*sin(angle),balls[i].pos.y-dangerD*cos(angle));
        if(this.twitchy){
            break;
        }
   // text(dangerSt, 200, 75);
    }
    }
 }
}
}
}


        if(dangerSt > 0 && dangerSt <this.fear){//set reaction time?
        angle = player.angle-atan2(this.hang.x-balls[nearest].pos.x,-this.hang.y+balls[nearest].pos.y);//angle between ball direction and spider hanging point
     distance = mag(balls[nearest].pos.x-this.hang.x, balls[nearest].pos.y-this.hang.y);
        var inB = this.stringL-(this.size/2+balls[nearest].size/2);
        
		if(distance*sin(angle)<inB){
		    //println(distance*sin(angle));
		    
     dangerD= distance*cos(angle)-pow(pow(inB,2)-pow(distance,2)*pow(sin(angle),2),0.5);
    if(dangerD<0){
        
        dangerD= distance*cos(angle)+pow(pow(inB,2)-pow(distance,2)*pow(sin(angle),2),0.5);
    }
        dangerFt = dangerD/(mag(balls[nearest].velo.x,balls[nearest].velo.y));
        
        }
        else{
            //println(angle);
            dangerFt= distance*cos(angle)+pow(pow(outB,2)+pow(distance,2)*pow(sin(angle),2),0.5);
            
        }
         
        dangerSx = dangerSt*sin(balls[nearest].angle)+balls[nearest].pos.x;
        dangerFx = dangerFt*sin(balls[nearest].angle)+balls[nearest].pos.x;
        
        //line(balls[nearest].pos.x,balls[nearest].pos.y,balls[nearest].pos.x+dangerD*sin(angle),balls[nearest].pos.y-dangerD*cos(angle));
    //text(dangerFt, 200, 75);
        
        var currentT = acos((this.pos.x-(this.hang.x-abs(this.pos.x-this.hang.x)))/this.ampl)*pow(mag(xlen,ylen)/grav,1/2);
        
        var checkS = this.ampl*cos((currentT+dangerSt)/pow(mag(xlen,ylen)/grav,1/2));
        var checkM = this.ampl*cos(((2*currentT+dangerSt+dangerFt)/2)/pow(mag(xlen,ylen)/grav,1/2));
        var checkF = this.ampl*cos((currentT+dangerFt)/pow(mag(xlen,ylen)/grav,1/2));
        
        if(abs(checkS-checkM)>abs(checkS-checkF)){
            checkF = checkM;
        }
        
       // if(abs(dangerSx-checkS)<10 || abs(dangerFx-checkS)<10|| abs(dangerSx-checkF)<10 ||abs(dangerFx-checkF)<10 || (abs(dangerFx-checkS)<abs(dangerFx-dangerSx)&&abs(dangerSx-checkS)<abs(dangerFx-dangerSx)) || (abs(dangerFx-checkF)<abs(dangerFx-dangerSx)&&abs(dangerSx-checkF)<abs(dangerFx-dangerSx))|| abs(dangerFx-dangerSx)<abs(checkF-checkS)){
       if(this.react<dangerSt){
           if(this.pos.x<dangerSx && this.velo.x > 0&&this.pos.x>this.stringL){
               this.hang.x = this.pos.x-this.reachW;
           }
           else
           {
               
               this.hang.x = this.pos.x+this.reachW;
               if(this.pos.x<this.stringL){
                this.hang.x += 15;  
           }
           }
           
       }
       else if(this.react<dangerFt){
           if(this.pos.x<dangerFx && this.velo.x > 0 &&this.pos.x>this.stringL){
               this.hang.x = this.pos.x-this.reachW;
           }
           else
           {
               this.hang.x = this.pos.x+this.reachW;
               if(this.pos.x<this.stringL){
                this.hang.x += 15;   
               }
           }
           
       }
             if(this.pos.y>350){
                 this.hang.y = this.pos.y-this.reachH-15;
             }
             else
             {
                 
            this.hang.y = this.pos.y;
             }
            dodge = true;
    this.delay = frameCount+this.dex;
       // }
        
        }
        
        if(!dodge && mag(this.velo.x,this.velo.y) <=this.grav && this.velo.y*this.veloP.y <0){
    this.hang.x = this.pos.x+this.reachW;
    if(this.pos.y - this.reachH < 50){
    this.hang.y = 50;
    }
    else
    {
        this.hang.y = this.pos.y - this.reachH;
    }
   // this.delay = frameCount+20;
}

}
if(mag(xlen, ylen)>this.stringL ){
     fill(this.color1, this.color2,this.color3);//default color
    stroke(this.color1, this.color2,this.color3);
    ellipse(this.pos.x+this.strengh*sin(atan2(xlen,ylen)), this.pos.y+this.strengh*cos(atan2(xlen,ylen)), this.size*1.5, this.size*1.5);
    this.pos.x =  this.pos.x-this.strengh*sin(atan2(xlen,ylen));
    this.pos.y =  this.pos.y-this.strengh*cos(atan2(xlen,ylen));
    this.stable=false;
}
else if(!this.stable){
    this.stable=true;
    var angle = atan2(xlen,ylen);
    var KE = pow(mag(this.velo.x,this.velo.y),2)/2;
    var PE = grav*mag(xlen,ylen);
    var maxH = (KE+PE)/grav;
    this.ampl = maxH*tan(angle);
}
//this.hang.x = 200;
      //  this.hang.y = 200;
//println(this.pos.y);
};


spider.prototype.draw = function() {
    if(this.attached === false)    {
        //this barrel
    stroke(255,255,255);
    strokeWeight(2.0);
    var aim = atan2(mouseX-this.pos.x,mouseY-this.pos.y);
   // line(this.pos.x, this.pos.y, this.pos.x+16*sin(aim),this.pos.y+16*cos(aim));
    }
    
    noStroke();
    //this body
   
    
    fill(this.color1, this.color2,this.color3);//default color
    
    ellipse(this.pos.x, this.pos.y, this.size*2, this.size*2);
    
    fill(255,0,0);
    strokeWeight(1.0);
    if(this.attached === true){
    
    //ellipse(this.hang.x, this.hang.y, 10, 10);
    
    //grapple web
    stroke(255,255,255);
    
    line(this.pos.x, this.pos.y, this.hang.x, this.hang.y);
    }
    //stroke(7, 168, 39);//dark green
    //velo indicator
    stroke(250, 13, 250);//purple
    line(this.pos.x, this.pos.y, this.pos.x-this.velo.x*5, this.pos.y-this.velo.y*5);
    fill(255,255,255);
    text(this.life, this.pos.x-3, this.pos.y-15);
};

turret.prototype.act = function(){
    if(keys[0]){
        this.angle -=PI/60;
    }
    if(keys[1]){
        this.angle +=PI/60;
    }
    if(keys[2] && frameCount-this.delay>=20){
          
         for(var i = 49; i >= 0; i = i-1)
            {
                //find first free bullet, spawn starting from enemy, sent toward player
                if(balls[i].pos.x <-5 || balls[i].pos.x > 405 || balls[i].pos.y <-5 || balls[i].pos.y > 405)//balls[i].active === false)
                {
        this.delay = frameCount;
        balls[i].pos.x = 200+34*sin(this.angle);
        balls[i].pos.y = 400-34*cos(this.angle);
        balls[i].velo.x = 3*sin(this.angle);
        balls[i].velo.y = 3*cos(this.angle);
        balls[i].angle = this.angle;
        //velocity of bullet is 2 pixels per frame
        balls[i].active = true;
        break;
                }
            }
    }
        
    
};

turret.prototype.draw = function() {
    pushMatrix();
    translate(200, 400);
    rotate(this.angle);
    stroke(204, 204, 204);
    strokeWeight(3.0);
    line(0, 0, 0, -25);
    fill(255,0,0);
    noStroke();
    ellipse(0, 0, 30, 30);
    popMatrix();
};


ball.prototype.act = function(){
    
            this.pos.x += this.velo.x;
            this.pos.y -= this.velo.y;
            if(this.pos.x <-5 || this.pos.x > 405 || this.pos.y <-5 || this.pos.y > 405)
            {
                //this.active = false;//despawn when out of range
            }
            //println(this.mag[i].y);
        
};

ball.prototype.draw = function(){
     fill(17, 0, 255);
     ellipse(this.pos.x, this.pos.y, this.size*2, this.size*2);
     
};

keyPressed = function() {
  
    if(keyCode === 37)//a
    {
       keys[0] = true; 
    }
    if(keyCode === 39)//d
    {
        keys[1] = true; 
    }
    if(keyCode === 32)//spacebar
    {
        keys[2] = true;
    }

};

keyReleased = function() {
  if(keyCode === 37)//left
    {
       keys[0] = false; 
    }
    if(keyCode === 39)//right
    {
        keys[1] = false; 
    }
    if(keyCode === 32)//spacebar
    {
        keys[2] = false;
    }

};

uI.prototype.resetter = function(){
     spiders = [];
spiders.push(new spider(20, 50, 9.8/180, 30, 11, 60, 20, 30, true, 40, 40, 3, 242, 234, 9));
spiders.push(new spider(20, 100, 9.8/180, 50, 9, 30, 10, 40, true, -40, 50, 2, 0, 225, 213));
spiders.push(new spider(20, 150, 9.8/180, 30, 10, 30, 10, 0, false, 60, 40, 1, 255, 0, 213));
 player = new turret();
 balls = [];
for (var i=0; i<50; i= i+1) {//50 bullets maximum on screen
        balls.push(new ball());
    }
    
 keys = [];

 game = new uI();
};

var mouseReleased = function() {
   if(game.started){
        game.started = false;  
    }
    if(game.ended){
        game.resetter();
     game.started = false;   
    }
    if(game.winner){
        game.resetter();
    }
    
};

uI.prototype.state = function(){
    var washed = true;
    for(var i = 0; i<spiders.length;i++){
     if(spiders[i].life>0){
         washed = false;
         break;
     }
    }
    if(washed && !this.winner){
    spiders.push(new spider(20, 150, 9.8/60, 30, 9, 30, 10, 0, false, 80, 40, 3, 255, 255, 255));
        this.winner = true;
    }
    
    if(this.started){
        fill(230, 122, 230);
        textSize(14);
        text("Spider Sploosher!", 165, 95);
        fill(230, 122, 230);
        textSize(12);
        text("Don't let the evil fuzz spiders reach the right side!", 90, 130);
        text("Wash them away using the fire hydrant!", 90, 147);
        text("Three shots should be enough for each.", 90, 164);
        fill(9, 240, 9);
        textSize(14);
        text("Click Anywhere to Begin", 130,210);
        textSize(10);
         fill(9, 240, 9);
        text("Left/Right Arrows: Rotate Nozzle", 130, 235);
        text("Spacebar: Spray Water", 130, 250);
        //text("Left/Right Arrow: Move Left/Right", 130, 245);
        //text("H: Handicap (stop and turns player back abit", 130, 260);
        //text("     whenever player touches a wall)", 130, 275);
        stroke(250, 13, 250);
        line(100,220,300, 220);
    }
    if(this.ended){
        
         textSize(24);
    fill(255,0,0);
    text("Game Over", 135, 175);    
    textSize(18);
    fill(0,0,0);
   
    textSize(12);
    fill(255,255,255);
    text("Click Anywhere to Try Again", 125, 220);
    }
    else if(this.winner){
        
        textSize(24);
    if(frameCount %5 === 0){
        this.rand1 = random(0, 255);
        this.rand2 = random(0, 255);
        this.rand3 = random(0, 255);
    }
    fill(this.rand1, this.rand2, this.rand3);
    text("You Win!", 150, 175);    
    textSize(18);
    fill(0,0,0);
   
    textSize(12);
    fill(255,255,255);
    text("Click Anywhere to Start Over", 125, 220);
    }
    
    stroke(22, 222, 85);
    strokeWeight(10);
    line(400,0,400,400);
    
    
    
    
};
var draw = function() {
    background(0, 0, 0);
    
    for(var i = 0; i < spiders.length; i++){
    spiders[i].move();
    if(!game.started){
        spiders[i].act();
    }
        spiders[i].draw();
    }
    if(!game.started){
        player.act();
    }
        player.draw();
        for(var i = 0; i < balls.length; i++){
            //if(balls[i].active){
            balls[i].draw();
            if(!game.started){
            balls[i].act();
            }
           // println(balls[i].angle);
            //}
            
        
    }
    game.state();
        /*
        var angle = player.angle-atan2(spid.hang.x-mouseX,-spid.hang.y+mouseY);//angle between ball direction and spider hanging point
    text(player.angle/PI*180, 350, 50);
    text(atan2(spid.hang.x-mouseX,-spid.hang.y+mouseY)/PI*180, 350, 100);
    text(angle/PI*180, 350, 150);
    
arc(50, 50, 30, 30, 0, angle);
*/
};










}};
