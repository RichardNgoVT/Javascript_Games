var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);


// Richard Ngo
// ECE 4525, Hsiao
// 11/1/2019

// Main menu of game, pressing the instructions button will lead to the instructions. Current instuctions are bare,
// but will be further developed as game is developed. A rag doll stick figure will also follow your cursor when you click on the screen, 
// and rag doll around. Pressing the start button will exit the starting screen, and enter the "game" which at the moment are the appearnce 
// of stage lights.


frameRate(60);//60 frames per second
angleMode = "radians";

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
    this.inst.text = "\n INSTRUCTIONS\n Use the mouse to command move mans limbs and help him \n complete levels. Use Spacebar to start and stop time. \n More info later as game gets more developed.";
    this.begin = false;
    this.delay = 0;
    this.c1 = 250;
    this.c2 = 249;
    this.c3 = 220;
};

button.prototype.inRange = function()
{
    if((mouseX-this.pos.x)<this.width && mouseX>this.pos.x && (mouseY-this.pos.y)<this.height && mouseY > this.pos.y){
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
    if((mouseX-this.pos.x)<this.width && mouseX>this.pos.x && (mouseY-this.pos.y)<this.height && mouseY > this.pos.y){
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
    
    var angle=atan2(10-mouseX,10-mouseY);
    rotate(-angle+PI/4+PI);
    fill(this.c1, this.c2, this.c3);
    arc(-10,-10,1000,1000,PI/6,2*PI/6);
    popMatrix();
    
    pushMatrix();
     var angle=atan2(mouseX-400,10-mouseY);
     translate(400,0);
    
    
   scale(-1,1);
   rotate(-angle+PI/4+PI);
    
    fill(this.c1, this.c2, this.c3);
    arc(-10,-10,1000,1000,PI/6,2*PI/6);
    popMatrix();
    
     if(this.delay+300<frameCount){
             fill(255, 255, 255);
     textSize(30);
    text("       TO BE \n CONTINUED", 100,100);
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
    
    fill(255, 0, 0);
    if(!this.instructShow){
        textSize(30);
    text("  MOVE MAN \nADVENTURES", 100+random(-1,1),100+random(-1,1));
    fill(255, 255, 255);
    textSize(12);
    text("  Richard Ngo", 160,165);
    }
    textSize(12);
    }
};


var game = new uI();
var mouseReleased = function() {
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
    
   
};


var part = function(x, y, minA, maxA, modifier, up, down, length, xaccel){
    this.pos = new PVector(x, y);
    this.velo = new PVector(0, 0);
    
    this.accel = new PVector(xaccel, 10/60);
    //this.accel = new PVector(0, 0);
	this.minAng = minA;
	this.maxAng = maxA;
	this.modi = modifier;
	this.angle = 0;
	this.right = true;
	
	this.up = up;
	
	this.down = down;
	
	this.len = length;
};


var linkedparts= function(){
this.parts = [];
};

var torso = new linkedparts();

torso.parts.push(new part(200,0,PI,PI,1,1,1,0,0));
torso.parts.push(new part(200,10,PI,PI,1,1,1,10,0));
torso.parts.push(new part(200,40,PI,PI,1,1,1,40,0));



var armL = new linkedparts();
armL.parts.push(new part(200,10,PI,PI,1,1,1,0,0));
armL.parts.push(new part(200,30,PI,PI,1,1,1,20,0));
armL.parts.push(new part(200,50,PI,PI,1,1,1,20,-2/60));
armL.parts.push(new part(200,45,PI,PI,1,1,1,5,0));

var armR = new linkedparts();
armR.parts.push(new part(200,10,PI,PI,1,1,1,0,0));
armR.parts.push(new part(200,30,PI,PI,1,1,1,20,0));
armR.parts.push(new part(200,50,PI,PI,1,1,1,20,2/60));
armR.parts.push(new part(200,55,PI,PI,1,1,1,5,0));

var legL = new linkedparts();
legL.parts.push(new part(200,50,PI,PI,1,1,1,0,0));
legL.parts.push(new part(200,70,PI,PI,1,1,1,20,0));
legL.parts.push(new part(200,90,PI,PI,1,1,1,20,-2/60));
legL.parts.push(new part(195,90,PI,PI,1,1,1,10,0));

var legR = new linkedparts();
legR.parts.push(new part(200,40,PI,PI,1,1,1,0,0));
legR.parts.push(new part(200,20,PI,PI,1,1,1,20,0));
legR.parts.push(new part(200,0,PI,PI,1,1,1,20,2/60));
legR.parts.push(new part(205,0,PI,PI,1,1,1,10,0));


var normF = function(point, hang) {
	
    var xlen = hang.pos.x-point.pos.x;
    var ylen = hang.pos.y-point.pos.y;
    var angle = atan2(xlen,ylen);
	
	var velocity = new PVector(point.velo.x,point.velo.y);

    var normalV = new PVector(0, 0);
    if(mag(velocity.x,velocity.y)!==0)
    {
        
    
    
    var angleV = acos((xlen*velocity.x+ylen*velocity.y)/(mag(xlen,ylen)*mag(velocity.x,velocity.y)));
    
    //tension from web
    
    var normal = mag(velocity.x,velocity.y)*cos(angleV);
	

    normalV.x = normal*sin(angle);
    normalV.y = normal*cos(angle);
    }
	return normalV;
};

var move = function(point1, point2, len) {
    var point1old = point1;
	var norm1 = normF(point1,point2);
	var norm2 = normF(point2,point1old);
    //updated location
	
	var normR = new PVector(0, 0);
	
	//norm2.x = norm1.x*2;
	//norm2.y = norm1.y*2;
	
	//norm1.x = norm2.x*2;
	//norm1.y = norm2.y*2;
	
	//normR.x = Math.round((norm1.x+norm2.x)*10000)/10000;
	//normR.y = Math.round((norm1.y+norm2.y)*10000)/10000;
	
	normR.x = norm1.x+norm2.x;
    normR.y = norm1.y+norm2.y;
	
		//normR.x = -norm1.x;
	//normR.y = -norm1.y;
	
	////
	fill(255, 255, 255);
	text(norm1.x,200, 50);
	text(norm2.x,200, 70);
	text(norm1.y,200, 90);
	text(norm2.y,200, 110);
	
	text(point1.velo.y-point2.velo.y,300, 50);
	text(point2.velo.x,300, 70);
    ////
    
    //normR.x=0;
	//normR.y=0;
	
	
	
	 point1.velo.x = point1.velo.x-norm1.x+(norm1.x+norm2.x)/2;
     point1.velo.y = point1.velo.y-norm1.y+(norm1.y+norm2.y)/2;
	
    point1.pos.x = point1.pos.x + point1.velo.x;
    point1.pos.y = point1.pos.y + point1.velo.y;
	
	point2.velo.x = point2.velo.x-norm2.x+(norm1.x+norm2.x)/2;
    point2.velo.y = point2.velo.y-norm2.y+(norm1.y+norm2.y)/2;
    
    point2.pos.x = point2.pos.x + point2.velo.x;
   point2.pos.y = point2.pos.y + point2.velo.y;
	
	var xlen = point2.pos.x-point1.pos.x;
    var ylen = point2.pos.y-point1.pos.y;
	var angle = atan2(xlen,ylen);
	
   // auto corrects errors caused by descrete incrementation of frames instead of continuous flow of time
   //point1.pos.x = point2.pos.x-len*sin(angle);
    //point1.pos.y = point2.pos.y-len*cos(angle);
    
    //point1.velo.y = point1.accel.y + point1.velo.y;
	//point1.velo.x = point1.accel.x + point1.velo.x;
	
	//point2.velo.y = point2.accel.y + point2.velo.y;
	//point2.velo.x = point2.accel.x + point2.velo.x;
	
	

};


var getMid = function(point1, point2, point3) {
    var norm12 = normF(point1,point2);
    var norm21 = normF(point2,point1);
    
    var norm23 = normF(point2,point3);
    var norm32 = normF(point3,point2);
    
    
    
    point2.velo.x =  point2.velo.x-norm21.x-norm23.x+(norm12.x+norm21.x)/2+(norm23.x+norm32.x)/2;
    point2.velo.y = point2.velo.y-norm21.y-norm23.y+(norm12.y+norm21.y)/2+(norm23.y+norm32.y)/2;
    
    return point2;
};


var findCenter = function(points) {
    var next = [];
    if(points.length>2){
     
     for(var i = 0; i < points.length-2; i++){
     next.push(getMid(points[i],points[i+1],points[i+2]));
    }
    
    return findCenter(next);
    }
    else if(points.length>1){
    var norm12 = normF(points[0],points[1]);
    var norm21 = normF(points[1],points[0]);
    var velo = new PVector(0,0);
    
    velo.x = points[0].velo.x-norm12.x+(norm12.x+norm21.x)/2;
    velo.y = points[0].velo.y-norm12.y+(norm12.y+norm21.y)/2;
    next.push(velo);
    velo.x = points[1].velo.x-norm21.x+(norm12.x+norm21.x)/2;
    velo.y = points[1].velo.y-norm21.y+(norm12.y+norm21.y)/2;
    next.push(velo);
    return next;
     }
     else{
         return points;
     }
    
};


var move2 = function(points) {
  
  
  var odd = (points.length)%2;
  var i = (points.length-odd)/2;
  var j = (points.length-odd)/2-1+odd;
  var center = findCenter(points);
  points[i] = center[1-odd];
  points[j] = center[0];
  var norm12 = new PVector();
    var norm21 = PVector();
    var outP=points[points.length-1];
    for(var l = i; l<points.length.length-2; l++){
  for (var k = points.length-2; k > l; k--){
       norm12 = normF(points[k],outP);
       norm21 = normF(outP,points[k]);
       outP = points[k];
       outP.velo.x = outP.velo.x-norm12.x+(norm12.x+norm21.x)/2;
       outP.velo.y = outP.velo.y-norm12.y+(norm12.y+norm21.y)/2;
  }
      points[l+1] = outP;
    }
    
     norm12 = normF(points[points.length-2],points[points.length-1]);
       norm21 = normF(points[points.length-1],points[points.length-2]);
       
       points[points.length-1].velo.x = points[points.length-1].velo.x-norm21.x+(norm12.x+norm21.x)/2;
       points[points.length-1].velo.y = points[points.length-1].velo.y-norm21.y+(norm12.y+norm21.y)/2;
       
       ////
       outP=points[0];
       for(var l = j; l>1; l--){
  for (var k = 1; k < l; k++){
       norm12 = normF(points[k],outP);
       norm21 = normF(outP,points[k]);
       outP = points[k];
       outP.velo.x = outP.velo.x-norm12.x+(norm12.x+norm21.x)/2;
       outP.velo.y = outP.velo.y-norm12.y+(norm12.y+norm21.y)/2;
  }
      points[l-1] = outP;
    }
    
     norm12 = normF(points[1],points[0]);
       norm21 = normF(points[0],points[1]);
       
       points[0].velo.x = points[0].velo.x-norm21.x+(norm12.x+norm21.x)/2;
       points[0].velo.y = points[0].velo.y-norm21.y+(norm12.y+norm21.y)/2;
  
  return points;
};

linkedparts.prototype.move3 = function(){
    var norm12;
    var norm21;
    var norm23;
    var norm32;
    var normdiff = new PVector(0,0);
    
     var xlen;
    var ylen;
    var angle;
    var len;
    
    for(var i = 0; i < this.parts.length-2; i++){
 
        
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
        
        this.parts[i+1].pos.x = this.parts[i].pos.x-this.parts[i+1].len*sin(angle);
    this.parts[i+1].pos.y = this.parts[i].pos.y-this.parts[i+1].len*cos(angle);
   
   
   this.parts[i+2].pos.x = this.parts[i+2].pos.x + this.parts[i+2].velo.x;
   this.parts[i+2].pos.y = this.parts[i+2].pos.y + this.parts[i+2].velo.y;
        
        xlen = this.parts[i+1].pos.x - this.parts[i+2].pos.x;
        ylen = this.parts[i+1].pos.y - this.parts[i+2].pos.y;
        angle= atan2(xlen,ylen);
        //len = 30;
        //len = this.parts[i+2].len;
        
        this.parts[i+2].pos.x = this.parts[i+1].pos.x-this.parts[i+2].len*sin(angle);
    this.parts[i+2].pos.y = this.parts[i+1].pos.y-this.parts[i+2].len*cos(angle);
        
        
    }
    for(var i = 0; i < this.parts.length; i++){
        
         this.parts[i].velo.y = this.parts[i].accel.y + this.parts[i].velo.y;
	        this.parts[i].velo.x = this.parts[i].accel.x + this.parts[i].velo.x;
     }
    
};

linkedparts.prototype.drawConnects = function(){
    strokeWeight(2);
    for(var i = 0; i < this.parts.length-1; i++){
        
        line(this.parts[i].pos.x, this.parts[i].pos.y, this.parts[i+1].pos.x, this.parts[i+1].pos.y);
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

var ragdoll = function(){
    
    
    torso.move3();
    armL.move3();
    armR.move3();
    legL.move3();
    legR.move3();
    
    torso.speedup();
    armL.speedup();
    armR.speedup();
    legL.speedup();
    legR.speedup();
    
    
    
	//println(torso.length);
//	println(mag(torso[0].pos.x-torso[1].pos.x,torso[0].pos.y-torso[1].pos.y));
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
    
    
    armL.parts[0].velo.x = torso.parts[1].pos.x  - armL.parts[0].pos.x;
    armL.parts[0].velo.y = torso.parts[1].pos.y - armL.parts[0].pos.y;
    
    armR.parts[0].velo.x = torso.parts[1].pos.x  - armR.parts[0].pos.x;
    armR.parts[0].velo.y = torso.parts[1].pos.y - armR.parts[0].pos.y;
    
    legL.parts[0].velo.x = torso.parts[2].pos.x  - legL.parts[0].pos.x;
    legL.parts[0].velo.y = torso.parts[2].pos.y - legL.parts[0].pos.y;
    
    legR.parts[0].velo.x = torso.parts[2].pos.x  - legR.parts[0].pos.x;
    legR.parts[0].velo.y = torso.parts[2].pos.y - legR.parts[0].pos.y;
    
    stroke(255, 255, 255);
    torso.drawConnects();
    stroke(255, 0, 255);
    armL.drawConnects();
    stroke(0, 255, 30);
    armR.drawConnects();
    stroke(38, 33, 196);
    legL.drawConnects();
    stroke(255, 234, 0);
    legR.drawConnects();
    
    stroke(16, 145, 40);
    strokeWeight(17);
    point(torso.parts[0].pos.x,torso.parts[0].pos.y);
    
    
    
 
};


var draw = function() {
    background(0, 0, 0);
    game.act();
    ragdoll();
    stroke(255, 255, 255);
    fill(255, 255, 255);
 
};










}};
