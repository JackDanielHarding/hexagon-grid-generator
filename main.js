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
  const testColor = getRandomColor();
  if (!isHexCode(testColor)){
    throw new Error("Randomly generated hex color is in the wrong format");
  }
}
testGetRandomColor();

function isHexCode(code){
  const hexCodeExp = new RegExp("^#[01234567890ABCDEFabcdef]{6}$");
  if (hexCodeExp.test(code)){
    return true;
  }
  return false;
}

//TEST
function testHexCode(){
  const validHexCodes = ["#FFFFFF", "#ffffff", "#000000", "#999999", "#AAAAAA", "#aaaaaa", "#de3a5a"];
  for(let code of validHexCodes){
    if(!isHexCode(code)){
      throw new Error("correct hex code is failing hex code check: " + code);
    }
  }

  const invalidHexCodes = ["#FFFFFFF", "FFFFFF", "#FFFFF", "#ABCDEG", "#abcdeg"];
  for(let code of invalidHexCodes){
    if(isHexCode(code)){
      throw new Error("incorrect hex code is passing hex code check: " + code);
    }
  }
}
testHexCode();

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
    
    let grid;
    
    try{
      grid = JSON.parse(event.target.result);
    } catch (e){
      if(e instanceof SyntaxError){
        alert("File selected is not a save file")
        return;
      } else {
        throw e;
      }
    }

    if (!isValidGrid(grid)){
      alert("File selected is not a valid save file")
      return;
    }

    blanketWidth = grid.length;
    blanketHeight = grid[0].length;

    printGrid(grid);
  }
}

function isValidGrid(grid){
  if(!Array.isArray(grid)){
    console.log("grid is not array");
    return false;
  }
  for (let row of grid){
    if (!Array.isArray(row)){
      console.log("row is not array");
      return false;
    }
    for (let hex of row){
      if (!isHexCode(hex)){
        console.log("cell is not hex");
        return false;
      }
    }
  }
  return true;
}

//TEST
function testIsValidGrid(){
  const validGrid = [["#FFFFFF", "#FFFFFF", "#FFFFFF"], ["#FFFFFF", "#FFFFFF", "#FFFFFF"], ["#FFFFFF", "#FFFFFF", "#FFFFFF"]];
  if(!isValidGrid(validGrid)){
    throw new Error("valid grid is faling isValidGrid check: " + validGrid)
  }

  const invalidGrid1 = "#FFFFFF";
  const invalidGrid2 = [["#FFFFFF", "#FFFFFF", "#FFFFFF"], "#FFFFFF", ["#FFFFFF", "#FFFFFF", "#FFFFFF"]];
  const invalidGrid3 = [["#FFFFFF", "ZZZZZZ", "#FFFFFF"], ["#FFFFFF", "#FFFFFF", "#FFFFFF"], ["#FFFFFF", "#FFFFFF", "#FFFFFF"]];
  const invalidGrids = [invalidGrid1, invalidGrid2, invalidGrid3];

  for (let grid of invalidGrids){
    if(isValidGrid(grid)){
      throw new Error("valid grid is faling isValidGrid check: " + validGrid)
    }
  }
}
testIsValidGrid();

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