var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);


// Richard Ngo
// ECE 4525, Hsiao
// 10/26/2019

//Description
//This is a Zoo with 4 animals in it. Two of the Animals are large green and slow floppers,
//and the other two animals are small blue toppys. Both types of animals will wander around the 
//zoo randomly, and animate as they move. The floppers have normal tails, and the toppys have two 
//tails on the top of it's head. There are also four colorful fountains in the zoo.


angleMode = "radians";



var particleObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(random(-0.3, 0.3), random(-1.3, -1.5));
    this.size = random(2, 4);
    this.position.y -= (18 - this.size);
    this.c1 = random(0,255);
    this.c2 = random(0,255);
    this.c3 = random(0,255);
    this.timeLeft = 255;
};

var fountainObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
};

var gravity = new PVector(0, 0.02);
var fountains = [];

particleObj.prototype.move = function() {
    this.velocity.add(gravity);
    this.position.add(this.velocity);
    this.timeLeft--;
};

particleObj.prototype.draw = function() {
    noStroke();
    fill(this.c1, this.c2, this.c3, this.timeLeft);
    ellipse(this.position.x, this.position.y, this.size, this.size*2);
};

fountainObj.prototype.execute = function() {
    if (this.particles.length < 300) {
        this.particles.push(new particleObj(this.x, this.y));
        this.particles.push(new particleObj(this.x, this.y));
        this.particles.push(new particleObj(this.x, this.y));
    }
    for (var i=0; i<this.particles.length; i++) {
        if ((this.particles[i].timeLeft > 0) && 
            (this.particles[i].position.y < this.y)) {
            this.particles[i].draw();
            this.particles[i].move();
        }
        else {
            this.particles.splice(i, 1);
        }
    } 
    //fill(240, 240, 240);
    //ellipse(this.x, this.y-9, 60, 10);
};


var points = [];
var p2 = [];
var numPoints = 0;

var iterations = 0;

var splitPoints = function(points) {
    p2.splice(0, p2.length);
    for (var i = 0; i < points.length - 1; i++) {
        p2.push(new PVector(points[i].x, points[i].y));
        p2.push(new PVector((points[i].x + points[i+1].x)/2, (points[i].y +
points[i+1].y)/2));
    }  
    p2.push(new PVector(points[i].x, points[i].y));
    p2.push(new PVector((points[0].x + points[i].x)/2, (points[0].y +
points[i].y)/2));
};  

var average = function(points) {
    for (var i = 0; i < p2.length - 1; i++) {
        var x = (p2[i].x + p2[i+1].x)/2;
        var y = (p2[i].y + p2[i+1].y)/2;
        p2[i].set(x, y);
    } 
    var x = (p2[i].x + points[0].x)/2;
    var y = (p2[i].y + points[0].y)/2;
    points.splice(0, points.length);
    for (i = 0; i < p2.length; i++) {
        points.push(new PVector(p2[i].x, p2[i].y));   
    }    
};    

var subdivide = function(points) {
    splitPoints(points);
    average(points);
};    

var drawer = function(points) {
     
        beginShape();
        for (var i = 0; i < points.length; i++) {
            vertex(points[i].x, points[i].y);   
        }    
        vertex(points[0].x, points[0].y);
        endShape();
        
        if (iterations < 5) {
            subdivide(points);
            iterations++;
        }    
    
};

var spider = function(x, y, c1, c2, c3) {
    this.hang = new PVector(x, y);//grapple location
    this.pos = new PVector(x, y+60);//tank location
    this.velo = new PVector(0, 0);//velo of tank
    this.attached=true;//grapple checker
    this.posP = new PVector(x,y);
    this.veloP = new PVector(0,0);
    this.delay = frameCount;
    this.check = 0;
    this.stringL = 60;
    this.size = 6;
    this.strengh = 0.5;
    this.color1 = c1;
    this.color2 = c2;
    this.color3 = c3;
    
    
};

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
    var xlen = this.pos.x-this.hang.x;
    var ylen = this.pos.y-this.hang.y;
    if(mag(xlen, ylen)>this.stringL ){
    this.pos.x =  this.pos.x-this.strengh*sin(atan2(xlen,ylen));
    this.pos.y =  this.pos.y-this.strengh*cos(atan2(xlen,ylen));
    
}
    
};

spider.prototype.draw = function() {
    noStroke();
    //this body
   
    
    fill(this.color1, this.color2,this.color3);//default color
    
    ellipse(this.pos.x, this.pos.y, this.size*2, this.size*2);
    
    fill(255,0,0);
    strokeWeight(1.0);
    //if(this.attached === true){
    
    //ellipse(this.hang.x, this.hang.y, 10, 10);
    
    //grapple web
    stroke(255,255,255);
    
    line(this.pos.x, this.pos.y, this.hang.x, this.hang.y);
    //}
    //stroke(7, 168, 39);//dark green
    //velo indicator
    //stroke(250, 13, 250);//purple
    //line(this.pos.x, this.pos.y, this.pos.x-this.velo.x*5, this.pos.y-this.velo.y*5);
    fill(255,255,255);
    //text(this.life, this.pos.x-3, this.pos.y-15);
};


var tail = function(x1, y1, cx1, cy1, cx2, cy2, x2, y2, cx1Dir, cx2Dir, x2Dir, len){
this.x1 = x1;
this.y1 = y1;
this.cx1 = cx1;
this.cy1 = cy1;
this.cx2 = cx2;
this.cy2 = cy2;
this.x2 = x2;
this.y2 = y2;

this.cx1Dir = cx1Dir;
this.cx2Dir = cx2Dir;
this.x2Dir = x2Dir;

this.len = len;
};

tail.prototype.act = function() {
    this.cx1 += this.cx1Dir;
    if ((this.cx1 > this.x2) || (this.cx1 < this.x1)) {this.cx1Dir = -this.cx1Dir;}
    this.cx2 += this.cx2Dir;
    if ((this.cx2 < this.x1) || (this.cx2 > this.x2)) {this.cx2Dir = -this.cx2Dir;}
    this.x2 += this.x2Dir;
    if ((abs(this.x1 - this.x2) > this.len) || (this.x2 < this.x1)) {this.x2Dir = -this.x2Dir;}
};


var flopper = function(){
    this.pos = new PVector(random(20,380),random(20,380));
    this.travel = new PVector(random(20,380),random(20,380));
    this.strength = 0.2;
    this.lefted = false;
    this.breath = false;
    this.delay = frameCount;
    this.c1 = random(0,255);
    this.c2 = random(0,255);
    this.c3 = random(0,255);
    this.body = [];
    this.pit = [];
    this.stripe1 = [];
    this.stripe2 = [];
    this.stripe3 = [];
    this.stripe4 = [];
    this.leg = [];
    this.belly = [];
    this.hole1 = [];
    this.hole2 = [];
    this.eye1 = [];
    this.eye2 = [];

    var xscal = 1/4;
    var yscal = 1/4;
    var speed = 1/4;
    
    var len = 100;
    var x1 = 62*xscal;
    var y1 = 90*yscal;
    var cx1 = 262*xscal;
    var cy1 = 138*yscal;
    var cx2 = 100*xscal;
    var cy2 = 287*yscal;
    var x2 = 206*xscal;
    var y2 = 356*yscal;
    
    var cx1Dir = 2*speed;
    var cx2Dir = -1*speed;
    var x2Dir = -2*speed;
    
    this.tail= new tail(x1, y1, cx1, cy1, cx2, cy2, x2, y2, cx1Dir, cx2Dir, x2Dir, len);
};

flopper.prototype.initialize = function() {
        this.body.push(new PVector(88, 1));
    this.body.push(new PVector(105, 2));
    this.body.push(new PVector(115, 4));
    this.body.push(new PVector(124, 8));
    this.body.push(new PVector(130, 10));
    this.body.push(new PVector(143, 21));
    this.body.push(new PVector(146, 25));
    this.body.push(new PVector(152, 33));
    this.body.push(new PVector(164, 47));
    this.body.push(new PVector(166, 56));
    this.body.push(new PVector(169, 61));
    this.body.push(new PVector(169, 75));
    this.body.push(new PVector(162, 82));
    this.body.push(new PVector(155, 80));
    this.body.push(new PVector(146, 83));
    this.body.push(new PVector(138, 77));
    this.body.push(new PVector(135, 68));
    this.body.push(new PVector(127, 63));
    this.body.push(new PVector(130, 73));
    this.body.push(new PVector(128, 90));
    this.body.push(new PVector(123, 94));
    this.body.push(new PVector(112, 95));
    this.body.push(new PVector(106, 93));
    this.body.push(new PVector(99, 82));
    this.body.push(new PVector(97, 70));
    this.body.push(new PVector(92, 63));
    this.body.push(new PVector(88, 60));
    this.body.push(new PVector(81, 56));
    this.body.push(new PVector(72, 53));
    this.body.push(new PVector(64, 51));
    this.body.push(new PVector(50, 52));
    this.body.push(new PVector(41, 55));
    this.body.push(new PVector(18, 76));
    this.body.push(new PVector(9, 76));
    this.body.push(new PVector(2, 65));
    this.body.push(new PVector(2, 56));
    this.body.push(new PVector(5, 51));
    this.body.push(new PVector(10, 43));
    this.body.push(new PVector(20, 31));
    this.body.push(new PVector(23, 25));
    this.body.push(new PVector(34, 17));
    this.body.push(new PVector(39, 15));
    this.body.push(new PVector(46, 11));
    this.body.push(new PVector(54, 9));
    this.body.push(new PVector(59, 6));
    this.body.push(new PVector(68, 3));
    
    
    
    
    this.pit.push(new PVector(147, 51));
    this.pit.push(new PVector(148, 50));
    this.pit.push(new PVector(150, 52));
    this.pit.push(new PVector(150, 53));
    this.pit.push(new PVector(152, 55));
    this.pit.push(new PVector(152, 56));
    this.pit.push(new PVector(153, 57));
    this.pit.push(new PVector(153, 58));
    this.pit.push(new PVector(154, 59));
    this.pit.push(new PVector(154, 62));
    this.pit.push(new PVector(155, 63));
    this.pit.push(new PVector(155, 77));
    this.pit.push(new PVector(153, 79));
    this.pit.push(new PVector(152, 78));
    this.pit.push(new PVector(152, 74));
    this.pit.push(new PVector(153, 73));
    this.pit.push(new PVector(153, 67));
    this.pit.push(new PVector(152, 66));
    this.pit.push(new PVector(152, 61));
    this.pit.push(new PVector(151, 60));
    this.pit.push(new PVector(151, 58));
    this.pit.push(new PVector(150, 57));
    this.pit.push(new PVector(150, 56));
    this.pit.push(new PVector(147, 53));
    
    this.stripe1.push(new PVector(55, 27));
    this.stripe1.push(new PVector(69, 28));
    this.stripe1.push(new PVector(85, 30));
    this.stripe1.push(new PVector(93, 35));
    this.stripe1.push(new PVector(105, 44));
    this.stripe1.push(new PVector(113, 54));
    this.stripe1.push(new PVector(105, 53));
    this.stripe1.push(new PVector(102, 49));
    this.stripe1.push(new PVector(91, 40));
    this.stripe1.push(new PVector(82, 36));
    this.stripe1.push(new PVector(77, 33));
    this.stripe1.push(new PVector(68, 33));
    this.stripe1.push(new PVector(59, 30));
    this.stripe1.push(new PVector(54, 27));
    
    
    this.stripe2.push(new PVector(64, 13));
    this.stripe2.push(new PVector(75, 14));
    this.stripe2.push(new PVector(82, 16));
    this.stripe2.push(new PVector(88, 19));
    this.stripe2.push(new PVector(95, 21));
    this.stripe2.push(new PVector(102, 25));
    this.stripe2.push(new PVector(109, 27));
    this.stripe2.push(new PVector(125, 41));
    this.stripe2.push(new PVector(117, 49));
    this.stripe2.push(new PVector(103, 38));
    this.stripe2.push(new PVector(96, 34));
    this.stripe2.push(new PVector(89, 29));
    this.stripe2.push(new PVector(84, 25));
    this.stripe2.push(new PVector(77, 23));
    this.stripe2.push(new PVector(66, 20));
    
    this.stripe3.push(new PVector(74, 6));
    this.stripe3.push(new PVector(94, 7));
    this.stripe3.push(new PVector(104, 9));
    this.stripe3.push(new PVector(110, 12));
    this.stripe3.push(new PVector(115, 14));
    this.stripe3.push(new PVector(124, 21));
    this.stripe3.push(new PVector(129, 23));
    this.stripe3.push(new PVector(136, 28));
    this.stripe3.push(new PVector(142, 40));
    this.stripe3.push(new PVector(136, 41));
    this.stripe3.push(new PVector(128, 36));
    this.stripe3.push(new PVector(115, 25));
    this.stripe3.push(new PVector(111, 22));
    this.stripe3.push(new PVector(105, 19));
    this.stripe3.push(new PVector(99, 17));
    this.stripe3.push(new PVector(93, 14));
    this.stripe3.push(new PVector(86, 12));
    this.stripe3.push(new PVector(80, 9));
    
    this.stripe4.push(new PVector(88, 2));
    this.stripe4.push(new PVector(108, 4));
    this.stripe4.push(new PVector(114, 7));
    this.stripe4.push(new PVector(119, 9));
    this.stripe4.push(new PVector(125, 13));
    this.stripe4.push(new PVector(136, 23));
    this.stripe4.push(new PVector(134, 25));
    this.stripe4.push(new PVector(129, 22));
    this.stripe4.push(new PVector(119, 15));
    this.stripe4.push(new PVector(114, 12));
    this.stripe4.push(new PVector(109, 10));
    this.stripe4.push(new PVector(102, 7));
    this.stripe4.push(new PVector(87, 5));
    
    this.leg.push(new PVector(55, 48));
    this.leg.push(new PVector(70, 50));
    this.leg.push(new PVector(65, 58));
    this.leg.push(new PVector(59, 58));
    this.leg.push(new PVector(53, 53));
    
    this.belly.push(new PVector(52, 49));
    this.belly.push(new PVector(66, 48));
    this.belly.push(new PVector(69, 49));
    this.belly.push(new PVector(72, 50));
    this.belly.push(new PVector(77, 51));
    this.belly.push(new PVector(80, 52));
    this.belly.push(new PVector(82, 53));
    this.belly.push(new PVector(84, 54));
    this.belly.push(new PVector(88, 57));
    this.belly.push(new PVector(90, 58));
    this.belly.push(new PVector(92, 59));
    this.belly.push(new PVector(95, 63));
    this.belly.push(new PVector(97, 66));
    this.belly.push(new PVector(98, 68));
    this.belly.push(new PVector(99, 70));
    this.belly.push(new PVector(100, 75));
    this.belly.push(new PVector(101, 77));
    this.belly.push(new PVector(99, 78));
    this.belly.push(new PVector(96, 79));
    this.belly.push(new PVector(81, 80));
    this.belly.push(new PVector(73, 79));
    this.belly.push(new PVector(69, 78));
    this.belly.push(new PVector(62, 77));
    this.belly.push(new PVector(58, 76));
    this.belly.push(new PVector(55, 75));
    this.belly.push(new PVector(53, 74));
    this.belly.push(new PVector(51, 73));
    this.belly.push(new PVector(48, 71));
    this.belly.push(new PVector(45, 69));
    this.belly.push(new PVector(42, 67));
    this.belly.push(new PVector(40, 64));
    this.belly.push(new PVector(37, 56));
    this.belly.push(new PVector(42, 52));
    this.belly.push(new PVector(48, 50));
    
    this.hole1.push(new PVector(144, 80));
    this.hole1.push(new PVector(145, 79));
    this.hole1.push(new PVector(146, 80));
    this.hole1.push(new PVector(146, 81));
    this.hole1.push(new PVector(145, 82));
    this.hole1.push(new PVector(144, 81));
    
    this.hole2.push(new PVector(149, 79));
    this.hole2.push(new PVector(150, 78));
    this.hole2.push(new PVector(151, 79));
    this.hole2.push(new PVector(151, 80));
    this.hole2.push(new PVector(150, 81));
    this.hole2.push(new PVector(149, 80));
    
    this.eye1.push(new PVector(141, 71));
    this.eye1.push(new PVector(142, 72));
    this.eye1.push(new PVector(143, 72));
    this.eye1.push(new PVector(144, 73));
    this.eye1.push(new PVector(144, 76));
    this.eye1.push(new PVector(143, 77));
    this.eye1.push(new PVector(141, 77));
    this.eye1.push(new PVector(139, 75));
    this.eye1.push(new PVector(139, 73));
    
    this.eye2.push(new PVector(151, 71));
    this.eye2.push(new PVector(152, 70));
    this.eye2.push(new PVector(154, 70));
    this.eye2.push(new PVector(156, 72));
    this.eye2.push(new PVector(156, 73));
    this.eye2.push(new PVector(154, 75));
    this.eye2.push(new PVector(152, 75));
    this.eye2.push(new PVector(151, 74));
};


flopper.prototype.draw = function() {
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    scale(0.8);
    if(this.lefted){
        scale(-1,1);
        translate(-160, 0);
    }
    strokeWeight(0.5);
    
    stroke(0, 0, 0);
    fill(0, 255, 102);
    drawer(this.leg);
    if(this.breath){
    drawer(this.belly);
    }
         pushMatrix();
        translate(50, -5);
        scale(-1,1);
        
        
         noFill();
        stroke(71, 81, 217);
        strokeWeight(3);
        bezier(this.tail.x1, this.tail.y1, this.tail.cx1, this.tail.cy1, this.tail.cx2, this.tail.cy2, this.tail.x2, this.tail.y2);
        stroke(255, 170, 0);
    strokeWeight(3);
        strokeWeight(15);
        point(this.tail.x2, this.tail.y2);
        popMatrix();
    
     strokeWeight(0.5);
    
    stroke(0, 0, 0);
    fill(52, 224, 121);
  
    drawer(this.body);
    
    noStroke();
    
     fill(34, 179, 87);
   
    drawer(this.pit);
    //fill(71, 81, 217);
    fill(this.c1, this.c2, this.c3);
    pushMatrix();
    
    if(this.breath){
    scale(1,1.1);
    }
    drawer(this.stripe1);
    drawer(this.stripe2);
    drawer(this.stripe3);
    drawer(this.stripe4);
    popMatrix();
    fill(0, 0, 0);
    drawer(this.hole1);
    drawer(this.hole2);
    drawer(this.eye1);
    drawer(this.eye2);
    
   
    popMatrix();
};

flopper.prototype.act = function() {
    this.tail.act();
    
    if(this.delay - frameCount <0)
    {
     this.breath = ~this.breath;
     if(this.breath){
            this.c1 = random(0,255);
    this.c2 = random(0,255);
    this.c3 = random(0,255);
        }
     this.delay = frameCount+120;   
    }
    
    
    
    var xlen = this.pos.x-this.travel.x;
    var ylen = this.pos.y-this.travel.y;
    if(xlen>0){
     this.lefted = true;   
    }
    else{
        this.lefted = false;
    }
    
    this.pos.x =  this.pos.x-this.strength*sin(atan2(xlen,ylen));
    this.pos.y =  this.pos.y-this.strength*cos(atan2(xlen,ylen));
    
    
    if(abs(xlen)<1 && abs(ylen) < 1){
     this.travel.x =random(20,380);
     this.travel.y =random(20,380);
    }
    
    
};

var toppy = function(){
    this.pos = new PVector(random(20, 380),random(20, 380));
    this.travel = new PVector(random(20,380),random(20,380));
    this.strength = 0.5;
    this.lefted = false;
    
    this.leg1 = [];
    this.leg2 = [];
    this.mouth = [];
    this.eye2 = [];
    this.eye1 = [];
    this.band = [];
    this.body = [];
    this.brow1 = [];
    this.brow2 = [];
    
    
    
     var xscal = 1/4;
    var yscal = -1/4;
    var speed = 1;
    
    var len = 80;
    var x1 = 62*xscal;
    var y1 = 90*yscal;
    var cx1 = 262*xscal;
    var cy1 = 138*yscal;
    var cx2 = 100*xscal;
    var cy2 = 287*yscal;
    var x2 = 206*xscal;
    var y2 = 356*yscal;
    
    var cx1Dir = 2*speed;
    var cx2Dir = -1*speed;
    var x2Dir = -2*speed;
    
    this.ant1= new tail(x1, y1, cx1, cy1, cx2, cy2, x2, y2, cx1Dir, cx2Dir, x2Dir, len);
    
    this.ball1 = new spider(x2, y2, random(0,255), random(0,255), random(0,255));
    
    
    var xscal = 1/5;
    var yscal = -1/5;
    var speed = 0.8;
    
    var len = 90;
    var x1 = 62*xscal;
    var y1 = 90*yscal;
    var cx1 = 262*xscal;
    var cy1 = 138*yscal;
    var cx2 = 100*xscal;
    var cy2 = 287*yscal;
    var x2 = 206*xscal;
    var y2 = 356*yscal;
    
    var cx1Dir = 2*speed;
    var cx2Dir = -1*speed;
    var x2Dir = -2*speed;
    
    this.ant2= new tail(x1, y1, cx1, cy1, cx2, cy2, x2, y2, cx1Dir, cx2Dir, x2Dir, len);
    this.ball2 = new spider(x2, y2, random(0,255), random(0,255), random(0,255));
};

toppy.prototype.initialize = function() {
        this.leg1.push(new PVector(71, 67));
    this.leg1.push(new PVector(78, 68));
    this.leg1.push(new PVector(73, 75));
    this.leg1.push(new PVector(69, 78));
    this.leg1.push(new PVector(65, 79));
    this.leg1.push(new PVector(62, 81));
    this.leg1.push(new PVector(59, 82));
    this.leg1.push(new PVector(52, 82));
    this.leg1.push(new PVector(56, 78));
    this.leg1.push(new PVector(61, 74));
    this.leg1.push(new PVector(68, 69));
    
    this.leg2.push(new PVector(101, 63));
    this.leg2.push(new PVector(105, 65));
    this.leg2.push(new PVector(114, 73));
    this.leg2.push(new PVector(117, 76));
    this.leg2.push(new PVector(123, 85));
    this.leg2.push(new PVector(119, 84));
    this.leg2.push(new PVector(115, 81));
    this.leg2.push(new PVector(111, 79));
    this.leg2.push(new PVector(108, 77));
    this.leg2.push(new PVector(104, 75));
    this.leg2.push(new PVector(96, 68));
    this.leg2.push(new PVector(99, 65));
    
    this.mouth.push(new PVector(83, 60));
    this.mouth.push(new PVector(93, 60));
    this.mouth.push(new PVector(97, 61));
    this.mouth.push(new PVector(96, 66));
    this.mouth.push(new PVector(83, 66));
    this.mouth.push(new PVector(79, 63));
    
    this.eye2.push(new PVector(87, 45));
    this.eye2.push(new PVector(92, 45));
    this.eye2.push(new PVector(99, 52));
    this.eye2.push(new PVector(99, 58));
    this.eye2.push(new PVector(95, 60));
    this.eye2.push(new PVector(90, 56));
    
    this.eye1.push(new PVector(73, 44));
    this.eye1.push(new PVector(77, 44));
    this.eye1.push(new PVector(80, 47));
    this.eye1.push(new PVector(82, 49));
    this.eye1.push(new PVector(84, 53));
    this.eye1.push(new PVector(83, 58));
    this.eye1.push(new PVector(79, 61));
    this.eye1.push(new PVector(74, 60));
    this.eye1.push(new PVector(72, 57));
    this.eye1.push(new PVector(71, 48));
    this.eye1.push(new PVector(73, 45));
    
    this.band.push(new PVector(75, 12));
    this.band.push(new PVector(84, 14));
    this.band.push(new PVector(85, 22));
    this.band.push(new PVector(73, 22));
    
    this.body.push(new PVector(79, 1));
    this.body.push(new PVector(82, 4));
    this.body.push(new PVector(84, 11));
    this.body.push(new PVector(86, 26));
    this.body.push(new PVector(88, 31));
    this.body.push(new PVector(93, 39));
    this.body.push(new PVector(101, 44));
    this.body.push(new PVector(108, 51));
    this.body.push(new PVector(104, 65));
    this.body.push(new PVector(99, 68));
    this.body.push(new PVector(88, 70));
    this.body.push(new PVector(73, 68));
    this.body.push(new PVector(63, 66));
    this.body.push(new PVector(57, 62));
    this.body.push(new PVector(55, 57));
    this.body.push(new PVector(64, 40));
    this.body.push(new PVector(70, 36));
    this.body.push(new PVector(72, 31));
    this.body.push(new PVector(74, 13));
    this.body.push(new PVector(76, 6));
    
    this.brow1.push(new PVector(71, 40));
    this.brow1.push(new PVector(75, 40));
    this.brow1.push(new PVector(78, 41));
    this.brow1.push(new PVector(81, 43));
    this.brow1.push(new PVector(83, 45));
    this.brow1.push(new PVector(79, 44));
    this.brow1.push(new PVector(76, 43));
    this.brow1.push(new PVector(71, 41));
    
    this.brow2.push(new PVector(89, 38));
    this.brow2.push(new PVector(90, 39));
    this.brow2.push(new PVector(90, 40));
    this.brow2.push(new PVector(87, 43));
    this.brow2.push(new PVector(86, 42));
    this.brow2.push(new PVector(86, 41));
};

toppy.prototype.draw = function() {
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    scale(0.8);
    if(this.lefted){
        scale(-1,1);
        translate(-160, 0);
    }
    pushMatrix();
     noFill();
     translate(70, 40);
        stroke(255, 255, 255);
        strokeWeight(1);
    bezier(this.ant2.x1, this.ant2.y1, this.ant2.cx1, this.ant2.cy1, this.ant2.cx2, this.ant2.cy2, this.ant2.x2, this.ant2.y2);
        stroke(13, 255, 0);
    
       this.ball2.draw();
     pushMatrix();
     noFill();
     translate(20, 0);
        scale(-1,1);
        stroke(255, 255, 255);
        strokeWeight(1);
        
    bezier(this.ant1.x1, this.ant1.y1, this.ant1.cx1, this.ant1.cy1, this.ant1.cx2, this.ant1.cy2, this.ant1.x2, this.ant1.y2);

        this.ball1.draw();

        
        popMatrix();
        popMatrix();
    
    
    strokeWeight(0.5);
    noStroke();
    fill(255, 255, 255);
    drawer(this.leg1);
    drawer(this.leg2);
    fill(0, 170, 255);
    drawer(this.body);
    fill(25, 255, 228);
    drawer(this.mouth);
    fill(74, 75, 92);
    drawer(this.eye2);
    drawer(this.eye1);
    fill(0, 255, 47);
    drawer(this.band);
    fill(255, 238, 0);
    drawer(this.brow1);
    drawer(this.brow2);
    
     
    
    
    popMatrix();
};

toppy.prototype.act = function() {
    this.ant1.act();
    this.ball1.hang.x = this.ant1.x2;
    this.ball1.hang.y = this.ant1.y2;
    this.ball1.move();
    
    
    this.ant2.act();
    this.ball2.hang.x = this.ant2.x2;
    this.ball2.hang.y = this.ant2.y2;
    this.ball2.move();
    
    var xlen = this.pos.x-this.travel.x;
    var ylen = this.pos.y-this.travel.y;
    if(xlen>0){
     this.lefted = true;   
    }
    else{
        this.lefted = false;
    }
    
    this.pos.x =  this.pos.x-this.strength*sin(atan2(xlen,ylen));
    this.pos.y =  this.pos.y-this.strength*cos(atan2(xlen,ylen));
    
    
    if(abs(xlen)<1 && abs(ylen) < 1){
     this.travel.x =random(20,380);
     this.travel.y =random(20,380);
    }
};

var f1 = new flopper();
var t1 = new toppy();
var f2 = new flopper();
var t2 = new toppy();

f1.initialize();
t1.initialize();
f2.initialize();
t2.initialize();




//fountains.push(new fountainObj(200, 200));
//fill(240, 240, 240);
    //ellipse(fountains[i].x, fountains[i].y-9, 60, 10);
fountains.push(new fountainObj(100, 100));
fountains.push(new fountainObj(300, 350));
fountains.push(new fountainObj(100, 350));
fountains.push(new fountainObj(300, 100));
var draw = function() {
    background(55, 66, 64);
    for (var i=0; i<fountains.length; i++) {
        fill(240, 240, 240);
        ellipse(fountains[i].x, fountains[i].y-9, 60, 10);
    }
    
    
 f1.draw();
 f1.act();
 t1.draw();
 t1.act();
 f2.draw();
 f2.act();
 t2.draw();
 t2.act();

   for (var i=0; i<fountains.length; i++) {

        fountains[i].execute();
    }
};










}};
