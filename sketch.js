
let handPose;
let lastDetectedTime = 0; // Variable to control detection frequency
let video;
let myvideo;
let hands = [];

let start = false;

let myWords = [];
let myFrases = [
  "WORTE SIND SCHöN ABER HüHNER LEGEN EIER",
  "TODO AVANCE TECNOLÓGICO ESTÁ EN PELIGRO DE EXTINCIÓN",
  "TIENES QUE APRENDER A AMARTE PERRA",
  "MAGNÍFICAMENTE COLOSAL EXTRAVAGENTE Y ANIMAL"
];

let myWordsStrings = myFrases[0];
let palabras;


let HelveticaBold;
let PPTelegrafUltraBold;
let cSun;
let cRed;
let cAzul;
let cTypo;
let cTypo10;
let cGreen;
let cWhite;
let cBlack;


let CPalette;
let bgColor;
let txtColor;

let pg;
let composition;
let meshIMG = [];

let mainIMG;

let saveMesh;
let canvas;

let saveTimer = null;
let wordCount = -1;
let wDisplayedCount = -1;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
  //HelveticaBold = loadFont('Helvetica-Bold.ttf');
 PPTelegrafUltraBold = loadFont('https://www.dl.dropboxusercontent.com/scl/fi/uysr60635dfz2pal67a6t/PPTelegraf-Ultrabold.ttf?rlkey=9jb4tx24j8zno8eo84vzqu42c&st=xqx8z738');}

function setup() {

  frameRate(30);

  if (frameCount < 60){
    start = true;
  }

  cSun = color(248, 214, 64);
  cRed = color(219, 0, 48, 255);
  cAzul = color(7, 41, 191, 255);
  cTypo = color(38, 56, 71, 255);
  cGreen = color(33, 177, 94);
  cTypo10 = color(233, 235, 237);
  cWhite = color(255, 255, 255);
  cBlack = color(64, 64, 64, 255);

  CPalette = [[cBlack, cRed], [cAzul, cWhite], [cRed,cSun], [cRed,cAzul],[cSun,cRed]];

  canvas = createCanvas(1080, 720, WEBGL);
  canvas.parent('canvas-container'); // Attach canvas to a container div


  videoTex = createGraphics(width, height, WEBGL);
  videoTex.textureMode(NORMAL);
  videoTex.noStroke();


  composition = createGraphics(width, height);
  mainIMG = createGraphics(width, height);
  
  pg = createGraphics(width, height, WEBGL);
  pg.textureMode(NORMAL); // This is so fucking important dont ever forget it again
  pg.noStroke();
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  handPose.detectStart(video, gotHands);

  NewFrase();
  NewColors();
  UpdateObjects();
}

function draw() {
  background(255);


  videoTex.texture(video);
  videoTex.plane(width, height);

  push();
  translate(-width / 2, -height / 2);
  translate(width, 0);
  scale(-1, 1);
  //image(video, 0, 0, width, height);
  mainIMG.push();
  //mainIMG.translate(-width/2, -height/2);
 
  mainIMG.background(cGreen);
  
  mainIMG.image(video, 0, 0, width, height);
 // mainIMG.image(videoTex, 0, 0, width, height); // ✅ WebGL-safe image
  mainIMG.fill(cRed);
  //mainIMG.rect(0,0,width,height);

  
  let maxHands = 2;
  let hand = [];
  let index = [];
  let thumb = [];

  for (let i = 0; i < Math.min(hands.length, maxHands); i++) {
    hand[i] = hands[i];
    index[i] = hand[i].index_finger_tip;
    thumb[i] = hand[i].thumb_tip;
  }

  if (hands.length === 2 && wDisplayedCount < myWordsStrings.length) {
    let corA = createVector(index[0].x, index[0].y);
    let corB = createVector(index[1].x, index[1].y);
    let corC = createVector(thumb[1].x, thumb[1].y);
    let corD = createVector(thumb[0].x, thumb[0].y);

    for (let i = 0; i < myWords.length; i++) {
      if (myWords[i].isActive === true && wDisplayedCount <= myWordsStrings.length) {
        pg.clear();
        
        pg.texture(myWords[i].wIMG);
        //pgmesh(corA, corB, corC, corD, 8); 
        pgmesh(corB, corA, corD, corC, 8); 
      }
    }
  }
  
  for( let i = 0; i <= wDisplayedCount; i++){
    if (meshIMG[i] ) { // Check if it's not undefined or null
      image(meshIMG[i], 0, 0);
      mainIMG.image(meshIMG[i], 0, 0);
      

      composition.push();
      composition.translate(composition.width, 0); // Move origin to the right edge
      composition.scale(-1, 1); // Flip horizontally
      composition.image(meshIMG[i], 0, 0);
      composition.pop();
      
    }
  }

  image(mainIMG, 0, 0);
  image(pg,0,0);

  // same loop as above but with circles so the are on top of the IMGs
  for (let i = 0; i < Math.min(hands.length, maxHands); i++) {
    fill(cRed);
    circle(index[i].x, index[i].y, 5);
    circle(thumb[i].x, thumb[i].y, 5);
  }

  mainIMG.pop();
  pop();
  
  changeWord();

}

function changeWord() {

  if(start == true){
    if (frameCount % (200/ 2) == 0) {

    meshIMG[wDisplayedCount] = pg.get(); // gets the place Image

    wordCount++;
    wDisplayedCount++;

    myWords.forEach(word => word.isActive = false); // set every word inactive -- 
    myWords[wordCount].isActive = true; // only the current one moves with hands
    
    if (wordCount >= myWordsStrings.length - 1){
       wordCount = -1;
    }
    //if (wDisplayedCount > myWordsStrings.length*3){
     //}
  }
  }
  
  
}


function NewFrase(){

  palabras = myFrases[int(random(myFrases.length))];
  myWordsStrings = palabras.split(" ");
  NewColors();
  UpdateObjects();

}

function NewColors(){
    let newPalette = int(random(CPalette.length));
    bgColor = CPalette[newPalette][0];
    txtColor = CPalette[newPalette][1];
}

function UpdateObjects(){
  myWords.length = 0;
 for (let i = 0; i < myWordsStrings.length; i++) {
    myWords[i] = new Word(myWordsStrings[i]);
    myWords[i].createWord();
  }
}


function ResetComposition(){
  wDisplayedCount = -1;
  wordCount = -1;
  meshIMG.length = 0;
  
  pg.clear();
  composition.clear();

  myWords.forEach(word => word.isActive = false);
  NewFrase();
}

function myCanvasSafe(){
  saveCanvas('oscarpekla_Interactive_Experiment', 'png');


  

  savePGManually(composition, 'oscarpekla_Interactive_Experiment_Canvas.png');
}

function savePGManually(pg, filename = 'pgCanvas.png') {
  pg.canvas.toBlob(function(blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}


function pgmesh(p1, p2, p3, p4, n) {

  //adjust for translate

  p1.y = p1.y - pg.height/2;
  p2.y = p2.y - pg.height/2;
  p3.y = p3.y - pg.height/2;
  p4.y = p4.y - pg.height/2;

  p1.x = p1.x - pg.width/2;
  p2.x = p2.x - pg.width/2;
  p3.x = p3.x - pg.width/2;
  p4.x = p4.x - pg.width/2; 


  let invN = 1 / n; // Avoid repeated division
  let Ax = p1.x, Ay = p1.y;
  let Bx = p2.x, By = p2.y;


  for (let y = 0; y < n; y++) {

    pg.beginShape(TRIANGLE_STRIP);

    let v = y * invN;
    let vNext = (y + 1) * invN;
    let t = (y + 1) * invN; // Store the (y+1)/n value for reuse

    let Cx = lerp(p2.x, p3.x, t);
    let Cy = lerp(p2.y, p3.y, t);
    let Dx = lerp(p1.x, p4.x, t);
    let Dy = lerp(p1.y, p4.y, t);

    for (let x = 0; x <= n; x++) {
      let u = x * invN;
      let tX = x * invN; // Store x/n for reuse

      let ABx = lerp(Ax, Bx, tX);
      let ABy = lerp(Ay, By, tX);
      let DCx = lerp(Dx, Cx, tX);
      let DCy = lerp(Dy, Cy, tX);

      pg.vertex(ABx, ABy, u, v);   // Top row
      pg.vertex(DCx, DCy, u, vNext); // Bottom row
    }

    pg.endShape();
    // Update points for the next row
    Ax = Dx;
    Ay = Dy;
    Bx = Cx;
    By = Cy;
  }
}


// Callback function for when handPose outputs data
function mesh(p1, p2, p3, p4, n) {

  //adjust for translate

  p1.y = p1.y - pg.height/2;
  p2.y = p2.y - pg.height/2;
  p3.y = p3.y - pg.height/2;
  p4.y = p4.y - pg.height/2;

  p1.x = p1.x - pg.width/2;
  p2.x = p2.x - pg.width/2;
  p3.x = p3.x - pg.width/2;
  p4.x = p4.x - pg.width/2; 


  let invN = 1 / n; // Avoid repeated division
  let Ax = p1.x, Ay = p1.y;
  let Bx = p2.x, By = p2.y;


  for (let y = 0; y < n; y++) {

    beginShape(TRIANGLE_STRIP);

    let v = y * invN;
    let vNext = (y + 1) * invN;
    let t = (y + 1) * invN; // Store the (y+1)/n value for reuse

    let Cx = lerp(p2.x, p3.x, t);
    let Cy = lerp(p2.y, p3.y, t);
    let Dx = lerp(p1.x, p4.x, t);
    let Dy = lerp(p1.y, p4.y, t);

    for (let x = 0; x <= n; x++) {
      let u = x * invN;
      let tX = x * invN; // Store x/n for reuse

      let ABx = lerp(Ax, Bx, tX);
      let ABy = lerp(Ay, By, tX);
      let DCx = lerp(Dx, Cx, tX);
      let DCy = lerp(Dy, Cy, tX);

      vertex(ABx, ABy, u, v);   // Top row
      vertex(DCx, DCy, u, vNext); // Bottom row
    }

    endShape();
    // Update points for the next row
    Ax = Dx;
    Ay = Dy;
    Bx = Cx;
    By = Cy;
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    if (saveTimer === null) { // Prevent multiple timers
      saveTimer = setTimeout(() => {
        save('myCanvas.png'); // Save image
        saveTimer = null; // Reset timer
      }, 3000); // 3 seconds delay
    }
  }
}
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
