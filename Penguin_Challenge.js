var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 

// Richard Ngo
// ECE 4525, Hsiao
// 11/8/2019

//Instructions
//Up/Down Keys: Move forwards/backwards
//Left/Right Keys: Turn left/right
//Space: Slide

//Description
//Press restart if initial animation does not play
//In this game, you play as a hungry penguin who needs to eat. There are polar bears 
//guarding the fish however. They polar bears will chase you at all times, and will 
//sometimes work together to try to and flank you. In order to win, you must be able 
//to get all 20 fishes in the map.If you are caught before you get to all 20 fish, you 
//will reach the game over screen. If you are able to get all 20 fishes before being caught, 
//you will reach the success screen, and win the game. To help avoid the polar bears, 
//you can slide to move faster, but you can not turn while doing so. To start the game, 
//click on the penguin after the animation has finished.

frameRate(60);//60 frames per second
angleMode = "radians";

var tilemap = [
        "wwwwwwwwwwwwwwwwwwwwww",
        "wf-b-------ww-------fw",
        "w-wwwwwwww----w--ww-ww",
        "w-wwwwf----wwww wwwfww",
        "w----------wwf-------w",
        "w-w---w-------w------w",
        "wfw-wfw-f----ww www--w",
        "w-w---w----ww-----w--w",
        "w-------ww--f-w--fw--w",
        "w-w-wwwww--wwww www--w",
        "w---------------wf---w",
        "wf---w-www-p--w------w",
        "w----wf-----www ww-www",
        "www--------wwf-------w",
        "w---w----w----www----w",
        "w----w---w---------f-w",
        "w--w--w--w---wwwwwww-w",
        "w--wf--wf----wf--w---w",
        "w---ww--w-ww-w-------w",
        "w-----w---w--w-------w",
        "wf-w-------------wb-fw",
        "wwwwwwwwwwwwwwwwwwwwww",];

var walls = [];
var bear = [];
var penguin = [];
var fish = [];
var keys = [];
var air;

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



var game = new uI();






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

penguinObj.prototype.act = function(){
    /*
    if(mouseIsPressed){
        this.pos.x = mouseX;
        this.pos.y = mouseY;
    }
    */
    if(keys[0] && !this.slide)
    {
     this.pos.x += sin(this.angle)*1;
	 this.pos.y += cos(this.angle)*1;   
    }
    if(keys[1] && !this.slide)
    {
     this.pos.x -= sin(this.angle)*1;
	 this.pos.y -= cos(this.angle)*1;   
    }
    if(keys[2] && !this.slide)
    {
        this.angle = this.angle+PI/45;
    }
    if(keys[3] && !this.slide)
    {
        this.angle = this.angle-PI/45;
    }
    if(keys[4])
    {
     this.slide=true;
     if(frameCount-this.charge>5){
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
      if(mag(this.pos.x-walls[i].pos.x,this.pos.y-walls[i].pos.y) < mag(this.pos.x-walls[near].pos.x,this.pos.y-walls[near].pos.y)){
          near = i;
      }
   }
      
      
      if(abs(this.pos.x-walls[near].pos.x)<=18 &&abs(this.pos.y-walls[near].pos.y)<=18){
          
          if(game.handicap){
              this.angle+=PI/70;
          }
          
          var right = new PVector(walls[near].pos.x-10, walls[near].pos.y);
          var left = new PVector(walls[near].pos.x+10, walls[near].pos.y);
          var up = new PVector(walls[near].pos.x, walls[near].pos.y+10);
          var down = new PVector(walls[near].pos.x, walls[near].pos.y-10);
         
         var normalwall = Math.min(mag(this.pos.x-right.x,this.pos.y-right.y), mag(this.pos.x-left.x,this.pos.y-left.y), mag(this.pos.x-up.x,this.pos.y-up.y),mag(this.pos.x-down.x,this.pos.y-down.y));
        // println(normalwall);
        var speed;
        if(this.slide){
            speed = 2.86;
        }
        else{
         speed=1.43;   
        }
         if(normalwall === mag(this.pos.x-right.x,this.pos.y-right.y)){
             this.pos.x -= speed;
         }
         else if(normalwall === mag(this.pos.x-left.x,this.pos.y-left.y)){
             this.pos.x += speed;
         }
         else if(normalwall===mag(this.pos.x-up.x,this.pos.y-up.y)){
             this.pos.y += speed;
         }
         else if(normalwall===mag(this.pos.x-down.x,this.pos.y-down.y)){
             this.pos.y -= speed;
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

var bearObj = function(x,y){
   this.pos = new PVector(x, y);
    this.angle = 0;
    this.chase = false;
    this.attention = 0;
    //this.wait = true;
    this.travel = new PVector(x, y);
    //this.stress = 0;
    this.stuck = false;
    this.capture = false;
    this.real = false;
    this.path = [];
    this.searcher = [];
    this.targTP = new PVector(x, y);
    this.TM2D= new Array(tilemap.length);

    for (var i = 0; i < tilemap.length; i++) { 
        this.TM2D[i] = new Array(tilemap[i].length); 
    } 
    
};


bearObj.prototype.clean = function(){
for (var i = 0; i< tilemap.length; i++) {
            for (var j =0; j < tilemap[i].length; j++) {
                if(tilemap[i][j]==='w'){
                    this.TM2D[i][j] = 'w';
                }
                else{
                    this.TM2D[i][j] = '-';
                }
            }
    }
    
for(var i = 0; i< bear.length;i++){
        this.TM2D[Math.round((bear[i].pos.y+10)/20)][Math.round((bear[i].pos.x+10)/20)]='w';
        //println(Math.round((bear[i].pos.y+10)/20)+" "+Math.round((bear[i].pos.x+10)/20));
    }
};

var spot = function(x,y,c){
    
  this.pos = new PVector(x, y);
  this.cost =c;
};

bearObj.prototype.pathchange = function(){
     stroke(255, 0, 136);
             strokeWeight(10);
    var posT = new PVector(Math.round((this.pos.x+10)/20),Math.round((this.pos.y+10)/20));
    var targT = new PVector(Math.round((penguin[0].pos.x+10)/20),Math.round((penguin[0].pos.y+10)/20));
    var cost = mag(posT.x-targT.x,posT.y-targT.y);
    
    var spotC = new spot(posT.x,posT.y,cost);
    
    
    this.TM2D[posT.y][posT.x]='p';
    
    var searcher = [];
    var k;
    var toInt;
    while(spotC.pos.x!==targT.x || spotC.pos.y !== targT.y){
    
    
    
    
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            if(this.TM2D[spotC.pos.y+j-1][spotC.pos.x+i-1]==='-' && this.TM2D[spotC.pos.y+j-1][spotC.pos.x]!=='w' && this.TM2D[spotC.pos.y][spotC.pos.x+i-1]!=='w'){
                
                this.TM2D[spotC.pos.y+j-1][spotC.pos.x+i-1]= i+j*3;
                
               cost = mag(spotC.pos.x+i-1-targT.x,spotC.pos.y+j-1-targT.y)+mag(spotC.pos.x+i-1-spotC.pos.x,spotC.pos.y+j-1-spotC.pos.y);
                k = 0;
                //point((spotC.pos.x+i-1)*20-10,(spotC.pos.y+j-1)*20-10);
    //text(spotC.cost,(spotC.pos.x+i-1)*20-10-15,(spotC.pos.y+j-1)*20-10);
                while(k<searcher.length && cost>searcher[k].cost)
                {
                    k++;
                }
                
                searcher.splice(k, 0, new spot(spotC.pos.x+i-1,spotC.pos.y+j-1,cost));
                //point((spotC.pos.x)*20-10,(spotC.pos.y)*20-10);
    //text(spotC.cost,(spotC.pos.x)*20-10-15,(spotC.pos.y)*20-10);
            } 
        }
    }
    
    spotC = searcher.shift();
    
    //println(searcher[0].cost+" "+searcher[searcher.length-1].cost);
    //println(spotC.cost);
    }
        this.path = [];
        var dir = this.TM2D[spotC.pos.y][spotC.pos.x];
        var dirP = 9;
        
        
        while(dir!=='p'){
            if(dir!==dirP){
            this.path.unshift(new PVector(spotC.pos.x,spotC.pos.y));
            dirP = dir;
            //point((spotC.pos.x)*20-10,(spotC.pos.y)*20-10);
            }
            /*
            println("xpos: "+ spotC.pos.x);
            println("ypos: "+ spotC.pos.y);
            println("dir: "+ this.TM2D[spotC.pos.y][spotC.pos.x]);
            println("TDvalx: "+ (this.TM2D[spotC.pos.y][spotC.pos.x]%3-1));
            println("TDvaly: "+ (Math.floor(this.TM2D[spotC.pos.y][spotC.pos.x]/3)-1));
           */

            spotC.pos.x = spotC.pos.x-(dir%3-1);
            spotC.pos.y = spotC.pos.y-(Math.floor(dir/3)-1);
            dir = this.TM2D[spotC.pos.y][spotC.pos.x];
        }
       // for(var k = 0; k < this.path.length;k++){
            
    //println(this.path[k].x+" "+this.path[k].y);
      //  }
};

bearObj.prototype.act = function(){
    var turn;
    
    if(mag(penguin[0].pos.x-this.pos.x,penguin[0].pos.y-this.pos.y)<13){
        
        turn = atan2(penguin[0].pos.x-this.pos.x,penguin[0].pos.y-this.pos.y) - this.angle;
    }
    else{
    
        
    
    if(Math.round((penguin[0].pos.x+10)/20)!==this.targTP.x || Math.round((penguin[0].pos.y+10)/20)!==this.targTP.y){
     this.clean();
     this.pathchange();
     this.targTP.x =Math.round((penguin[0].pos.x+10)/20);
     this.targTP.y =Math.round((penguin[0].pos.y+10)/20);
    }
    
    if(mag(this.path[0].x*20-10-this.pos.x,this.path[0].y*20-10-this.pos.y)<1){
     this.path.shift();   
    }
    
    turn = atan2(this.path[0].x*20-10-this.pos.x,this.path[0].y*20-10-this.pos.y) - this.angle;

    //println(this.path[0].x);
    //point((this.path[0].x)*20-10,(this.path[0].y)*20-10);
    while(turn > PI){
     turn-=2*PI;   
    }
    while(turn <-PI){
     turn+=2*PI;   
    }
    
    if(abs(turn)<PI/10){
    this.angle += turn;
    }
    else{
        
        //this.angle = atan2(this.path[0].x*20-10-this.pos.x,this.path[0].y*20-10-this.pos.y);
    this.angle+=PI/10*turn/abs(turn);
    }
    
    this.pos.x += sin(this.angle)*1;
    this.pos.y += cos(this.angle)*1;
    }
    
    if(abs(this.pos.x-penguin[0].pos.x)<15 &&abs(this.pos.y-penguin[0].pos.y)<20){
     game.ended = true;
     game.pause = true;
     this.capture = true;
     this.real = true;
     penguin[0].capture = true;
      }
};

bearObj.prototype.draw = function() {
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(PI);
    rotate(-this.angle);
    fill(255, 255, 255);
    stroke(0,0,0);
    strokeWeight(1);
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
    //if(!game.pause || this.real){
    this.angle+=PI/75;
    //}
     }
     popMatrix();
};

var wallObj = function(x, y) {
    this.pos = new PVector(x,y);
};

wallObj.prototype.draw = function() {
    //fill(33, 43, 222);
    noStroke();
    fill(133, 221, 237);
   rect(this.pos.x-10, this.pos.y-10, 20, 20);
};





var fishObj = function(x,y){
    this.pos = new PVector(x, y);
    this.turn=-1;
    this.active = true;
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


//snowflake
var snow = function(){
 this.pos = new PVector(0, 0);
 this.active = false;
};

snow.prototype.draw = function() {
    stroke(255, 255, 255);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
};

//holder of snowflakes and fishes
var sky = function(){
 this.cloud = [];
 for(var i = 0; i < 30; i++){
 this.cloud.push(new snow());
 }
 this.count = 0;
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
var air = new sky();


var initTilemap = function() {
    walls = [];
    penguin = [];
    bear = [];
    fish = [];
   // air.cloud = [];
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
            }
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
    //text("Decoys: "+ penguin[0].power, 175, 395);
    if(this.pause){//initial state
       fill(97, 5, 97);
        textSize(14);
        text("Its Time to Eat!", 165, 95);
        fill(97, 5, 97);
        textSize(12);
        text("Collect all 20 of the fishes to get your fill.", 90, 130);
        text("Avoid hungry polar bears who will try to chase you down.", 90, 147);
        text("Be careful, they will work together to try and cut you off!", 90, 164);
        fill(9, 110, 9);
        textSize(14);
        text("Click Anywhere to Begin", 130, 190);
        textSize(10);
        fill(9, 110, 9);
        text("Up/Down Keys: Move forwards/backwards", 130, 215);
        text("Left/Right Keys: Turn left/right", 130, 230);
        text("Spacebar: Slide", 130, 245);
        //text("H: Handicap (stop and turns player back abit", 130, 260);
        //text("     whenever player touches a wall)", 130, 275);
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
        text("Avoid hungry polar bears who will try ", 100, 147+shift1);
        text("to chase you down. Be careful, they will", 100, 164+shift1);
        text("work together and try to cut you off.", 100, 181+shift1);
        fill(9, 110, 9);
        textSize(14);
        var shift2 = 70;
        text("Controls", 170, 195 + shift2);
        textSize(10);
        fill(9, 110, 9);
        text("Up/Down Keys: Move forwards/backwards", 130, 215+ shift2);
        text("Left/Right: Turn left/right", 130, 230+ shift2);
        text("Spacebar: Slide", 130, 245+ shift2);
        //text("Spacebar: Send out decoy", 130, 260+ shift2);
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
    

uI.prototype.reset = function() {
    initTilemap();
    this.pause = false;
    this.ended = false;
    this.winner = false;
};
//key presses
keyPressed = function() {

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
    if(keyCode === 32)//shift
    {
        keys[4] = true; 
    }
    

};
//key releases
keyReleased = function() {

    if(keyCode === 38)//w
    {
     keys[0] = false;
    }
if(keyCode === 40)//s
    {
        keys[1] = false; 
    }
    if(keyCode === 37)//a
    {
       keys[2] = false; 
    }
    if(keyCode === 39)//d
    {
        keys[3] = false; 
    }
    if(keyCode === 32)//shift
    {
        keys[4] = false; 
        
    }
    
    
    
    if(keyCode === 72)//h (toggles handicap)
    {
        game.handicap =  !game.handicap;
    }
};
var mouseReleased = function() {
    //penguin[0].pos.x = mouseX - game.trans.x;
    //penguin[0].pos.y = mouseY - game.trans.y;
    
    if(game.start && frameCount > 350 && mouseX >200-30 && mouseX <200+30 && mouseY >200-20 && mouseY <200+20){
        game.start = false;
    }
    
    if(game.ended){
        if(game.winner){
         air = new sky();   
        }
        game.reset();//reset
        
        }
};
initTilemap();
//game.pause = false;
var draw = function() {
    
       if(frameCount-game.zoom<50)
    {
    game.starting();
    }
    else{
    background(219, 219, 219);
    
    //translate(0, -600);
    for (var i=0; i<fish.length; i++) {
        fish[i].draw();
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
    game.draw();
    //if(!game.pause || penguin[0].score === 20){
       //println(air.cloud[0].pos.y);
    air.act();
    //}
    
    }
};








}};
