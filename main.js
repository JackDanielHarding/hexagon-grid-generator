"use strict";

const CANVAS_SIZE = 1000;
const FRAME_RATE = 60;

let blanketWidth = 24;
let blanketHeight = 21;

let colors = new Array(0);

const GRID_FILE_INPUT_ELEMENT = document.getElementById("grid-file");
GRID_FILE_INPUT_ELEMENT.addEventListener("change", fileinputchanged, false);
function fileinputchanged() {
  const LOAD_GRID_BUTTON_ELEMENT = document.getElementById("load-grid-button");
  LOAD_GRID_BUTTON_ELEMENT.disabled = (this.files == null) ? true : false
}

function setup(){
  let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.parent('sketch-holder');
  frameRate(FRAME_RATE);

  refreshInput();
  
  let grid = generateGrid();
  printGrid(grid);
}

function addColorPicker(color){
  let colorList = document.getElementById("colorlist");

  let colorPickerDiv = document.createElement("div");
  
  let colorPicker = document.createElement("INPUT");
  colorPicker.setAttribute("type", "color");
  colorPicker.setAttribute("value", color);
  colorPickerDiv.appendChild(colorPicker);
  
  let duplicateColorButton = document.createElement("BUTTON");
  duplicateColorButton.innerHTML = 'DUPLICATE';
  duplicateColorButton.onclick = function() {
    addColorPicker(color)
  }
  colorPickerDiv.appendChild(duplicateColorButton); 

  let removeColorButton = document.createElement("BUTTON");
  removeColorButton.innerHTML = 'REMOVE';
  removeColorButton.onclick = function() {
    colorDiv = this.parentNode
    console.log(colorDiv);
    colorDiv.parentNode.removeChild(colorDiv)  
  }
  colorPickerDiv.appendChild(removeColorButton);  
  
  colorList.appendChild(colorPickerDiv);      
}

function addRandomColorPicker(){
  addColorPicker(getRandomColor())
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//TEST
function testGetRandomColor(){
  let testColor = getRandomColor();
  let testExp = new RegExp("#([0-9]|[A-F]){6}");
  if (!testExp.test(testColor)){
    throw new Error("Randomly generated hex color is in the wrong format");
  }
}
testGetRandomColor();

function duplicateColor(el){
  colorDiv = el.parentNode
  children = colorDiv.childNodes
  for(let j = 0; j < children.length; j++){
    if(children[j].nodeName == "INPUT"){
      addColorPicker(children[j].value)
    }
  }
}

function refreshInput(){
  blanketWidth = document.getElementById("width").value;
  blanketHeight = document.getElementById("height").value;

  let colorPickers = document.getElementById("colorlist").children;
  console.log(colorPickers);
  
  colors = new Array(0);
  for(let i = 0; i < colorPickers.length; i++){
    let children = colorPickers[i].childNodes
    for(let j = 0; j < children.length; j++){
      if(children[j].nodeName == "INPUT"){
        console.log(children[j]);
        colors.push(children[j].value)
      }
    }
  }
}

function generateGrid(){

  let grid = new Array(24);
  for (let i = 0; i < grid.length; i++) { 
    grid[i] = new Array(21); 
  } 

  for(let y = 0; y < blanketHeight; y++){
    for(let x = 0; x < blanketWidth; x++){

      let adjacentColors = new Array(0);

      if(y > 0){
        adjacentColors.push(grid[x][y-1])
      }
      if(x > 0){
        adjacentColors.push(grid[x-1][y])
      }

      let availableColors = adjacentColors.concat(colors);
      
      let randomColour = Math.floor(Math.random() * availableColors.length);
      let randColour = availableColors[randomColour]

      grid[x][y] = randColour;
    }
  }

  return grid
}

function printGrid(grid){
  background(100);
  
  const SCALE = 3;
  const HEXAGON_WIDTH = 16 * SCALE;
  const HEXAGON_HEIGHT = 14 * SCALE;
  const HALF_HEXAGON_HEIGHT = HEXAGON_HEIGHT / 2;

  for(let y = 0; y < blanketHeight; y++){
    for(let x = 0; x < blanketWidth; x++){

      let yOffset = x % 2 == 0 ? HALF_HEXAGON_HEIGHT : 0
      drawHexagon(HEXAGON_WIDTH * 0.75 * x, (HEXAGON_HEIGHT * y) + yOffset, SCALE, color(grid[x][y]));
    }
  }
}

function saveGrid(){
  console.log(grid);
  gridJson = JSON.stringify(grid)
  console.log(gridJson);

  let a = document.createElement("a");
  let file = new Blob([gridJson], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = 'saved-grid.json';
  a.click();
}

function loadGrid(){
  let selectedFile = document.getElementById('grid-file').files[0];
  let reader = new FileReader();
  reader.readAsText(selectedFile)

  reader.onload = function(event) {
    let grid = JSON.parse(event.target.result);

    blanketWidth = grid.length;
    blanketHeight = grid[0].length;

    console.log(grid);
    printGrid(grid);
  }
}

function regenerate(){
  refreshInput();
  let grid = generateGrid();
  printGrid(grid);
  return false;
}
  
function drawHexagon(transX, transY, s, c) {
  noStroke()

  console.log(c);
  fill(c);
  push();
  translate(transX, transY);
  scale(s);
  beginShape();
  vertex(4, 14);
  vertex(12, 14);
  vertex(16, 7);
  vertex(12, 0);
  vertex(4, 0);
  vertex(0, 7);
  endShape(CLOSE); 
  pop();
}