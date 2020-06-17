var CANVAS_SIZE = 1000;
var FRAME_RATE = 60;

var BLANKET_WIDTH = 24;
var BLANKET_HEIGHT = 21;

var colors = new Array(0);

var grid = new Array(24);

const gridFileInput = document.getElementById("grid-file");
gridFileInput.addEventListener("change", fileinputchanged, false);
function fileinputchanged() {
  const gridFileInput = document.getElementById("load-grid-button");
  
  const fileList = this.files;
  if(fileList == null){
    gridFileInput.disabled = true
  } else {
    gridFileInput.disabled = false
  }
}

function setup(){
  var canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.parent('sketch-holder');
  frameRate(FRAME_RATE);

  refreshInput();

  initArray();
  
  generate();
  printGrid();
}

function initArray(){
  for (var i = 0; i < grid.length; i++) { 
    grid[i] = new Array(21); 
  } 
}

function addColor(color){
  var colorList = document.getElementById("colorlist");

  var colorPickerDiv = document.createElement("div");
  
  var colorPicker = document.createElement("INPUT");
  colorPicker.setAttribute("type", "color");
  colorPicker.setAttribute("value", color);
  colorPickerDiv.appendChild(colorPicker);
  
  var duplicateColorButton = document.createElement("BUTTON");
  duplicateColorButton.innerHTML = 'DUPLICATE';
  duplicateColorButton.onclick = function() {
    addColor(color)
  }
  colorPickerDiv.appendChild(duplicateColorButton); 

  var removeColorButton = document.createElement("BUTTON");
  removeColorButton.innerHTML = 'REMOVE';
  removeColorButton.onclick = function() {
    colorDiv = this.parentNode
    console.log(colorDiv);
    colorDiv.parentNode.removeChild(colorDiv)  
  }
  colorPickerDiv.appendChild(removeColorButton);  
  
  colorList.appendChild(colorPickerDiv);      
}

function addRandomColor(){
  addColor(getRandomColor())
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function duplicateColor(el){
  colorDiv = el.parentNode
  children = colorDiv.childNodes
  for(var j = 0; j < children.length; j++){
    if(children[j].nodeName == "INPUT"){
      addColor(children[j].value)
    }
  }
}

function refreshInput(){
  BLANKET_WIDTH = document.getElementById("width").value;
  BLANKET_HEIGHT = document.getElementById("height").value;

  var colorPickers = document.getElementById("colorlist").children;
  console.log(colorPickers);
  
  colors = new Array(0);
  for(var i = 0; i < colorPickers.length; i++){
    var children = colorPickers[i].childNodes
    for(var j = 0; j < children.length; j++){
      if(children[j].nodeName == "INPUT"){
        console.log(children[j]);
        colors.push(children[j].value)
      }
    }
  }
}

function generate(){

  for(var y = 0; y < BLANKET_HEIGHT; y++){
    for(var x = 0; x < BLANKET_WIDTH; x++){

      tmpColors = new Array(0);

      if(y > 0){
        tmpColors.push(grid[x][y-1])
      }
      if(x > 0){
        tmpColors.push(grid[x-1][y])
      }

      tmpColors = tmpColors.concat(colors);
      
      var randomColour = Math.floor(Math.random() * tmpColors.length);
      var randColour = tmpColors[randomColour]

      grid[x][y] = randColour;
    }
  }
}

function printGrid(){
  background(100);
  stroke(0);
  strokeWeight(2);
  stroke(0);
  strokeWeight(2);
  
  var colorPickers = document.getElementById("colorlist").children;
  var noOfColors = colorPickers.length
  var colorCount = Array(noOfColors);

  for(var i = 0; i < noOfColors; i++){
    colorCount.push(0)
  }
  
  var scale = 3
  var HEXAGON_WIDTH = 16 * scale;
  var HEXAGON_HEIGHT = 14 * scale;
  var adjustment = 0;

  for(var y = 0; y < BLANKET_HEIGHT; y++){
    for(var x = 0; x < BLANKET_WIDTH; x++){

      console.log(x + ", " + y);

      hexagon(HEXAGON_WIDTH * 0.75 * x, (HEXAGON_HEIGHT * y) + adjustment, scale, color(grid[x][y]));

      if (adjustment == 0){
        adjustment += HEXAGON_HEIGHT / 2
      } else {
        adjustment = 0
      }
    }
  }
}

function saveGrid(){
  console.log(grid);
  gridJson = JSON.stringify(grid)
  console.log(gridJson);

  var a = document.createElement("a");
  var file = new Blob([gridJson], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = 'saved-grid.json';
  a.click();
}

function loadGrid(){
  var selectedFile = document.getElementById('grid-file').files[0];
  var reader = new FileReader();
  reader.readAsText(selectedFile)

  reader.onload = function(event) {
    grid = JSON.parse(event.target.result);


    BLANKET_WIDTH = grid.length;
    BLANKET_HEIGHT = grid[0].length;

    console.log(grid);
    printGrid();
  }
}

function regenerate(){
  refreshInput();
  generate();
  printGrid();
  return false;
}
  
function hexagon(transX, transY, s, c) {
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