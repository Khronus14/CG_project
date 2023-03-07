'use strict';

// Global variables that are set and used
// across the application
let gl, finalProgram;
let useShading = 0;
let partyMode = false;
let viewMode = false;

// GLSL programs

// VAOs for the objects
let theMoon = null;
let theMountain = null;
let theWaterTop = null;
let theWater = null;
let aWall = null;

// textures
let moonTexture;
let mountain1Texture;
let mountain2Texture;
let mountain3Texture;
let waterTexture;
let waterTopTexture;
let nasaTexture;
let partyTexture;
let tallMountTexture;
let altMountTexture;
let spaceTexture;

// light position
let lightPOS = [-10.0, 0, 10.0];

// rotation
let angles = [0.0, 0.0, 0.0];
let angleInc = 5.0;

// array to hold values of placement and translations of the walls
// back - front - left - right - top - bottom
// element description: [trans-x, trans-y, trans-z, rot-x, rot-y]
let wLayout = [
    [  0,   0, -15,   0,   0],
    [  0,   0,  15,   0, 180],
    [-15,   0,   0,   0,  90],
    [ 15,   0,   0,   0, 270],
    [  0,  15,   0,  90,   0],
    [  0, -15,   0, 270,   0]
];

// array to hold values of placement and type of mountain to draw
// rows of mountains are listed from back (1) to front (9)
// element description: [x coord, z coord, index to mountain transform/texture]
let mLayout = [
    [ 0.0, -2.5, 0], // row 1
    [-0.6, -2.0, 1], // row 2
    [ 0.8, -2.0, 0],
    [-2.0, -1.5, 0], // row 3
    [-1.3, -1.5, 0],
    [ 0.3, -1.5, 0],
    [ 1.8, -1.5, 1],
    [-2.3, -1.0, 0], // row 4
    [-0.9, -1.0, 1],
    [ 0.1, -1.0, 0],
    [ 1.2, -1.0, 2],
    [ 2.3, -1.0, 0],
    [-2.5,  0.0, 0], // row 5
    [-2.0,  0.0, 1],
    [-1.3,  0.0, 0],
    [-0.7,  0.0, 0],
    [ 0.0,  0.0, 1],
    [ 0.8,  0.0, 2],
    [ 1.7,  0.0, 1],
    [ 2.5,  0.0, 0],
    [-2.3,  1.0, 0], // row 6
    [-1.4,  1.0, 1],
    [-0.4,  1.0, 1],
    [ 0.8,  1.0, 1],
    [ 1.7,  1.0, 0],
    [ 2.3,  1.0, 0],
    [-1.8,  1.5, 1], // row 7
    [-0.9,  1.5, 0],
    [ 0.1,  1.5, 0],
    [ 0.8,  1.5, 0],
    [ 2.0,  1.5, 0],
    [-0.8,  2.0, 0], // row 8
    [ 0.6,  2.0, 0],
    [ 1.5,  2.0, 0],
    [-0.1,  2.5, 0] // row 9
];
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
    theMoon = new Sphere(40,40);
    theMoon.VAO = bindVAO(theMoon);

    theMountain = new Cone(20,1);
    theMountain.VAO = bindVAO(theMountain);

    theWaterTop = new Circle(40);
    theWaterTop.VAO = bindVAO(theWaterTop);

    theWater = new Sphere(40,40);
    theWater.VAO = bindVAO(theWater);

    aWall = new Square(1);
    aWall.VAO = bindVAO(aWall);
}

//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera() {
    // set up your projection and view
    let projMatrix = glMatrix.mat4.create();
    let viewMatrix = glMatrix.mat4.create();
    if (viewMode) {
        glMatrix.mat4.perspective(projMatrix, radians(90), 1, 1.0, 300.0);
        glMatrix.mat4.lookAt(viewMatrix, [-5, 4, 8], [0, 0, 0], [0, 1, 0]);
    } else {
        glMatrix.mat4.ortho(projMatrix, -8, 8, -8, 8, 1.0, 300.0);
        glMatrix.mat4.lookAt(viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    }
    gl.uniformMatrix4fv(finalProgram.uProjT, false, projMatrix);
    gl.uniformMatrix4fv(finalProgram.uViewT, false, viewMatrix);
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    // get some texture space from the gpu
    nasaTexture = gl.createTexture();
    // load the actual image
    const moonImage = new Image();
    moonImage.src = 'moon-texture.jpg';
    moonImage.onload = () => {
        doLoad(nasaTexture, moonImage);
    };

    tallMountTexture = gl.createTexture();
    const m1Image = new Image();
    m1Image.src = 'mountain1-texture.jpg';
    m1Image.onload = () => {
        doLoad(tallMountTexture, m1Image);
    };

    mountain2Texture = gl.createTexture();
    const m2Image = new Image();
    m2Image.src = 'mountain2-texture.jpg';
    m2Image.onload = () => {
        doLoad(mountain2Texture, m2Image);
    };

    mountain3Texture = gl.createTexture();
    const m3Image = new Image();
    m3Image.src = 'mountain3-texture.jpg';
    m3Image.onload = () => {
        doLoad(mountain3Texture, m3Image);
    };

    waterTexture = gl.createTexture();
    const waterImage = new Image();
    waterImage.src = 'water-texture.jpg';
    waterImage.onload = () => {
        doLoad(waterTexture, waterImage);
    };

    waterTopTexture = gl.createTexture();
    const waterTopImage = new Image();
    waterTopImage.src = 'watertop-texture.jpg';
    waterTopImage.onload = () => {
        doLoad(waterTopTexture, waterTopImage);
    };

    partyTexture = gl.createTexture();
    const partyImage = new Image();
    partyImage.src = 'party-texture.jpg';
    partyImage.onload = () => {
        doLoad(partyTexture, partyImage);
    };

    altMountTexture = gl.createTexture();
    const altMountImage = new Image();
    altMountImage.src = 'alt-mount-texture.jpg';
    altMountImage.onload = () => {
        doLoad(altMountTexture, altMountImage);
    };

    spaceTexture = gl.createTexture();
    const spaceImage = new Image();
    spaceImage.src = 'space-texture.jpg';
    spaceImage.onload = () => {
        doLoad(spaceTexture, spaceImage);
    };
}

function doLoad(theTexture, theImage) {
    // bind the texture, so we can perform operations on it
    gl.bindTexture(gl.TEXTURE_2D, theTexture);

    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, theImage);

    // set texturing parameters
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    draw();
}

function setUpPhong() {
    // set values for all shading uniform variables
    gl.uniform3fv(finalProgram.ambientLight, [1.0, 1.0, 1.0]);
    gl.uniform3fv(finalProgram.lightPosition, lightPOS);
    gl.uniform3fv(finalProgram.lightColor, [1.0, 1.0, 1.0]);
    gl.uniform3fv(finalProgram.baseColor, [0.2, 0.2, 0.9]);
    gl.uniform3fv(finalProgram.specHighlightColor, [1.0, 1.0, 1.0]);
    gl.uniform1f(finalProgram.ka, 0.7);
    gl.uniform1f(finalProgram.kd, 0.9);
    gl.uniform1f(finalProgram.ks, 0.3);
    gl.uniform1f(finalProgram.ke, 20.0);
}

//  This function draws all the shapes required for your scene
function drawShapes() {
    // rotation transform
    let rotationMatrix = glMatrix.mat4.create();
    glMatrix.mat4.rotateX(rotationMatrix, rotationMatrix, radians(angles[0]));
    glMatrix.mat4.rotateY(rotationMatrix, rotationMatrix, radians(angles[1]));
    glMatrix.mat4.rotateZ(rotationMatrix, rotationMatrix, radians(angles[2]));

    // moon transform
    let moonMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(moonMatrix, moonMatrix, [-1.0, 3.4, 0]);
    glMatrix.mat4.multiply(moonMatrix, rotationMatrix, moonMatrix);
    glMatrix.mat4.rotateY(moonMatrix, moonMatrix, radians(180));
    glMatrix.mat4.scale(moonMatrix, moonMatrix, [2.5, 2.5, 2.5]);

    // water top transform
    let waterTopMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(waterTopMatrix, waterTopMatrix, [0, -0.5, 0]);
    glMatrix.mat4.multiply(waterTopMatrix, rotationMatrix, waterTopMatrix);
    glMatrix.mat4.scale(waterTopMatrix, waterTopMatrix, [6, 1, 6]);

    // water transform
    let waterMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(waterMatrix, waterMatrix, [0, -0.5, 0]);
    glMatrix.mat4.multiply(waterMatrix, rotationMatrix, waterMatrix);
    glMatrix.mat4.rotateY(waterMatrix, waterMatrix, radians(180));
    glMatrix.mat4.scale(waterMatrix, waterMatrix, [6, 6, 6]);

    // wall transform
    let wallMatrix = glMatrix.mat4.create();
    glMatrix.mat4.scale(wallMatrix, wallMatrix, [30, 30, 1]);

    // mountain transforms
    let tallMountMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(tallMountMatrix, tallMountMatrix, [0, 2, 0]);
    glMatrix.mat4.scale(tallMountMatrix, tallMountMatrix, [1.5, 5, 1.5]);

    let medMountMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(medMountMatrix, medMountMatrix, [0, 1, 0]);
    glMatrix.mat4.scale(medMountMatrix, medMountMatrix, [1.3, 3, 1.3]);

    let smallMountMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(smallMountMatrix, smallMountMatrix, [0, 0.75, 0]);
    glMatrix.mat4.scale(smallMountMatrix, smallMountMatrix, [1, 2.5, 1]);

    // updating variables based on mode
    if (partyMode) {
        moonTexture = partyTexture;
        mountain1Texture = altMountTexture;
        gl.uniform3fv(finalProgram.lightColor, [1.0, 0.3, 1.0]);
    } else {
        moonTexture = nasaTexture;
        mountain1Texture = tallMountTexture;
        gl.uniform3fv(finalProgram.lightColor, [1.0, 1.0, 1.0]);
    }
    // set rotation matrix uniform to rotate light position
    gl.uniformMatrix4fv(finalProgram.uRotMatrix, false, rotationMatrix);
    gl.uniform3fv(finalProgram.lightPosition, lightPOS);

    // arrays to use during drawing for loop
    let objectArray = [theMoon, theWaterTop, theWater, aWall, theMountain];
    let textureArray = [moonTexture, waterTopTexture, waterTexture, spaceTexture,
                        [mountain3Texture, mountain2Texture, mountain1Texture]];
    let transformArray = [moonMatrix, waterTopMatrix, waterMatrix, wallMatrix,
                          [smallMountMatrix, medMountMatrix, tallMountMatrix]];

    // for loop to draw each element in scene
    for (let i = 0; i < objectArray.length; i++) {
        // check value to use texture
        gl.uniform1i (finalProgram.uWallCheck, 0);
        gl.uniform1i (finalProgram.uShadeCheck, useShading);
        gl.uniform1i (finalProgram.uWaterCheck, i);
        // draw moon and water
        if (i < 3) {
            // set up texture uniform & other uniforms that you might
            // have added to the shader
            gl.activeTexture (gl.TEXTURE0);
            gl.bindTexture (gl.TEXTURE_2D, textureArray[i]);
            gl.uniform1i (finalProgram.uTheTexture, 0);

            //Bind the VAO and draw
            gl.uniformMatrix4fv(finalProgram.uModelT, false, transformArray[i]);
            gl.bindVertexArray(objectArray[i].VAO);
            gl.drawElements(gl.TRIANGLES, objectArray[i].indices.length, gl.UNSIGNED_SHORT, 0);
        // draw walls
        } else if (i === 3) {
            gl.uniform1i (finalProgram.uWallCheck, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureArray[i]);
            gl.uniform1i(finalProgram.uTheTexture, 0);

            // draw same object 6 times, just different transform
            let moveWallMatrix;
            for (let j = 0; j < 6; j++) {
                moveWallMatrix = glMatrix.mat4.create();
                glMatrix.mat4.translate(moveWallMatrix, moveWallMatrix, [wLayout[j][0], wLayout[j][1], wLayout[j][2]]);
                glMatrix.mat4.rotateX(moveWallMatrix, moveWallMatrix, radians(wLayout[j][3]));
                glMatrix.mat4.rotateY(moveWallMatrix, moveWallMatrix, radians(wLayout[j][4]));
                glMatrix.mat4.multiply(moveWallMatrix, rotationMatrix, moveWallMatrix);
                glMatrix.mat4.multiply(moveWallMatrix, moveWallMatrix, transformArray[i]);

                gl.uniformMatrix4fv(finalProgram.uModelT, false, moveWallMatrix);
                gl.bindVertexArray(objectArray[i].VAO);
                gl.drawElements(gl.TRIANGLES, objectArray[i].indices.length, gl.UNSIGNED_SHORT, 0);
            }
        // draw mountains
        } else {
            gl.uniform1i (finalProgram.uWallCheck, 0);
            let moveMountMatrix;
            for (let k = 0; k < mLayout.length; k++) {
                gl.activeTexture (gl.TEXTURE0);
                gl.bindTexture (gl.TEXTURE_2D, textureArray[i][mLayout[k][2]]);
                gl.uniform1i (finalProgram.uTheTexture, 0);

                moveMountMatrix = glMatrix.mat4.create();
                glMatrix.mat4.translate(moveMountMatrix, moveMountMatrix, [mLayout[k][0], 0, mLayout[k][1]]);
                glMatrix.mat4.multiply(moveMountMatrix, rotationMatrix, moveMountMatrix);
                glMatrix.mat4.multiply(moveMountMatrix, moveMountMatrix, transformArray[i][mLayout[k][2]]);

                gl.uniformMatrix4fv(finalProgram.uModelT, false, moveMountMatrix);
                gl.bindVertexArray(objectArray[i].VAO);
                gl.drawElements(gl.TRIANGLES, objectArray[i].indices.length, gl.UNSIGNED_SHORT, 0);
            }
        }
    }
}


//
// Use this function to create all the programs that you need
// You can make use of the auxiliary function initProgram
// which takes the name of a vertex shader and fragment shader
//
// Note that after successfully obtaining a program using the initProgram
// function, you will need to assign locations of attribute and uniform variable
// based on the in variables to the shaders.   This will vary from program
// to program.
//
function initPrograms(vertexid, fragmentid) {
    // set up the per-vertex program
    const vertexShader = getShader(vertexid);
    const fragmentShader = getShader(fragmentid);

    // Create a program
    finalProgram = gl.createProgram();

    // Attach the shaders to this program
    gl.attachShader(finalProgram, vertexShader);
    gl.attachShader(finalProgram, fragmentShader);
    gl.linkProgram(finalProgram);

    if (!gl.getProgramParameter(finalProgram, gl.LINK_STATUS)) {
        console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(finalProgram);

    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    finalProgram.aVertexPosition = gl.getAttribLocation(finalProgram, 'aVertexPosition');
    finalProgram.aNormal = gl.getAttribLocation(finalProgram, 'aNormal');
    finalProgram.aUV = gl.getAttribLocation(finalProgram, 'aUV');

    // uniforms - you will need to add references for any additional
    // uniforms that you add to your shaders

    // coordinate uniforms
    finalProgram.uModelT = gl.getUniformLocation (finalProgram, 'modelT');
    finalProgram.uViewT = gl.getUniformLocation (finalProgram, 'viewT');
    finalProgram.uProjT = gl.getUniformLocation (finalProgram, 'projT');
    finalProgram.uRotMatrix = gl.getUniformLocation (finalProgram, 'rotMatrix');

    // lighting uniforms
    finalProgram.ambientLight = gl.getUniformLocation (finalProgram, 'ambientLight');
    finalProgram.lightPosition = gl.getUniformLocation (finalProgram, 'lightPosition');
    finalProgram.lightColor = gl.getUniformLocation (finalProgram, 'lightColor');
    finalProgram.baseColor = gl.getUniformLocation (finalProgram, 'baseColor');
    finalProgram.specHighlightColor = gl.getUniformLocation (finalProgram, 'specHighlightColor');
    finalProgram.ka = gl.getUniformLocation (finalProgram, 'ka');
    finalProgram.kd = gl.getUniformLocation (finalProgram, 'kd');
    finalProgram.ks = gl.getUniformLocation (finalProgram, 'ks');
    finalProgram.ke = gl.getUniformLocation (finalProgram, 'ke');

    // texture uniforms
    finalProgram.uTheTexture = gl.getUniformLocation (finalProgram, 'theTexture');
    finalProgram.uShadeCheck = gl.getUniformLocation(finalProgram, "shadeCheck");
    finalProgram.uWaterCheck = gl.getUniformLocation(finalProgram, "waterCheck");
    finalProgram.uWallCheck = gl.getUniformLocation(finalProgram, "wallCheck");
}

// creates a VAO and returns its ID
function bindVAO (shape) {
    //create and bind VAO
    let theVAO = gl.createVertexArray();
    gl.bindVertexArray(theVAO);

    // create and bind vertex buffer
    let myVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(finalProgram.aVertexPosition);
    gl.vertexAttribPointer(finalProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    let normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(finalProgram.aNormal);
    gl.vertexAttribPointer(finalProgram.aNormal, 3, gl.FLOAT, false, 0, 0);

    // add code for any additional vertex attribute
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(finalProgram.aUV);
    gl.vertexAttribPointer(finalProgram.aUV, 2, gl.FLOAT, false, 0, 0);

    // Setting up the IBO
    let myIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

    // clean up
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return theVAO;
}


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (script.type === 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
        return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

// We call draw to render to our canvas
function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
        console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
        return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
    }

    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    // Set the clear color to be black
    gl.clearColor(0.0,0.3,0.3,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);

    // Read, compile, and link your shaders
    initPrograms('vertexShader', 'fragmentShader');

    // create and bind your current object
    createShapes();

    setUpCamera();

    setUpTextures();

    setUpPhong();

    draw();
}
