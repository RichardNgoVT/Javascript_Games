var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);


// Richard Ngo
// ECE 4525, Hsiao
// 11/22/2019

//Description
//shown is a chair that you can rotate around by holding down a mousekey, 
//and moving the mouse around. Built off example code shown in class

angleMode = "radians";

var backgroundColour = color(255, 255, 255);
var nodeColour = color(40, 168, 107);
var edgeColour = color(34, 68, 204);
var nodeSize = 8;

var createCuboid = function(x, y, z, w, h, d) {
    var nodes = [[x,   y,   z  ],
                 [x,   y,   z+d],
                 [x,   y+h, z  ],
                 [x,   y+h, z+d],
                 [x+w, y,   z  ],
                 [x+w, y,   z+d],
                 [x+w, y+h, z  ],
                 [x+w, y+h, z+d]];
                  
    var faces = [[[0, 1], [1, 3], [3, 2], [2, 0]],
                [[4, 5], [5, 7], [7, 6], [6, 4]],
                [[0, 4], [4, 5], [5, 1], [1, 0]],
                [[2, 6], [6, 7], [7, 3], [3, 2]],
                [[0, 2], [2, 6], [6, 4], [4, 0]],
                [[1, 3], [3, 7], [7, 5], [5, 1]]];
    
    
    return { 'nodes': nodes, 'faces':faces};
};



    
    
 
var shape0 = createCuboid(-70, -180, 0, 10, 220, 10);
var shape1 = createCuboid(70, -180, 0, 10, 220, 10);
//var shape0 = createCuboid(-70, -242, 0, 10, 280, 10);
//var shape1 = createCuboid(70, -242, 0, 10, 280, 10);
var shape2 = createCuboid(50, -155, 2.5, 10, 175, 5);
var shape3 = createCuboid(30, -155, 2.5, 10, 175, 5);
var shape4 = createCuboid(10, -155, 2.5, 10, 175, 5);
var shape5 = createCuboid(-10, -155, 2.5, 10, 175, 5);
var shape6 = createCuboid(-30, -155, 2.5, 10, 175, 5);
var shape7 = createCuboid(-50, -155, 2.5, 10, 175, 5);
var shape8 = createCuboid(-60, 20, 0, 130, 5, 10);
var shape9 = createCuboid(-60, -160, 0, 130, 5, 10);
var shape10 = createCuboid(-70, 40, 0, 150, 10, 170);
var shape11 = createCuboid(-70, 50, 0, 10, 160, 10);
var shape12 = createCuboid(70, 50, 0, 10, 160, 10);
var shape13 = createCuboid(70, 50, 160, 10, 160, 10);
var shape14 = createCuboid(-70, 50, 160, 10, 160, 10);
var shape13 = createCuboid(70, 50, 160, 10, 160, 10);
var shape14 = createCuboid(-70, 50, 160, 10, 160, 10);
var shape15 = createCuboid(-72.5, -50, 10, 15, 5, 170);
var shape16 = createCuboid(67.5, -50, 10, 15, 5, 170);
var shape17 = createCuboid(70, -50, 160, 10, 90, 10);
var shape18 = createCuboid(-70, -50, 160, 10, 90, 10);
var shape19 = createCuboid(-70, 80, 10, 10, 10, 150);
var shape20 = createCuboid(70, 80, 10, 10, 10, 150);
//var shape21 = createCuboid(-100, -245, -10, 200, 2, 260);



var shapes = [shape1, shape2,shape10,shape8, shape3, shape4, shape5,shape6, shape7, shape0, shape9, shape11,shape12,shape13,shape14, shape15, shape16, shape17,shape18, shape19, shape20];

/*
var shape1 = createCuboid(-120, -20, -20, 240, 40, 40);
var shape2 = createCuboid(-120, -50, -30, -20, 100, 60);
var shape3 = createCuboid( 120, -50, -30,  20, 100, 60);
var shapes = [shape1, shape2, shape3];
*/
// Rotate shape around the z-axis
var rotateZ3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
};

var rotateY3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
};

var rotateX3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};

//rotateZ3D(30);
//rotateY3D(30);
//rotateX3D(30);

var draw= function() {
    background(backgroundColour);
    var nodes, faces;
    
    // Draw edges
    stroke(edgeColour);
    var faceSort = [];
    var shapeChoose = [];
    var distances = [];
    var s;
    var d;
    var dc;
    var avgd;
    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var nodes = shapes[shapeNum].nodes;
        var faces = shapes[shapeNum].faces;
        
        for (var f = 0; f < faces.length; f++) {
             
             //d = nodes[faces[f][0][0]][2];
             d = Math.pow(Math.pow(0-nodes[faces[f][0][0]][0],2)+Math.pow(0-nodes[faces[f][0][0]][1],2)+Math.pow(-400-nodes[faces[f][0][0]][2],2),(1/2));
             for (var e = 0; e < faces[f].length; e++) {
                 dc = Math.pow(Math.pow(0-nodes[faces[f][e][1]][0],2)+Math.pow(0-nodes[faces[f][e][1]][1],2)+Math.pow(-400-0-nodes[faces[f][e][1]][2],2),(1/2));
                //if(nodes[faces[f][e][1]][2]<d){
                if(d<dc){
                    //d = nodes[faces[f][e][1]][2];
                    d=dc;
                }
               // println(nodes[faces[f][e][0]][2]);
                   // println(nodes[faces[f][e][1]][2]);
                   line(nodes[faces[f][e][0]][0], nodes[faces[f][e][0]][1],nodes[faces[f][e][1]][0], nodes[faces[f][e][1]][1]);
             }
               s = 0;
                while(s<distances.length && d>distances[s])
                {
                    s++;
                }
                
                distances.splice(s, 0, d);
                shapeChoose.splice(s, 0, shapeNum);
                var edges = shapes[shapeNum].faces[f];
                faceSort.splice(s, 0, edges);
           
            /*
            s
            
            beginShape();
            vertex(nodes[faces[f][0][0]][0], nodes[faces[f][0][0]][1]);
            for (var e = 0; e < faces[f].length; e++) {
                vertex(nodes[faces[f][e][1]][0], nodes[faces[f][e][1]][1]);
            }
             endShape();
             */
        }
            
    }
    fill(nodeColour);
    strokeWeight(2);
    noStroke();
    var chosen = [];
    var chosenP = faceSort[0];
    var skip = false;
    for(var f = 0; f < faceSort.length;f++){
        beginShape();
        for (var e = 0; e < faceSort[f].length; e++) {
            skip = false;
                for (var i = 0; i < chosen.length; i++) {
                  if(chosen[i]===shapeChoose[f]){
                      skip = true;
                  }
                  //##$
                  skip = false;
                
                
                }
                if(!skip){
            fill(50+15*shapeChoose[f], 0+15*shapeChoose[f], 50+0*shapeChoose[f]);
                vertex(shapes[shapeChoose[f]].nodes[faceSort[f][e][1]][0], shapes[shapeChoose[f]].nodes[faceSort[f][e][1]][1]);
                }
                if(chosenP!==shapeChoose[f]){
                   chosen.push(chosenP); 
                }
                chosenP = shapeChoose[f];
                //println(shapeChoose[f]+" "+f);
            }
        endShape();
    }


};

mouseDragged = function() {
    var dx = -mouseX + pmouseX;
    var dy = -mouseY + pmouseY;
    
    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var nodes = shapes[shapeNum].nodes;
        rotateY3D(dx/(20*PI), nodes);
        rotateX3D(dy/(20*PI), nodes);
    }
};

translate(200, 200);









}};
