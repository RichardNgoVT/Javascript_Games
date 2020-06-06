var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);


// Richard Ngo
// ECE 4525, Hsiao
// 12/7/2019

//At the Main menu of game, pressing the instructions button will lead to the instructions. 
//A figure is able to be moved around by dragging its limbs to diffrent angle while spacebar isn't pressed. 
//The game engine is paused until spacebar is pressed, and then the figure will carryout the commanded movements. 
//Pressing the start button will exit the starting screen, and enter the main game where you have to defeat the zombies. 
//You deal the most damage and take the least damage when hitting zombies with your feet and fist. 
//You'll take extra damage if a zombie hits your head. The more velocity your limbs have, the more damage they will do to a zombie. 
//The same applies to Move Man as well. Defeat all 20 zombies in order to win the game. Becareful, as the zombies will get
//progressively tougher as they spawn. Health is displayed on top of the characters. When Move Man's health reaches zero or less,
//he will die and you will lose the game.



angleMode = "radians";

var body;
var game;
var keys = [false, false, true];



keyPressed = function() {
  

    if(keyCode === 16)//shift
    {
       keys[1] = true; 
    }
    if(keyCode === 32)//spacebar
    {
        keys[2] = false;
    }
    
    if(keyCode === 65)//a
    {
       keys[3] = true; 
    }
    if(keyCode === 68)//d
    {
        keys[4] = true; 
    }
};

keyReleased = function() {

    if(keyCode === 16)//shift
    {
       keys[1] = false; 
    }
    if(keyCode === 32)//spacebar
    {
        keys[2] = true;
        
    }
    if(keyCode === 65)//a
    {
       keys[3] = false; 
    }
    if(keyCode === 68)//d
    {
        keys[4] = false; 
    }


};

var button = function(x,iy,fy,w,h,s){
 this.pos = new PVector(x,iy);
 this.height = h;
 this.width = w;
 this.initialH = iy;
 this.finalH = fy;
 this.active = true;
 this.speed = s;
 this.text = "";
};


var spotlight = function(){
  var on = false;
  var delay = frameCount;
  
};
var uI = function(){
    this.entered = false;
    this.instructShow = false;
    this.start = false;
    this.startB = new button(250,-2000,310,100,50,150);
    this.startB.text = "\n\n          START";
    this.instB = new button(50,-2000,310,100,50,100);
    this.instB.text = "\n\n  INSTRUCTIONS";
    this.inst = new button(25,2000,25,350,350,150);
    this.inst.text = "\n INSTRUCTIONS\n Use the mouse to command Move Mans limbs while time is \n stopped and help him defeat the zombies. Resume time by \n holding down spacebar. You deal the most damage and take the \n least damage when hitting zombies with your feet and fist. You'll \n take extra damage if a zombie hits your head. The more velocity\n your limbs have, the more damage they will do to a zombie. The \n same applies to Move Man as well. Defeat all 20 zombies in \n order to win the game. Becareful, as the zombies will get \n progressively tougher as they spawn. Health is displayed on top\n of the characters. When your health reaches zero or less, you \n will lose the game.";
    this.begin = false;
    this.delay = 0;
    this.c1 = 250;
    this.c2 = 249;
    this.c3 = 220;
    this.trans=new PVector(0,0);
    
    this.maxhp=100;
    this.spawnrate = 250;
    this.lastspawn = 500;
    this.score = 0;
    this.lastheal = 0;
};

button.prototype.inRange = function()
{
    if((mouseX-game.trans.x-this.pos.x)<this.width && mouseX-game.trans.x>this.pos.x && (mouseY-game.trans.y-this.pos.y)<this.height && mouseY-game.trans.y > this.pos.y){
        return true;
        
    }
    return false;
};

button.prototype.act = function(){
    if(this.active){
     if(this.pos.y !== this.finalH){
         if(abs(this.pos.y-this.finalH) < this.speed){
            this.pos.y = this.finalH;
         }
         else{
         this.pos.y =  this.pos.y+this.speed*(this.finalH-this.pos.y)/abs(this.finalH-this.pos.y);
     }
     }
    }
    else{
       if(this.pos.y !== this.initialH){
           if(abs(this.pos.y-this.initialH) < this.speed){
            this.pos.y = this.initialH;   
            
           }
           else{
      this.pos.y =  this.pos.y+this.speed*(this.initialH-this.pos.y)/abs(this.initialH-this.pos.y);
           }
     } 
     
    }
    
    fill(0, 34, 255);
        stroke(0, 0, 0);
        strokeWeight(1);
        rect(this.pos.x,this.pos.y,this.width,this.height);
    fill(255, 255, 255);
    text(this.text, this.pos.x, this.pos.y);
    if((mouseX-game.trans.x-this.pos.x)<this.width && mouseX-game.trans.x>this.pos.x && (mouseY-game.trans.y-this.pos.y)<this.height && mouseY-game.trans.y > this.pos.y){
        fill(0, 247, 255);
        stroke(255, 255, 255);
        strokeWeight(3);
        rect(this.pos.x,this.pos.y,this.width,this.height);
    fill(0, 0, 0);
    text(this.text, this.pos.x, this.pos.y);
        
    }
    
    
    
};

uI.prototype.act = function(){
    if(this.begin){
        if(this.delay<frameCount){
            if(this.c1>0){
             this.c1 = this.c1-2;   
            }
            if(this.c2>0){
             this.c2 = this.c2-2;   
            }
            if(this.c1>0){
             this.c3 = this.c3-2;   
            }
            
        }
        
       
        noStroke();
    pushMatrix();
    
    var angle=atan2(10-body.parts[0].pos.x,10-body.parts[0].pos.y);
    rotate(-angle+PI/4+PI);
    fill(this.c1, this.c2, this.c3);
    arc(-10,-10,1000,1000,PI/6,2*PI/6);
    popMatrix();
    
    pushMatrix();
     var angle=atan2(body.parts[0].pos.x-400,10-body.parts[0].pos.y);
     translate(400,0);
    
    
   scale(-1,1);
   rotate(-angle+PI/4+PI);
    
    fill(this.c1, this.c2, this.c3);
    arc(-10,-10,1000,1000,PI/6,2*PI/6);
    popMatrix();
    
     if(this.delay+300<frameCount){
             fill(255, 255, 255);
     textSize(30);
    text("       DODGE THE BULLETS", 100,100);
    
        }
    }
    else{
    if(this.instructShow){
     this.inst.active = true;
    this.instB.active = false;
    this.startB.active = false;
    }
    else{
    this.inst.active = false;
    this.instB.active = true;
    this.startB.active = true;
        
        
    }
    
    
    
    
    this.inst.act();
    
    this.instB.act();
    this.startB.act();
    if(!this.instructShow){
    fill(9, 240, 17);
    textSize(27);
    text("Move Man", 140,80);
    fill(219, 21, 127);
    textSize(18);
    text("VS", 190,100);
    fill(255, 0, 0);
    
        textSize(30);
    text("\nTHE ZOMBIES!", 100+random(-1,1),100+random(-1,1));
    fill(255, 255, 255);
    textSize(12);
    text("  Richard Ngo", 160,165);
    }
    textSize(12);
    }
};

uI.prototype.findPlayer = function() {
    
        this.trans.x = 200-body.parts[2].posP.x;
    
       // this.trans.y = 200-body.parts[0].posP.y+95;
    
};

var game = new uI();
var mousePressed = function() {
    keys[0] = true;
};


var part = function(x, y, M, minA, maxA, modifier, xaccel){
    this.pos = new PVector(x, y);
    this.posP = new PVector(x, y);
    this.velo = new PVector(0, 0);
    this.veloIn = new PVector(0, 0);
    this.accel = new PVector(xaccel, 10/60);
    this.mass = M;
    //this.accel = new PVector(0, 0);
	this.minAng = minA/180*PI;
	this.maxAng = maxA/180*PI;
	//this.damMod = modifier;
	this.damMod = modifier;
	this.right = true;
	this.attached = [];
	this.len = [];
	this.id = 0;
	this.name = "";
	this.setAng=0;
	this.setPos = new PVector(0, 0);
	this.turn = true;
	
};

var linkedparts= function(){
this.parts = [];
this.active = 0;
this.dragging = false;
this.lens = [];
this.hp = 500;
};

linkedparts.prototype.createHuman = function(x,y){

var head = new part(x,y,0.5,-70,70,2,0);
var neck = new part(x,y+10,1,-45,180,1,0);
var elbowL = new part(x-10,y+30,2,-3,170,1,0);
var elbowR = new part(x+10,y+30,2,-3,170,1,0);
var wristL = new part(x-15,y+50,4,-90,90,0.0,0);
var wristR = new part(x+15,y+50,4,-90,90,0.0,0);
var fintipL = new part(x-16,y+60,4,-90,90,0.0,0);
var fintipR = new part(x+16,y+60,4,-90,90,0.0,0);
var belly = new part(x,y+45,1,-10,145,1,0);
var hips = new part(x,y+50,1,-90,90,1,0);
var kneeL = new part(x-10,y+70,2,-170,0,1,0);
var kneeR = new part(x+10,y+70,2,-170,0,1,0);
var ankleL = new part(x-15,y+90,4,5,100,0.0,0);
var ankleR = new part(x+15,y+90,4,5,100,0.0,0);
var toesL = new part(x-18,y+102,4,5,100,0.0,0);
var toesR = new part(x+18,y+102,4,5,100,0.0,0);

this.parts = [belly,neck,hips,head,elbowL,elbowR,wristL,wristR,fintipL,fintipR,kneeL,kneeR,ankleL,ankleR,toesL,toesR];

for(var i = 0;i<this.parts.length;i++){
    this.parts[i].id = i;
}

head.attached = [neck.id];
head.len = [10];
head.name = "head";

neck.attached = [belly.id,head.id,elbowL.id,elbowR.id];
neck.len = [35,10,20,20];
neck.name = "neck";

elbowL.attached = [neck.id,wristL.id];
elbowL.len = [20,20];
elbowL.name = "elbowL";

elbowR.attached = [neck.id,wristR.id];
elbowR.len = [20,20];
elbowR.name = "elbowR";

wristL.attached = [elbowL.id,fintipL.id];
wristL.len = [20,10];
wristL.name = "wristL";

wristR.attached = [elbowR.id,fintipR.id];
wristR.len = [20,10];
wristR.name = "wristR";

fintipL.attached = [wristL.id];
fintipL.len = [10];
fintipL.name = "fintipL";

fintipR.attached = [wristR.id];
fintipR.len = [10];
fintipR.name = "fintipR";

belly.attached = [neck.id,hips.id];
belly.len = [35,1];
belly.name = "belly";

hips.attached = [belly.id,kneeL.id,kneeR.id];
hips.len = [1,20,20];
hips.name = "hips";

kneeL.attached = [hips.id,ankleL.id];
kneeL.len = [20,20];
kneeL.name = "kneeL";

kneeR.attached = [hips.id,ankleR.id];
kneeR.len = [20,20];
kneeR.name = "kneeR";

ankleL.attached = [kneeL.id,toesL.id];
ankleL.len = [20,12];
ankleL.name = "ankleL";

ankleR.attached = [kneeR.id,toesR.id];
ankleR.len = [20,12];
ankleR.name = "ankleR";

toesL.attached = [ankleL.id];
toesL.len = [12];
toesL.name = "toesL";

toesR.attached = [ankleR.id];
toesR.len = [12];
toesR.name = "toesR";

};

linkedparts.prototype.createAnt = function(x,y){

var head = new part(x,y,PI,PI,1,0,0);
var neck = new part(x,y+10,PI,PI,1,0,1);
var tail = new part(x,y+30,PI,PI,1,0,2);

head.attached = [neck.id];
head.len = [10];

neck.attached = [head.id,tail.id];
neck.len = [10,20];

tail.attached = [neck.id];
tail.len = [20];


this.parts = [head,neck,tail];
};

linkedparts.prototype.createJoint = function(x,y){

var head = new part(x,y,PI,PI,1,0,0);
var neck = new part(x,y+10,PI,PI,1,0,1);

head.attached = [neck.id];
head.len = [10];

neck.attached = [head.id];
neck.len = [10];

this.parts = [head,neck];
};


var ragdoll= function(){
this.pos = new PVector(0,0);
this.velo = new PVector(0,0);
this.max = 0;
this.hp = 200;
this.active = false;

this.torso = new linkedparts();
this.armL = new linkedparts();
this.armR = new linkedparts();
this.legL = new linkedparts();
this.legR = new linkedparts();
};



ragdoll.prototype.spawn = function(x,y){
    //x=200
    //y=0
    //(x, y, M, minA, maxA, modifier, xaccel)
this.active = true;
this.pos.x=x;
this.pos.y=y;
    
this.torso.parts.push(new part(x,y,1,180,180,1,0));
this.torso.parts.push(new part(x,y+10,1,180,180,1,0));
this.torso.parts.push(new part(x,y+50,1,180,180,1,0));
this.torso.len = [10,40];

this.armL.parts.push(new part(x,y+10,1,180,180,1,0));
this.armL.parts.push(new part(x,y+30,1,180,180,1,0));
this.armL.parts.push(new part(x,y+50,1,180,180,1,-2/60));
this.armL.parts.push(new part(x,y+60,1,180,180,1,0));
this.armL.len = [20,20,10];

this.armR.parts.push(new part(x,y+10,1,180,180,1,0));
this.armR.parts.push(new part(x,y+30,1,180,180,1,0));
this.armR.parts.push(new part(x,y+50,1,180,180,1,2/60));
this.armR.parts.push(new part(x,y+60,1,180,180,1,0));
this.armR.len = [20,20,10];

this.legL.parts.push(new part(x,y+50,1,180,180,1,0));
this.legL.parts.push(new part(x,y+70,1,180,180,1,0));
this.legL.parts.push(new part(x,y+90,1,180,180,1,-2/60));
this.legL.parts.push(new part(x,y+102,1,180,180,1,0));
this.legL.len = [20,20,12];

this.legR.parts.push(new part(x,y+50,1,180,180,1,0));
this.legR.parts.push(new part(x,y+70,1,180,180,1,0));
this.legR.parts.push(new part(x,y+90,1,180,180,1,2/60));
this.legR.parts.push(new part(x,y+102,1,180,180,1,0));
this.legR.len = [20,20,12];
};







var body = new linkedparts();



body.createHuman(200,200);
var controller = new linkedparts();
controller.createHuman(100,100);

//var flunkie = new ragdoll();
//flunkie.spawn(300,285);

var zombies = [];
//for(var z = 0; z < 20; z++){
//zombies.push(new ragdoll());
//}
//zombies.push(new ragdoll());
//zombies[0].spawn(300,285);
//zombies[0].spawn(body.parts[0].pos.x+250,285+random(-50,50));

//body.createAnt(200,200);
//body.createJoint(200,200);

var normF = function(point, hang) {
	
   var xlen = hang.pos.x-point.pos.x;
    var ylen = hang.pos.y-point.pos.y;
    var angle = atan2(xlen,ylen);
    //println(angle/PI*180);
    
    
    var angleV = atan2(point.velo.x,point.velo.y);
    //tension from web
    var normal = mag(point.velo.x,point.velo.y)*cos(angle-angleV);
    var normalV = new PVector(normal*sin(angle),normal*cos(angle));
    
    
	return normalV;
};


linkedparts.prototype.flail = function(){
    var norm12;
    var norm21;
    var norm23;
    var norm32;
    var normdiff = new PVector(0,0);
    
     var xlen;
    var ylen;
    var angle;
    var len;
    
    this.parts[0].posP.x = this.parts[0].pos.x;
    this.parts[0].posP.y = this.parts[0].pos.y;
    this.parts[1].posP.x = this.parts[1].pos.x;
    this.parts[1].posP.y = this.parts[1].pos.y;
    for(var i = 0; i < this.parts.length-2; i++){
        this.parts[i+2].posP.x = this.parts[i+2].pos.x;
    this.parts[i+2].posP.y = this.parts[i+2].pos.y;
        
        norm12 = normF(this.parts[i],this.parts[i+1]);
        norm21 = normF(this.parts[i+1],this.parts[i]);
        
        norm23 = normF(this.parts[i+1],this.parts[i+2]);
        norm32 = normF(this.parts[i+2],this.parts[i+1]);
        
        
         this.parts[i+1].velo.x =  this.parts[i+1].velo.x-norm21.x-norm23.x+(norm12.x+norm21.x)/2+(norm23.x+norm32.x)/2;
         this.parts[i+1].velo.y = this.parts[i+1].velo.y-norm21.y-norm23.y+(norm12.y+norm21.y)/2+(norm23.y+norm32.y)/2;
         
         norm12 = normF(this.parts[i],this.parts[i+1]);
        norm21 = normF(this.parts[i+1],this.parts[i]);
        
        norm23 = normF(this.parts[i+1],this.parts[i+2]);
        norm32 = normF(this.parts[i+2],this.parts[i+1]);
         
         
         
         this.parts[i].velo.x =  this.parts[i].velo.x-norm12.x+norm21.x;
         this.parts[i].velo.y =  this.parts[i].velo.y-norm12.y+norm21.y;
         
         this.parts[i+2].velo.x =  this.parts[i+2].velo.x-norm32.x+norm23.x;
         this.parts[i+2].velo.y =  this.parts[i+2].velo.y-norm32.y+norm23.y;
         
         
         xlen = this.parts[i].pos.x - this.parts[i+1].pos.x;
        ylen = this.parts[i].pos.y - this.parts[i+1].pos.y;
        angle= atan2(xlen,ylen);
        len = mag(xlen,ylen);
        //len = 30;
         
         
         
         this.parts[i].pos.x = this.parts[i].pos.x + this.parts[i].velo.x;
    this.parts[i].pos.y = this.parts[i].pos.y + this.parts[i].velo.y;
    
         this.parts[i+1].pos.x = this.parts[i+1].pos.x + this.parts[i+1].velo.x;
   this.parts[i+1].pos.y = this.parts[i+1].pos.y + this.parts[i+1].velo.y;
   
   xlen = this.parts[i].pos.x - this.parts[i+1].pos.x;
        ylen = this.parts[i].pos.y - this.parts[i+1].pos.y;
        angle= atan2(xlen,ylen);
        
        this.parts[i+1].pos.x = this.parts[i].pos.x-this.len[i]*sin(angle);
    this.parts[i+1].pos.y = this.parts[i].pos.y-this.len[i]*cos(angle);
   
   
   this.parts[i+2].pos.x = this.parts[i+2].pos.x + this.parts[i+2].velo.x;
   this.parts[i+2].pos.y = this.parts[i+2].pos.y + this.parts[i+2].velo.y;
        
        xlen = this.parts[i+1].pos.x - this.parts[i+2].pos.x;
        ylen = this.parts[i+1].pos.y - this.parts[i+2].pos.y;
        angle= atan2(xlen,ylen);
        //len = 30;
        //len = this.parts[i+2].len;
        
        this.parts[i+2].pos.x = this.parts[i+1].pos.x-this.len[i+1]*sin(angle);
    this.parts[i+2].pos.y = this.parts[i+1].pos.y-this.len[i+1]*cos(angle);
        
        
    }
    for(var i = 0; i < this.parts.length; i++){
        
         this.parts[i].velo.y = this.parts[i].accel.y + this.parts[i].velo.y;
	        this.parts[i].velo.x = this.parts[i].accel.x + this.parts[i].velo.x;
     }
    
};

linkedparts.prototype.speedup = function(){
  for(var i = 0; i < this.parts.length-1; i++){
   this.parts[i].velo.x = Math.round(this.parts[i].velo.x*1000)/1000;
   this.parts[i].velo.y = Math.round(this.parts[i].velo.y*1000)/1000; 
   this.parts[i].pos.x = Math.round(this.parts[i].pos.x*1000)/1000;
   this.parts[i].pos.y = Math.round(this.parts[i].pos.y*1000)/1000; 
  }
};


linkedparts.prototype.drawConnectsDef = function(){
    strokeWeight(10);
    for(var i = 0; i < this.parts.length-1; i++){
        
        line(this.parts[i].pos.x, this.parts[i].pos.y, this.parts[i+1].pos.x, this.parts[i+1].pos.y);
    }
};

ragdoll.prototype.move = function(){
    if(keys[3])//shift
    {
       this.pos.x-=1; 
    }
    if(keys[4])//shift
    {
       this.pos.x+=1; 
    }
    
    this.torso.flail();
    this.armL.flail();
    this.armR.flail();
    this.legL.flail();
    this.legR.flail();
    
    this.torso.speedup();
    this.armL.speedup();
    this.armR.speedup();
    this.legL.speedup();
    this.legR.speedup();
    
    //println(mouseX+" "+mouseY+" "+this.armR.parts[2].pos);
    
	//println(torso.length);
//	println(mag(torso[0].pos.x-torso[1].pos.x,torso[0].pos.y-torso[1].pos.y));
/*
if(game.instructShow){
   
   
    torso.parts[0].velo.x = 200 - torso.parts[0].pos.x;
    torso.parts[0].velo.y = -95 - torso.parts[0].pos.y;
    
}
else if(game.entered){
    torso.parts[0].velo.x = mouseX - torso.parts[0].pos.x;
    torso.parts[0].velo.y = mouseY - torso.parts[0].pos.y;
}
else{
    torso.parts[0].velo.x = 200 - torso.parts[0].pos.x;
    torso.parts[0].velo.y = 200 - torso.parts[0].pos.y;
    
}
    */
    //this.torso.parts[0].velo.x = mouseX - this.torso.parts[0].pos.x;
    //this.torso.parts[0].velo.y = mouseY - this.torso.parts[0].pos.y;
    
    this.torso.parts[0].velo.x = this.pos.x - this.torso.parts[0].pos.x;
    this.torso.parts[0].velo.y = this.pos.y - this.torso.parts[0].pos.y;
    
    if(this.hp>0){
    if(this.pos.y!==285){
     this.velo.y +=  (285-this.pos.y)/250;
        
        if(abs(this.velo.y)>abs(285-this.pos.y)){
            this.velo.y =  (285-this.pos.y);
        }
    }
    }
    else{
        if(this.pos.y<410){
     this.velo.y +=  (410-this.pos.y)/2500;
        
        if(this.torso.parts[0].pos.y>=410){
         game.score+=1;
         this.active=false;
        }
    }
        
    }
    this.velo.x = (body.parts[0].pos.x-this.pos.x)/(2*abs(body.parts[0].pos.x-this.pos.x));
    
    this.pos.x+=this.velo.x;
    this.pos.y+=this.velo.y;
    
    
    this.armL.parts[0].velo.x = this.torso.parts[1].pos.x  - this.armL.parts[0].pos.x;
    this.armL.parts[0].velo.y = this.torso.parts[1].pos.y - this.armL.parts[0].pos.y;
    
    this.armR.parts[0].velo.x = this.torso.parts[1].pos.x  - this.armR.parts[0].pos.x;
    this.armR.parts[0].velo.y = this.torso.parts[1].pos.y - this.armR.parts[0].pos.y;
    
    this.legL.parts[0].velo.x = this.torso.parts[2].pos.x  - this.legL.parts[0].pos.x;
    this.legL.parts[0].velo.y = this.torso.parts[2].pos.y - this.legL.parts[0].pos.y;
    
    this.legR.parts[0].velo.x = this.torso.parts[2].pos.x  - this.legR.parts[0].pos.x;
    this.legR.parts[0].velo.y = this.torso.parts[2].pos.y - this.legR.parts[0].pos.y;
    
    
    
 
};

ragdoll.prototype.draw = function(){
    
    stroke(255, 255, 255);
    this.torso.drawConnectsDef();
    stroke(255, 0, 255);
    this.armL.drawConnectsDef();
    stroke(0, 255, 30);
    this.armR.drawConnectsDef();
    stroke(38, 33, 196);
    this.legL.drawConnectsDef();
    stroke(255, 234, 0);
    this.legR.drawConnectsDef();
    
    stroke(16, 145, 40);
    strokeWeight(17);
    point(this.torso.parts[0].pos.x,this.torso.parts[0].pos.y);
    
    textSize(12);
    fill(255, 0, 0);
    text(this.hp,this.pos.x-10,this.pos.y-15);
    
};

var normEdit = function(pos1x,pos1y,velo1x, velo1y,pos2x,pos2y){
    
    var xlen = pos2x-pos1x;
    var ylen = pos2y-pos1y;
    var angle = atan2(xlen,ylen);
    //println(angle/PI*180);
    
    
    var angleV = atan2(velo1x,velo1y);
    //tension from web
    var normal = mag(velo1x,velo1y)*cos(angle-angleV);
    var normalV = new PVector(normal*sin(angle)/4,normal*cos(angle)/4);
    
    //println(normalV);
	return normalV;
    
};

var checkContact = function(player,ragdoll){
    
     //var fistnfeet = [6,7,8,9,12,13,14,15];
    var ind = 0;
	var fat = 12;
	var ind = 0;
	
	var bPos = new PVector(0,0);
	var bPosP = new PVector(0,0);
	var bVelo = new PVector(0,0);
	var bContact = new PVector(0,0);
	var bContactP = new PVector(0,0);
	var normBZ = new PVector(0,0);
	var bodyslope = 0;
	var bVeloDestri1 = 0;
	var bVeloDestri2 = 0;
	
	var zPos = new PVector(0,0);
	var zPosP = new PVector(0,0);
	var zVelo = new PVector(0,0);
	var zContact = new PVector(0,0);
	var zContactP = new PVector(0,0);
	var normZB = new PVector(0,0);
	var zombslope = 0;
	var zVeloDestri1 = 0;
	var zVeloDestri2 = 0;
	
	var intercept = 0;
	var damDist = 0;
	var damAng = 0;
	
	
    //if distance is close enough between body and zombie 
    for(var z = 0; z < zombies.length; z++){
        if(zombies[z].active && zombies[z].hp>0){
       if(mag(zombies[z].torso.parts[1].pos.x-body.parts[1].pos.x,zombies[z].torso.parts[0].pos.y-body.parts[1].pos.y)<180){
        
        //player hits zombie check
    for(var i = 0; i < body.parts.length; i++){
        ind = i;
		bPos.x = body.parts[ind].pos.x;
		bPos.y = body.parts[ind].pos.y;
		bPosP.x = body.parts[ind].posP.x;
		bPosP.y = body.parts[ind].posP.y;
		bVelo.x = bPos.x-bPosP.x;
		bVelo.y = bPos.y-bPosP.y;
		
		if(bVelo.x!==0 || bVelo.y!==0){
		//Right Arm
		for(var j = 0; j < zombies[z].armR.parts.length-1; j++){
		zPos.x = zombies[z].armR.parts[j+1].pos.x;
		zPos.y = zombies[z].armR.parts[j+1].pos.y;
		zPosP.x = zombies[z].armR.parts[j].pos.x;
		zPosP.y = zombies[z].armR.parts[j].pos.y;

		if(mag(bPos.x-zPosP.x,bPos.x-zPosP.x)<zombies[z].armR.len[j]){
		
		if(bVelo.x===0){
			bodyslope=1000*bVelo.y/abs(bVelo.y);
		}
		else{
			bodyslope = (bVelo.y)/(bVelo.x);
		}
		if(zPos.x-zPosP.x===0){
			zombslope=1000*(zPos.y-zPosP.y)/abs(zPos.y-zPosP.y);
		}
        else{
        zombslope = (zPos.y-zPosP.y)/(zPos.x-zPosP.x);
        }
		
        if((bodyslope-zombslope)!==0){
			
		
		
         intercept=((bPosP.x-zPosP.x)*zombslope+zPosP.y-bPosP.y)/(bodyslope-zombslope);
        
		 zContact.x = bPosP.x+intercept;
		
		zContact.y = bPosP.y+intercept*bodyslope;
		
        if(mag(bPos.x-zContact.x,bPos.y-zContact.y)<=fat){//||(abs(intercept)<=abs(bPos.x-bPosP.x)+10&&abs(intercept*bodyslope)<=abs(bPos.y-bPosP.y)+10)){
            //contact

		if(abs(intercept)>=abs(bPos.x-bPosP.x)){
        bContact.x = bPosP.x;
		bContact.y = bPosP.y;
		}
		else{
			bContact.x = zContact.x-(bVelo.x);
			bContact.y = zContact.y-(bVelo.y);
		}
		
		 damDist = mag(zContact.x-zPosP.x,zContact.y-zPosP.y);
		 damAng = atan2(zombies[z].armR.parts[j+1].posP.x-zombies[z].armR.parts[j].posP.x,zombies[z].armR.parts[j+1].posP.y-zombies[z].armR.parts[j].posP.y);
		 zContactP.x = zombies[z].armR.parts[j].posP.x+sin(damAng)*damDist;
		 zContactP.y = zombies[z].armR.parts[j].posP.y+cos(damAng)*damDist;
		
		 zVelo.x = zContact.x-zContactP.x;
		 zVelo.y = zContact.y-zContactP.y;
		
        //norm for the points
         normBZ = normEdit(bContact.x,bContact.y,bVelo.x,bVelo.y,zContact.x,zContact.y);
         normZB = normEdit(zContact.x,zContact.y,zVelo.x,zVelo.y,bContact.x,bContact.y);
        //distribute the velocities;
		
		bVeloDestri1 = (body.parts[ind].mass-(zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2)/(body.parts[ind].mass+(zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2);
		bVeloDestri2 = (zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/(body.parts[ind].mass+(zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2);
		
		zVeloDestri1 = ((zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2-body.parts[ind].mass)/(body.parts[ind].mass+(zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2);
		zVeloDestri2 = (body.parts[ind].mass*2)/(body.parts[ind].mass+(zombies[z].armR.parts[j].mass+zombies[z].armR.parts[j+1].mass)/2);
		
		var bVelodiffx = -normBZ.x + normBZ.x*bVeloDestri1 +normZB.x*bVeloDestri2;
		var bVelodiffy = -normBZ.y + normBZ.y*bVeloDestri1 +normZB.y*bVeloDestri2;
		
		var zVelodiffx = -normZB.x + normZB.x*zVeloDestri1 + normBZ.x*zVeloDestri2;
		var zVelodiffy = -normZB.y + normZB.y*zVeloDestri1 + normBZ.y*zVeloDestri2;
		
        body.parts[ind].velo.x = body.parts[ind].velo.x + bVelodiffx;
		body.parts[ind].velo.y = body.parts[ind].velo.y + bVelodiffy;
		
		zombies[z].armR.parts[j].velo.x = zombies[z].armR.parts[j].velo.x + zVelodiffx;
		zombies[z].armR.parts[j].velo.y = zombies[z].armR.parts[j].velo.y + zVelodiffy;
		zombies[z].armR.parts[j+1].velo.x = zombies[z].armR.parts[j+1].velo.x - normZB.x + zVelodiffx;
		zombies[z].armR.parts[j+1].velo.y = zombies[z].armR.parts[j+1].velo.y - normZB.y + zVelodiffy;
		
		zombies[z].velo.x=zVelodiffx/1.5;
		zombies[z].velo.y=zVelodiffy/1.5;
		
		
		zombies[z].hp-=mag(zVelodiffx,zVelodiffy)*(zombies[z].armR.parts[j].damMod+zombies[z].armR.parts[j+1].damMod)/2;
		
		body.hp-=mag(bVelodiffx,bVelodiffy)*(body.parts[ind].damMod);
		
		return;
		}
		}
		}
		}
		//Left Arm
		for(var j = 0; j < zombies[z].armL.parts.length-1; j++){
		zPos.x = zombies[z].armL.parts[j+1].pos.x;
		zPos.y = zombies[z].armL.parts[j+1].pos.y;
		zPosP.x = zombies[z].armL.parts[j].pos.x;
		zPosP.y = zombies[z].armL.parts[j].pos.y;
		
		if(mag(bPos.x-zPosP.x,bPos.x-zPosP.x)<zombies[z].armL.len[j]){
			
		if(bVelo.x===0){
			bodyslope=1000*bVelo.y/abs(bVelo.y);
		}
		else{
			bodyslope = (bVelo.y)/(bVelo.x);
		}
		if(zPos.x-zPosP.x===0){
			zombslope=1000*(zPos.y-zPosP.y)/abs(zPos.y-zPosP.y);
		}
        else{
        zombslope = (zPos.y-zPosP.y)/(zPos.x-zPosP.x);
        }
		
        if((bodyslope-zombslope)!==0){
			
		
		
        
         intercept=((bPosP.x-zPosP.x)*zombslope+zPosP.y-bPosP.y)/(bodyslope-zombslope);
        
		 zContact.x = bPosP.x+intercept;
		
		zContact.y = bPosP.y+intercept*bodyslope;
		
        if(mag(bPos.x-zContact.x,bPos.y-zContact.y)<=fat){//||(abs(intercept)<=abs(bPos.x-bPosP.x)+10&&abs(intercept*bodyslope)<=abs(bPos.y-bPosP.y)+10)){
            //contact
		
		if(abs(intercept)>=abs(bPos.x-bPosP.x)){
        bContact.x = bPosP.x;
		bContact.y = bPosP.y;
		}
		else{
			bContact.x = zContact.x-(bVelo.x);
			bContact.y = zContact.y-(bVelo.y);
		}
		
		 damDist = mag(zContact.x-zPosP.x,zContact.y-zPosP.y);
		 damAng = atan2(zombies[z].armL.parts[j+1].posP.x-zombies[z].armL.parts[j].posP.x,zombies[z].armL.parts[j+1].posP.y-zombies[z].armL.parts[j].posP.y);
		 zContactP.x = zombies[z].armL.parts[j].posP.x+sin(damAng)*damDist;
		 zContactP.y = zombies[z].armL.parts[j].posP.y+cos(damAng)*damDist;
		
		 zVelo.x = zContact.x-zContactP.x;
		 zVelo.y = zContact.y-zContactP.y;
		
        //norm for the points
         normBZ = normEdit(bContact.x,bContact.y,bVelo.x,bVelo.y,zContact.x,zContact.y);
         normZB = normEdit(zContact.x,zContact.y,zVelo.x,zVelo.y,bContact.x,bContact.y);
        //distribute the velocities;
        
		bVeloDestri1 = (body.parts[ind].mass-(zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2)/(body.parts[ind].mass+(zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2);
		bVeloDestri2 = (zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/(body.parts[ind].mass+(zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2);
		
		zVeloDestri1 = ((zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2-body.parts[ind].mass)/(body.parts[ind].mass+(zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2);
		zVeloDestri2 = (body.parts[ind].mass*2)/(body.parts[ind].mass+(zombies[z].armL.parts[j].mass+zombies[z].armL.parts[j+1].mass)/2);
		
		var bVelodiffx = -normBZ.x + normBZ.x*bVeloDestri1 +normZB.x*bVeloDestri2;
		var bVelodiffy = -normBZ.y + normBZ.y*bVeloDestri1 +normZB.y*bVeloDestri2;
		
		var zVelodiffx = -normZB.x + normZB.x*zVeloDestri1 + normBZ.x*zVeloDestri2;
		var zVelodiffy = -normZB.y + normZB.y*zVeloDestri1 + normBZ.y*zVeloDestri2;
		
        body.parts[ind].velo.x = body.parts[ind].velo.x + bVelodiffx;
		body.parts[ind].velo.y = body.parts[ind].velo.y + bVelodiffy;
		
		zombies[z].armL.parts[j].velo.x = zombies[z].armL.parts[j].velo.x + zVelodiffx;
		zombies[z].armL.parts[j].velo.y = zombies[z].armL.parts[j].velo.y + zVelodiffy;
		zombies[z].armL.parts[j+1].velo.x = zombies[z].armL.parts[j+1].velo.x - normZB.x + zVelodiffx;
		zombies[z].armL.parts[j+1].velo.y = zombies[z].armL.parts[j+1].velo.y - normZB.y + zVelodiffy;
		
		zombies[z].velo.x=zVelodiffx/1.5;
		zombies[z].velo.y=zVelodiffy/1.5;
		
		zombies[z].hp-=mag(zVelodiffx,zVelodiffy)*(zombies[z].armL.parts[j].damMod+zombies[z].armL.parts[j+1].damMod)/2;
		
		body.hp-=mag(bVelodiffx,bVelodiffy)*(body.parts[ind].damMod);
		
		return;
	}
		}
		}
		}
		//Left Leg
        for(var j = 0; j < zombies[z].legL.parts.length-1; j++){
		zPos.x = zombies[z].legL.parts[j+1].pos.x;
		zPos.y = zombies[z].legL.parts[j+1].pos.y;
		zPosP.x = zombies[z].legL.parts[j].pos.x;
		zPosP.y = zombies[z].legL.parts[j].pos.y;
		
		if(mag(bPos.x-zPosP.x,bPos.x-zPosP.x)<zombies[z].legL.len[j]){
			
        if(bVelo.x===0){
			bodyslope=1000*bVelo.y/abs(bVelo.y);
		}
		else{
			bodyslope = (bVelo.y)/(bVelo.x);
		}
		if(zPos.x-zPosP.x===0){
			zombslope=1000*(zPos.y-zPosP.y)/abs(zPos.y-zPosP.y);
		}
        else{
        zombslope = (zPos.y-zPosP.y)/(zPos.x-zPosP.x);
        }
		
        if((bodyslope-zombslope)!==0){
			
		
		
         intercept=((bPosP.x-zPosP.x)*zombslope+zPosP.y-bPosP.y)/(bodyslope-zombslope);
        
		 zContact.x = bPosP.x+intercept;
		
		zContact.y = bPosP.y+intercept*bodyslope;
		
        if(mag(bPos.x-zContact.x,bPos.y-zContact.y)<=fat){//||(abs(intercept)<=abs(bPos.x-bPosP.x)+10&&abs(intercept*bodyslope)<=abs(bPos.y-bPosP.y)+10)){
            //contact

		if(abs(intercept)>=abs(bPos.x-bPosP.x)){
        bContact.x = bPosP.x;
		bContact.y = bPosP.y;
		}
		else{
			bContact.x = zContact.x-(bVelo.x);
			bContact.y = zContact.y-(bVelo.y);
		}
		
		 damDist = mag(zContact.x-zPosP.x,zContact.y-zPosP.y);
		 damAng = atan2(zombies[z].legL.parts[j+1].posP.x-zombies[z].legL.parts[j].posP.x,zombies[z].legL.parts[j+1].posP.y-zombies[z].legL.parts[j].posP.y);
		 zContactP.x = zombies[z].legL.parts[j].posP.x+sin(damAng)*damDist;
		 zContactP.y = zombies[z].legL.parts[j].posP.y+cos(damAng)*damDist;
		
		 zVelo.x = zContact.x-zContactP.x;
		 zVelo.y = zContact.y-zContactP.y;
		
        //norm for the points
         normBZ = normEdit(bContact.x,bContact.y,bVelo.x,bVelo.y,zContact.x,zContact.y);
         normZB = normEdit(zContact.x,zContact.y,zVelo.x,zVelo.y,bContact.x,bContact.y);
        //distribute the velocities;
        
		bVeloDestri1 = (body.parts[ind].mass-(zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2)/(body.parts[ind].mass+(zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2);
		bVeloDestri2 = (zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/(body.parts[ind].mass+(zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2);
		
		zVeloDestri1 = ((zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2-body.parts[ind].mass)/(body.parts[ind].mass+(zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2);
		zVeloDestri2 = (body.parts[ind].mass*2)/(body.parts[ind].mass+(zombies[z].legL.parts[j].mass+zombies[z].legL.parts[j+1].mass)/2);
		
		var bVelodiffx = -normBZ.x + normBZ.x*bVeloDestri1 +normZB.x*bVeloDestri2;
		var bVelodiffy = -normBZ.y + normBZ.y*bVeloDestri1 +normZB.y*bVeloDestri2;
		
		var zVelodiffx = -normZB.x + normZB.x*zVeloDestri1 + normBZ.x*zVeloDestri2;
		var zVelodiffy = -normZB.y + normZB.y*zVeloDestri1 + normBZ.y*zVeloDestri2;
		
        body.parts[ind].velo.x = body.parts[ind].velo.x + bVelodiffx;
		body.parts[ind].velo.y = body.parts[ind].velo.y + bVelodiffy;
		
		zombies[z].legL.parts[j].velo.x = zombies[z].legL.parts[j].velo.x + zVelodiffx;
		zombies[z].legL.parts[j].velo.y = zombies[z].legL.parts[j].velo.y + zVelodiffy;
		zombies[z].legL.parts[j+1].velo.x = zombies[z].legL.parts[j+1].velo.x - normZB.x + zVelodiffx;
		zombies[z].legL.parts[j+1].velo.y = zombies[z].legL.parts[j+1].velo.y - normZB.y + zVelodiffy;
		
		zombies[z].velo.x=zVelodiffx/1.5;
		zombies[z].velo.y=zVelodiffy/1.5;
		
		zombies[z].hp-=mag(zVelodiffx,zVelodiffy)*(zombies[z].legL.parts[j].damMod+zombies[z].legL.parts[j+1].damMod)/2;
		
		
		body.hp-=mag(bVelodiffx,bVelodiffy)*(body.parts[ind].damMod);
		
		return;
	}
		}
		}
		}
		//Right Leg
		for(var j = 0; j < zombies[z].legR.parts.length-1; j++){
		zPos.x = zombies[z].legR.parts[j+1].pos.x;
		zPos.y = zombies[z].legR.parts[j+1].pos.y;
		zPosP.x = zombies[z].legR.parts[j].pos.x;
		zPosP.y = zombies[z].legR.parts[j].pos.y;
		
		if(mag(bPos.x-zPosP.x,bPos.x-zPosP.x)<zombies[z].legR.len[j]){
		
        if(bVelo.x===0){
			bodyslope=1000*bVelo.y/abs(bVelo.y);
		}
		else{
			bodyslope = (bVelo.y)/(bVelo.x);
		}
		if(zPos.x-zPosP.x===0){
			zombslope=1000*(zPos.y-zPosP.y)/abs(zPos.y-zPosP.y);
		}
        else{
        zombslope = (zPos.y-zPosP.y)/(zPos.x-zPosP.x);
        }
		
        if((bodyslope-zombslope)!==0){
			
		
		
         intercept=((bPosP.x-zPosP.x)*zombslope+zPosP.y-bPosP.y)/(bodyslope-zombslope);
        
		 zContact.x = bPosP.x+intercept;
		
		zContact.y = bPosP.y+intercept*bodyslope;
		
        if(mag(bPos.x-zContact.x,bPos.y-zContact.y)<=fat){//||(abs(intercept)<=abs(bPos.x-bPosP.x)+10&&abs(intercept*bodyslope)<=abs(bPos.y-bPosP.y)+10)){
            //contact

		if(abs(intercept)>=abs(bPos.x-bPosP.x)){
        bContact.x = bPosP.x;
		bContact.y = bPosP.y;
		}
		else{
			bContact.x = zContact.x-(bVelo.x);
			bContact.y = zContact.y-(bVelo.y);
		}
		
		 damDist = mag(zContact.x-zPosP.x,zContact.y-zPosP.y);
		 damAng = atan2(zombies[z].legR.parts[j+1].posP.x-zombies[z].legR.parts[j].posP.x,zombies[z].legR.parts[j+1].posP.y-zombies[z].legR.parts[j].posP.y);
		 zContactP.x = zombies[z].legR.parts[j].posP.x+sin(damAng)*damDist;
		 zContactP.y = zombies[z].legR.parts[j].posP.y+cos(damAng)*damDist;
		
		 zVelo.x = zContact.x-zContactP.x;
		 zVelo.y = zContact.y-zContactP.y;
		
        //norm for the points
         normBZ = normEdit(bContact.x,bContact.y,bVelo.x,bVelo.y,zContact.x,zContact.y);
         normZB = normEdit(zContact.x,zContact.y,zVelo.x,zVelo.y,bContact.x,bContact.y);
        //distribute the velocities;
        bVeloDestri1 = (body.parts[ind].mass-(zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2)/(body.parts[ind].mass+(zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2);
		bVeloDestri2 = (zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/(body.parts[ind].mass+(zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2);
		
		zVeloDestri1 = ((zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2-body.parts[ind].mass)/(body.parts[ind].mass+(zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2);
		zVeloDestri2 = (body.parts[ind].mass*2)/(body.parts[ind].mass+(zombies[z].legR.parts[j].mass+zombies[z].legR.parts[j+1].mass)/2);
		
		var bVelodiffx = -normBZ.x + normBZ.x*bVeloDestri1 +normZB.x*bVeloDestri2;
		var bVelodiffy = -normBZ.y + normBZ.y*bVeloDestri1 +normZB.y*bVeloDestri2;
		
		var zVelodiffx = -normZB.x + normZB.x*zVeloDestri1 + normBZ.x*zVeloDestri2;
		var zVelodiffy = -normZB.y + normZB.y*zVeloDestri1 + normBZ.y*zVeloDestri2;
		
        body.parts[ind].velo.x = body.parts[ind].velo.x + bVelodiffx;
		body.parts[ind].velo.y = body.parts[ind].velo.y + bVelodiffy;
		
		zombies[z].legR.parts[j].velo.x = zombies[z].legR.parts[j].velo.x + zVelodiffx;
		zombies[z].legR.parts[j].velo.y = zombies[z].legR.parts[j].velo.y + zVelodiffy;
		zombies[z].legR.parts[j+1].velo.x = zombies[z].legR.parts[j+1].velo.x - normZB.x + zVelodiffx;
		zombies[z].legR.parts[j+1].velo.y = zombies[z].legR.parts[j+1].velo.y - normZB.y + zVelodiffy;
		
		zombies[z].velo.x=zVelodiffx/1.5;
		zombies[z].velo.y=zVelodiffy/1.5;
		
		zombies[z].hp-=mag(zVelodiffx,zVelodiffy)*(zombies[z].legR.parts[j].damMod+zombies[z].legR.parts[j+1].damMod)/2;
		
		body.hp-=mag(bVelodiffx,bVelodiffy)*(body.parts[ind].damMod);
		
		return;
	}
	
		}
		}
		}
		//torso.parts
		for(var j = 0; j < zombies[z].torso.parts.length-1; j++){
		zPos.x = zombies[z].torso.parts[j+1].pos.x;
		zPos.y = zombies[z].torso.parts[j+1].pos.y;
		zPosP.x = zombies[z].torso.parts[j].pos.x;
		zPosP.y = zombies[z].torso.parts[j].pos.y;
		
		if(mag(bPos.x-zPosP.x,bPos.x-zPosP.x)<zombies[z].torso.len[j]){
			
		if(bVelo.x===0){
			bodyslope=1000*bVelo.y/abs(bVelo.y);
		}
		else{
			bodyslope = (bVelo.y)/(bVelo.x);
		}
		if(zPos.x-zPosP.x===0){
			zombslope=1000*(zPos.y-zPosP.y)/abs(zPos.y-zPosP.y);
		}
        else{
        zombslope = (zPos.y-zPosP.y)/(zPos.x-zPosP.x);
        }
		
        if((bodyslope-zombslope)!==0){
			
		
		
        
        
         intercept=((bPosP.x-zPosP.x)*zombslope+zPosP.y-bPosP.y)/(bodyslope-zombslope);
        
		 zContact.x = bPosP.x+intercept;
		
		zContact.y = bPosP.y+intercept*bodyslope;
		
        if(mag(bPos.x-zContact.x,bPos.y-zContact.y)<=fat){//||(abs(intercept)<=abs(bPos.x-bPosP.x)+10&&abs(intercept*bodyslope)<=abs(bPos.y-bPosP.y)+10)){
            //contact

		if(abs(intercept)>=abs(bPos.x-bPosP.x)){
        bContact.x = bPosP.x;
		bContact.y = bPosP.y;
		}
		else{
			bContact.x = zContact.x-(bVelo.x);
			bContact.y = zContact.y-(bVelo.y);
		}
		
		 damDist = mag(zContact.x-zPosP.x,zContact.y-zPosP.y);
		 damAng = atan2(zombies[z].torso.parts[j+1].posP.x-zombies[z].torso.parts[j].posP.x,zombies[z].torso.parts[j+1].posP.y-zombies[z].torso.parts[j].posP.y);
		 zContactP.x = zombies[z].torso.parts[j].posP.x+sin(damAng)*damDist;
		 zContactP.y = zombies[z].torso.parts[j].posP.y+cos(damAng)*damDist;
		
		 zVelo.x = zContact.x-zContactP.x;
		 zVelo.y = zContact.y-zContactP.y;
		
        //norm for the points
         normBZ = normEdit(bContact.x,bContact.y,bVelo.x,bVelo.y,zContact.x,zContact.y);
         normZB = normEdit(zContact.x,zContact.y,zVelo.x,zVelo.y,bContact.x,bContact.y);
        //distribute the velocities;
        bVeloDestri1 = (body.parts[ind].mass-(zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2)/(body.parts[ind].mass+(zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2);
		bVeloDestri2 = (zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/(body.parts[ind].mass+(zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2);
		
		zVeloDestri1 = ((zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2-body.parts[ind].mass)/(body.parts[ind].mass+(zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2);
		zVeloDestri2 = (body.parts[ind].mass*2)/(body.parts[ind].mass+(zombies[z].torso.parts[j].mass+zombies[z].torso.parts[j+1].mass)/2);
		
		var bVelodiffx = -normBZ.x + normBZ.x*bVeloDestri1 +normZB.x*bVeloDestri2;
		var bVelodiffy = -normBZ.y + normBZ.y*bVeloDestri1 +normZB.y*bVeloDestri2;
		
		var zVelodiffx = -normZB.x + normZB.x*zVeloDestri1 + normBZ.x*zVeloDestri2;
		var zVelodiffy = -normZB.y + normZB.y*zVeloDestri1 + normBZ.y*zVeloDestri2;
		
        body.parts[ind].velo.x = body.parts[ind].velo.x + bVelodiffx;
		body.parts[ind].velo.y = body.parts[ind].velo.y + bVelodiffy;
		
		zombies[z].torso.parts[j].velo.x = zombies[z].torso.parts[j].velo.x + zVelodiffx;
		zombies[z].torso.parts[j].velo.y = zombies[z].torso.parts[j].velo.y + zVelodiffy;
		zombies[z].torso.parts[j+1].velo.x = zombies[z].torso.parts[j+1].velo.x - normZB.x + zVelodiffx;
		zombies[z].torso.parts[j+1].velo.y = zombies[z].torso.parts[j+1].velo.y - normZB.y + zVelodiffy;
		
		zombies[z].velo.x=zVelodiffx/1.5;
		zombies[z].velo.y=zVelodiffy/1.5;
		
		zombies[z].hp-=mag(zVelodiffx,zVelodiffy)*(zombies[z].torso.parts[j].damMod+zombies[z].torso.parts[j+1].damMod)/2;
		
		body.hp-=mag(bVelodiffx,bVelodiffy)*(body.parts[ind].damMod);
		
		return;
	}
		}
		}
		}
		}
		}
		}
		}
    }
    
};

linkedparts.prototype.findCMass = function(){
    
    var massHold = 0;
    var posHold = new PVector(0,0);
    var veloHold = new PVector(0,0);
    
    for(var i = 0; i < this.parts.length; i++){
        massHold+=this.parts[i].mass;
        posHold.x+=this.parts[i].pos.x*this.parts[i].mass;
        posHold.y+=this.parts[i].pos.y*this.parts[i].mass;
        veloHold.x+=this.parts[i].velo.x*this.parts[i].mass;
        veloHold.y+=this.parts[i].velo.y*this.parts[i].mass;
    }
    
    var partCen = new part(posHold.x/massHold,posHold.y/massHold,massHold,180,-180,1,0);
    partCen.velo.x = veloHold.x/massHold;
    partCen.velo.y = veloHold.y/massHold;

    
    return partCen;
};

linkedparts.prototype.bendChain = function(bendnum, from, search, ang){
    
    
    var bend = this.parts[bendnum];
    
    
    var lift = this.parts[search];
         
          
         
    for(var i = 0; i < lift.attached.length;i++){
     if(lift.attached[i]!==from){
         this.bendChain(bendnum,search,lift.attached[i],ang);

     }
    }
    
    var angC = atan2(lift.pos.x-bend.pos.x,lift.pos.y-bend.pos.y);

         var mags = Math.round(mag((lift.pos.x-bend.pos.x),(lift.pos.y-bend.pos.y)));
         
         lift.pos.x = mags*sin(angC+ang)+bend.pos.x;
         
         lift.pos.y = mags*cos(angC+ang)+bend.pos.y;
    return;
};

linkedparts.prototype.move = function(){
    /*
    for(var i = 0; i < this.parts.length; i++){
        this.parts[i].velo.x+=this.parts[i].accel.x;
        this.parts[i].velo.y+=this.parts[i].accel.y;
        this.parts[i].pos.x+=this.parts[i].velo.x;
        this.parts[i].pos.y+=this.parts[i].velo.y;
    }
    */
    var partCenP = this.findCMass();
    var partCen = this.findCMass();
    //println(partCenP.velo.x+" "+partCenP.velo.y);
    var normCon;//contact
    var normCen;//center
    
    /*
    println(this.parts[i].pos.x+" "+this.parts[i].pos.y);
            var pointhold = new part(this.parts[i].pos.x,this.parts[i].pos.y,this.parts[i].mass,180,-180,1,0);
            pointhold.velo.x =this.parts[i].velo.x;
            pointhold.velo.y =this.parts[i].velo.y;
            this.pointhold.velo.x*=-0.1;//friction
            this.pointhold.velo.y = 400-this.pointhold.pos.y;
    */
    var storeP = [];
    var deepest=0;
    var deepesti=0;
    var deepcount = 0;
    
    var contactY;
            
    var contactAng;
            
    var contactX;
    
    for(var i = 0; i < this.parts.length;i++){
        if(this.parts[i].pos.y>375){
            /*
            var pointhold = new part(this.parts[i].pos.x,this.parts[i].pos.y,this.parts[i].mass,180,-180,1,0);
            
            
            pointhold.velo.x =this.parts[i].velo.x;
            pointhold.velo.y =this.parts[i].velo.y;
           */
            //this.parts[i].velo.x*=0.1;//friction
            ///*
            if(this.parts[i].pos.y>deepest){
               deepest= this.parts[i].pos.y;
               deepesti = i;
               deepcount++;
               
                contactY = 375-this.parts[i].pos.y;
            }
           // */
           /*
            if(this.parts[i].pos.y-this.parts[i].posP.y>0){
                if(mag(this.parts[i].pos.y-this.parts[i].posP.y,this.parts[i].pos.x-this.parts[i].posP.x)>deepest){
                    deepest= this.parts[i].pos.y;
               deepesti = i;
               deepcount++;
               contactY = 375-this.parts[i].pos.y;
                }
            }
            
           */
            
            
            
            this.parts[i].velo.y = (375-this.parts[i].pos.y)*0.9;
            
            
             
             storeP.push(i);
             
        }
    }
    if(this.hp>0){
    if(deepcount>0){
        if(this.parts[deepesti].pos.y-this.parts[deepesti].posP.y>0){
 
        
        contactAng=atan2(this.parts[deepesti].pos.x-this.parts[deepesti].posP.x,this.parts[deepesti].pos.y-this.parts[deepesti].posP.y);
    
    
    contactX = contactAng*contactY;
    this.parts[deepesti].velo.x = contactX;
    
    }
    }
    
    /*
    if(mouseIsPressed){
       
      this.parts[0].velo.x = mouseX-game.trans.x-this.parts[0].pos.x;
        this.parts[0].velo.y = mouseY-game.trans.y-this.parts[0].pos.y;
         //partCen.velo.x = mouseX-game.trans.x-partCen.pos.x;
       //partCen.velo.y = mouseY-game.trans.y-partCen.pos.y;
       
        
    }
    */

    var istuck = false;
    var jstuck = false;
    if(true){//ragdoll
         
       
       // for(var i = 0; i < this.parts.length;i++){
         for(var i = this.parts.length-1; i > -1;i--){
             for(var j = 0; j < this.parts.length;j++){
                 //for(var j = this.parts.length-1; j > -1;j--){
             if(i!==j){
                 
                 normCon=normF(this.parts[j],this.parts[i]);//contact
            normCen=normF(this.parts[i],this.parts[j]);//center
                 
                 istuck=false;
                 jstuck=false;
                 for(var k = 0; k < storeP.length;k++){
                 if(i===deepesti){
                   
                   // istuck=true; 
                 }
                 if(j===deepesti){
                     
                 // jstuck=true;   
                 }
                 
                 }
                 
                 
                   if(istuck&&~jstuck){
                     this.parts[j].velo.x = this.parts[j].velo.x-normCon.x+(normCen.x);
            
                        //this.parts[j].velo.y = this.parts[j].velo.y-normCon.y+(normCen.y);
                    
                 }
                 if(jstuck&&~istuck){
                     this.parts[i].velo.x = this.parts[i].velo.x-normCen.x+(normCon.x);
            
           // this.parts[i].velo.y = this.parts[i].velo.y-normCen.y+(normCon.y);
                   
                 }
                 
                
                if(!(istuck||jstuck)){
        
                
            
            
            
            this.parts[j].velo.x = this.parts[j].velo.x-normCon.x+(normCon.x+normCen.x)/2;
            
           
            
            this.parts[i].velo.x = this.parts[i].velo.x-normCen.x+(normCon.x+normCen.x)/2;
            
           
                }
             this.parts[j].velo.y = this.parts[j].velo.y-normCon.y+(normCon.y+normCen.y)/2;
              this.parts[i].velo.y = this.parts[i].velo.y-normCen.y+(normCon.y+normCen.y)/2;
             }  
         }
         }
         if(deepcount>1){
         for(var i = 0; i < this.parts.length;i++){
             if(this.parts[i].pos.y<375){
                 
                 //this.parts[i].velo.x = 0;
             }
         }
         }

    }
}

};



linkedparts.prototype.bendCheck = function(locx,locy,basenum,bendnum,liftnum){
    
    var base = this.parts[basenum];
    var bend = this.parts[bendnum];
    var lift = this.parts[liftnum];
    
  
    //println("HERE!");
    var ang1 = atan2(lift.pos.x-bend.pos.x,lift.pos.y-bend.pos.y);
    var ang2 = atan2(locx-bend.pos.x,locy-bend.pos.y);
    var angC = atan2(base.pos.x-bend.pos.x,base.pos.y-bend.pos.y);
    //println(ang2);
    var angdiff = ang2-ang1;
    var anglim = angC-ang1;
    
    
    
    while(angdiff > PI){
        angdiff-=2*PI;
    }
    
    while(angdiff < -PI){
        angdiff+=2*PI;
    }
    
    while(anglim > PI){
        anglim-=2*PI;
    }
    
    while(anglim < -PI){
        anglim+=2*PI;
    }

    return angdiff;
    
};

linkedparts.prototype.bend = function(locx,locy,parti){
    var count = 0;
    var basenum;
    var bendnum;
    var liftnum;
    var ang;
     for(var i = 0; i < this.parts[parti].attached.length; i++){
         for(var j = 0; j < this.parts.length; j++){
             if(this.parts[parti].attached[i] === this.parts[j].id){
                 
                 bendnum=j;
                 
                 for(var k = 0; k < this.parts[j].attached.length; k++){
         for(var l = 0; l < this.parts.length; l++){
             
             if(this.parts[j].attached[k] !== parti && this.parts[j].attached[k] === this.parts[l].id){
                 
                 basenum=l;
                  ang = this.bendCheck(locx,locy,basenum,bendnum,parti);
                  
                //println(this.parts[basenum].name+" "+this.parts[bendnum].name);
                    this.bendChain(bendnum,bendnum,parti, ang);
                 return;
                 
             }
         }
         
            
    
         }
     }
         }
     }
    
     
};

linkedparts.prototype.autoCorrect = function(from, current){
    
    strokeWeight(2);
    var ang;
    
        for(var i = 0; i < this.parts[current].attached.length; i++){
            if(this.parts[current].attached[i]!==from){
            this.autoCorrect(current,this.parts[current].attached[i]);
            ang = atan2(this.parts[this.parts[current].attached[i]].pos.x-this.parts[current].pos.x,this.parts[this.parts[current].attached[i]].pos.y-this.parts[current].pos.y);
            
            this.parts[this.parts[current].attached[i]].pos.x = this.parts[current].len[i]*sin(ang)+this.parts[current].pos.x;
            
            this.parts[this.parts[current].attached[i]].pos.y = this.parts[current].len[i]*cos(ang)+this.parts[current].pos.y;
            }
           // println(i);
        }
        return;
};
            

linkedparts.prototype.drawConnectsCom = function(){
    strokeWeight(2);
    for(var i = 0; i < this.parts.length; i++){
        for(var j = 0; j < this.parts[i].attached.length; j++){
            
        stroke(255, 255, 255);
        strokeWeight(2);
            
        line(this.parts[i].pos.x, this.parts[i].pos.y, this.parts[this.parts[i].attached[j]].pos.x,  this.parts[this.parts[i].attached[j]].pos.y);
        if(i!==0){
        stroke(19, 240, 26);
        strokeWeight(4);
        point(this.parts[i].pos.x, this.parts[i].pos.y);
        }
    }
    }
};

linkedparts.prototype.drawConnects = function(){
    strokeWeight(15);
    for(var i = 0; i < this.parts.length; i++){
        for(var j = 0; j < this.parts[i].attached.length; j++){
        
        if(i > 9){   
        stroke(43, 41, 43);
        
        }
        else if(i > 8){
            stroke(43, 0, 255);
        }
        else if(i > 7){
            stroke(242, 255, 0);
        }
        else{   
        stroke(92, 92, 92);
        
        }
        line(this.parts[i].pos.x, this.parts[i].pos.y, this.parts[this.parts[i].attached[j]].pos.x,  this.parts[this.parts[i].attached[j]].pos.y);
        if(i!==0){
        //stroke(19, 240, 26);
       // strokeWeight(4);
        //point(this.parts[i].pos.x, this.parts[i].pos.y);
        }
    }
    }
};
/*
linkedparts.prototype.speedup = function(){
  for(var i = 0; i < this.parts.length; i++){
     this.parts[i].accel.x = Math.round(this.parts[i].accel.x*100)/100;
   this.parts[i].accel.y = Math.round(this.parts[i].accel.y*100)/100; 
   this.parts[i].velo.x = Math.round(this.parts[i].velo.x*100)/100;
   this.parts[i].velo.y = Math.round(this.parts[i].velo.y*100)/100; 
   this.parts[i].pos.x = Math.round(this.parts[i].pos.x*100)/100;
   this.parts[i].pos.y = Math.round(this.parts[i].pos.y*100)/100; 
  }
};
*/


part.prototype.inRange = function()
{
    
    if(abs(mouseX-game.trans.x-this.pos.x)< 5 && abs(mouseY-game.trans.y-this.pos.y)< 5){
        return true;
        
    }
    return false;
};
linkedparts.prototype.command = function(){
   // if(keys[2]){
    for(var i = 1; i < this.parts.length; i++){
        
        if(this.parts[i].inRange()&&!this.dragging){
        stroke(17, 28, 143);
        strokeWeight(15);
    point(body.parts[i].pos.x,body.parts[i].pos.y);
     
    if(keys[0]){
        
        this.active = i;
        this.dragging = true;
        
    }
    break;
   
        }
        }
    if(!keys[0]){
        this.dragging = false;
    }
    
    if(this.dragging){
        stroke(17, 143, 122);
        strokeWeight(15);
    point(body.parts[this.active].pos.x,body.parts[this.active].pos.y);
       this.bend(mouseX-game.trans.x,mouseY-game.trans.y,this.active);
       // body.autoCorrect(0,0);
    }
    
};

linkedparts.prototype.copy = function(original){
       
    for(var i = 0; i < original.parts.length;i++){
        this.parts[i].pos.x = original.parts[i].pos.x;
        this.parts[i].pos.y = original.parts[i].pos.y;
        this.parts[i].velo.x = original.parts[i].velo.x;
        this.parts[i].velo.y = original.parts[i].velo.y;
    }
        
};

linkedparts.prototype.travel = function(from,current){

    
    
     var bellyang = atan2(this.parts[0].pos.x-this.parts[2].pos.x,this.parts[0].pos.y-this.parts[2].pos.y);
     
     
     var dest = new PVector(0,0);
	 var past = new PVector(0,0);
        
        dest.x = mag(this.parts[current].setPos.x,this.parts[current].setPos.y)*sin(this.parts[current].setAng+bellyang)+this.parts[0].pos.x;
        dest.y = mag(this.parts[current].setPos.x,this.parts[current].setPos.y)*cos(this.parts[current].setAng+bellyang)+this.parts[0].pos.y;
        
        past.x=this.parts[current].pos.x;
		past.y=this.parts[current].pos.y;
		if(current!==0){
		if(mag(dest.x-past.x,dest.y-past.y)>1.5){
        this.bend(dest.x,dest.y,current);
		}
		for(var i = 0; i < this.parts[current].attached.length;i++){
     if(this.parts[current].attached[i]!==from){
		this.travel(current,this.parts[current].attached[i]);
        }
		}
		var curr = new PVector(0,0);
		/*
		if(abs(past.x-dest.x)>1){
		this.parts[current].veloIn.x+=0.03;
		}
		else{
		    this.parts[current].veloIn.x=0;
		}
		
		if(abs(past.y-dest.y)>1){
		this.parts[current].veloIn.y+=0.03;
		}
		else{
		    this.parts[current].veloIn.y=0;
		}
		
		
		curr.x=(past.x-dest.x)*(1-this.parts[current].veloIn.x)+dest.x;
		curr.y=(past.y-dest.y)*(1-this.parts[current].veloIn.y)+dest.y;
		*/
		///*
		curr.x=(dest.x-past.x)*(1/6)+past.x;
		curr.y=(dest.y-past.y)*(1/6)+past.y;
		//*/
		if(this.parts[current].turn){
		this.bend(curr.x,curr.y,current);
		}
		else{
		    //this.parts[current].pos.x += (this.parts[current].pos.x-past.x)/5;
            //this.parts[current].pos.y += (this.parts[current].pos.y-past.y)/5;
		    //this.parts[current].pos.x =curr.x;
		    //this.parts[current].pos.y =curr.y;
		}
        strokeWeight(20);
        stroke(255, 0, 255);
        //point(dest.x,dest.y);
		this.bend(curr.x,curr.y,current);
    
        strokeWeight(20);
        stroke(255, 0, 255);
        //point(dest.x,dest.y);
    }
    else{
       // this.parts[current].pos.x += (dest.x-this.parts[current].pos.x)/5;
       // this.parts[current].pos.y += (dest.y-this.parts[current].pos.y)/5;
        for(var i = 0; i < this.parts[current].attached.length;i++){
     if(this.parts[current].attached[i]!==from){
         
		this.travel(current,this.parts[current].attached[i]);
		
        }
		}
        
    }
    
 
    
};

linkedparts.prototype.backup = function(){
    
    for(var i = 0; i < this.parts.length;i++){
        this.parts[i].posP.x=this.parts[i].pos.x;
    this.parts[i].posP.y=this.parts[i].pos.y;
    }
    for(var i = 0; i < this.parts.length; i++){
        this.parts[i].velo.x+=this.parts[i].accel.x;
        this.parts[i].velo.y+=this.parts[i].accel.y;
        this.parts[i].pos.x+=this.parts[i].velo.x;
        this.parts[i].pos.y+=this.parts[i].velo.y;
    }
    
};

linkedparts.prototype.transfer = function(controller){
       
       var bellyang = atan2(controller.parts[0].pos.x-controller.parts[2].pos.x,controller.parts[0].pos.y-controller.parts[2].pos.y);
    for(var i = 0; i < controller.parts.length;i++){
        this.parts[i].setPos.x = controller.parts[i].pos.x-controller.parts[0].pos.x;
        this.parts[i].setPos.y = controller.parts[i].pos.y-controller.parts[0].pos.y;
        this.parts[i].setAng = atan2(controller.parts[i].pos.x-controller.parts[0].pos.x,controller.parts[i].pos.y-controller.parts[0].pos.y)-bellyang;
        //this.parts[i].pos.x = controller.parts[i].pos.x;
        //this.parts[i].pos.y = controller.parts[i].pos.y;
    }
        
};


linkedparts.prototype.drawCom = function(){
    
    stroke(255, 255, 255);
    this.drawConnectsCom();
    
    //stroke(16, 145, 40);
    stroke(0, 255, 47);
    strokeWeight(17);
    point(this.parts[3].pos.x,this.parts[3].pos.y);
    
};

linkedparts.prototype.draw = function(){
    
    stroke(255, 255, 255);
    this.drawConnects();
    
    stroke(0, 255, 47);
    strokeWeight(17);
    point(this.parts[3].pos.x,this.parts[3].pos.y);
    
    fill(255, 0, 0);
    textSize(12);
    text(this.hp,this.parts[3].pos.x-10,this.parts[3].pos.y-15);
    
};


var resetAll=function(){
    var keys = [false, false, true];
    var game = new uI();
    
    //var Sgame = new swingGame(200, 100);//game
    body.createHuman(200,200);
    controller.createHuman(200,200);
    
};

var nowbegin = false;

var mouseReleased = function() {
    keys[0] = false;
    if(game.entered){
      if(game.startB.inRange()){
     game.begin = true;   
        game.delay = frameCount+90;
    }  
    if(game.instB.inRange()){
     game.instructShow = true;   
        
    }
    
    else if(game.inst.inRange()){
     game.entered = false;
     
       game.instructShow = false;     
    }
    }
    else{
        game.entered = true;
        
    
    }
    
    if(false){//failstate 
     resetAll();  
     nowbegin = false;
    }
    
   
};

//game.entered = true;
var leftorright = [];
leftorright[0]=-1;
leftorright[1]=1;
var pastspace = keys[2];
var controller = new linkedparts();
controller.createHuman(100,100);
controller.copy(body);

//var Sgame = new swingGame(0,0);
var draw = function() {
    
    background(0, 0, 0);
    game.act();
    fill(99, 67, 207); 
    noStroke();
    rect(0,375,400,400);
    if(false||game.delay+250<frameCount && game.begin || nowbegin){
        nowbegin = true;
        background(65, 119, 138);
        fill(255, 255, 255);
        if(body.hp<=0){//got shot
            text("K.O\nRefresh to Try \n         Again", 40,100);
        }
        else{
            textSize(30);
            if(game.score===20){
               text("You Win!\n Refresh to Start Again", 50,100); 
            }
            else{
        text("SURVIVE!", 50,100);
            }
        textSize(20);
        text("Score:"+game.score, 300,30);//game.score
         
         if(game.lastheal>30&&body.hp<500){
             body.hp+=1;
             game.lastheal=0;
         }
         
        if(game.lastspawn>game.spawnrate && zombies.length<20){
            zombies.push(new ragdoll());
           // zombies[zombies.length-1].spawn(body.parts[0].pos.x+50*(leftorright[random(0,1)]),285+random(-20,20));
           if(frameCount%2===0){
           zombies[zombies.length-1].spawn(body.parts[0].pos.x+250,285+random(-20,20));
           }
           else{
               zombies[zombies.length-1].spawn(body.parts[0].pos.x-250,285+random(-20,20));
           }
           zombies[zombies.length-1].hp=game.maxhp;
            game.spawnrate-=15;
            game.maxhp+=40;
            game.lastspawn=0;
        }
        }
        fill(161, 207, 68); 
    noStroke();
    rect(0-0,375,400-0,400);
    pushMatrix();
    translate(game.trans.x, game.trans.y);
    game.findPlayer();
    
    }

    if(keys[2])
    {
        
        if(pastspace!==keys[2]){
            controller = new linkedparts();
             controller.createHuman(100,100);
             controller.copy(body);
             
        }
        controller.command();
        
         controller.autoCorrect(0,0);
         body.draw();
    controller.drawCom();
        
    }
    else
    {
        
        if(pastspace!==keys[2]){
            body.transfer(controller);
        }
        game.lastspawn+=1;
         game.lastheal+=1;
        body.travel(0,0);
       body.move();
       body.backup();
         body.autoCorrect(0,0);
        body.draw();
        for(var z = 0; z < zombies.length;z++){
            if(zombies[z].active){
        zombies[z].move();
        }
        }
        checkContact();
        
    }
    for(var z = 0; z < zombies.length;z++){
            if(zombies[z].active){
        zombies[z].draw();
        }
    }
    popMatrix();
  
    stroke(255, 255, 255);

    pastspace = keys[2];
};








}};
