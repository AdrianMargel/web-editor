
class Element {
  constructor(elmnt) {

    this.grabClick=-1;

    this.x=elmnt.offsetLeft;
    this.y=elmnt.offsetTop;
    this.height = elmnt.offsetHeight;
    this.width = elmnt.offsetWidth;

    this.elmnt=elmnt;

    this.heldX=0;
    this.heldY=0;
    this.held=false;

    this.resizeX=0;
    this.resizeY=0;

    this.animating=0;
    this.initialX=this.x;
    this.initialY=this.y;
    var i=0;
    var allResizers=elmnt.getElementsByClassName("resizer");

    for(i = 0; i<allResizers.length; i++){
      //console.log(allResizers[i]);
      allResizers[i].tracker=this;
      allResizers[i].addEventListener("mousedown", function (event) {
        this.tracker.resizeGrab(this);
      });
    }
  }
  setPos(setX,setY){
    this.x=setX;
    this.y=setY;

    this.elmnt.style.left = this.x + "px";
    this.elmnt.style.top = this.y + "px";
  }
  setSize(wide,high,force){
    this.height = high;
    this.width = wide;
    if(force){
      this.elmnt.style.height = this.height + "px";
      this.elmnt.style.width = this.width + "px";
    }
  }
  grab(selX,selY){
    
    this.grabClick=clickNum;
    //defocus();
    this.setFocus(true);
    //if(selX>=this.x && selX<=this.x+this.width && selY>=this.y && selY<=this.y+this.height){
      this.held=true;
      this.heldX=selX-this.x;
      this.heldY=selY-this.y;
      if(this.elmnt.spawner!=undefined&&this.elmnt.spawner!=null){
        this.elmnt.style.zIndex="2";
      }
      this.elmnt.parentElement.appendChild(this.elmnt);
    //}
  }
  resizeGrab(grabbed){
    this.resizeX=0;
    this.resizeY=0;
    var i=0;
    let cList=grabbed.classList;
    for(i=0;i<cList.length;i++){
      if(cList[i]=="resizeBarR"){
        this.resizeX=1;
      }
      if(cList[i]=="resizeBarL"){
        this.resizeX=-1;
      }
      if(cList[i]=="resizeBarB"){
        this.resizeY=1;
      }
      if(cList[i]=="resizeBarT"){
        this.resizeY=-1;
      }

      if(cList[i]=="resizeNodeRT"){
        this.resizeX=1;
        this.resizeY=-1;
      }
      if(cList[i]=="resizeNodeLT"){
        this.resizeX=-1;
        this.resizeY=-1;
      }
      if(cList[i]=="resizeNodeRB"){
        this.resizeX=1;
        this.resizeY=1;
      }
      if(cList[i]=="resizeNodeLB"){
        this.resizeX=-1;
        this.resizeY=1;
      }
    }
  }
  release(){
    this.resizeX=0;
    this.resizeY=0;
    if(this.held){
      this.held=false;
      this.gridSnap();
      if(this.x<delX){
        if(this.elmnt.spawner!=undefined&&this.elmnt.spawner!=null){
          this.elmnt.style.zIndex="1";
          this.setPos(this.elmnt.spawner.x,this.elmnt.spawner.y);
        }else{
          this.elmnt.parentNode.removeChild(this.elmnt);
          removeOutline();
        }
      }
    }
  }
  // Method
  move(moveX,moveY) {
    if(this.held){
        this.elmnt.style.setProperty("-webkit-transition", "");
        this.elmnt.style.setProperty("transition", "");
      if(this.resizeX!=0||this.resizeY!=0){
        let mx=Math.min( Math.max(moveX,minX), maxX);
        let my=Math.min( Math.max(moveY,minY), maxY);

        let newSX=this.width;
        let newSY=this.height;
        let newX=this.x;
        let newY=this.y;
        let minWide=51;
        let minHigh=51;
        if(this.resizeX>0){
          newSX=Math.max(mx-this.x,minWide);
        }else if(this.resizeX<0){
          newX=Math.min(mx,this.x+this.width-minWide);
          newSX=Math.max((this.x+this.width)-mx,minWide);
        }
        if(this.resizeY>0){
          newSY=Math.max(my-this.y,minHigh)
        }else if(this.resizeY<0){
          newY=Math.min(my,this.y+this.height-minHigh);
          newSY=Math.max((this.y+this.height)-my,minHigh);
        }
        this.setSize(newSX,newSY,true);
        this.setPos(newX,newY);
        if(this.elmnt.spawner!=undefined&&this.elmnt.spawner!=null&&this.x>spawnX){
          this.elmnt.spawner.spawnNew();
          this.elmnt.spawner=null;
        }
      }else{
        this.x=Math.min( Math.max(moveX-this.heldX,minX), maxX-this.width);
        this.y=Math.min( Math.max(moveY-this.heldY,minY), maxY-this.height);
        this.elmnt.style.left = this.x + "px";
        this.elmnt.style.top = this.y + "px";
        if(this.elmnt.spawner!=undefined&&this.elmnt.spawner!=null&&this.x>spawnX){
          this.elmnt.spawner.spawnNew();
          this.elmnt.spawner=null;
        }
      }
      setOutline(this.x,this.y,this.width,this.height);
    }
  }
  gridSnap(){
    this.x=Math.round(this.x/gridSize)*gridSize;
    this.y=Math.round(this.y/gridSize)*gridSize;
    this.elmnt.style.left = this.x + "px";
    this.elmnt.style.top = this.y + "px";

    this.height = Math.max(-Math.round(-this.height/gridSize),1)*gridSize;
    this.width =  Math.max(-Math.round(-this.width/gridSize),1)*gridSize;
    //this.width = wide;
    this.elmnt.style.height = this.height + "px";
    this.elmnt.style.width = this.width + "px";
  }
  /*snap(reff){
    var i=0;
    for (i = 0; i < reff.length; i++) {
      let testX = reff[i].x-this.x;
      let testY = reff[i].y-this.y;
      let mag = Math.sqrt(testX*testX+testY*testY);
      if(mag<=20){
        this.elmnt.style.setProperty("-webkit-transition", "");
        this.elmnt.style.setProperty("transition", "");
        this.setPos(reff[i].x,reff[i].y);
        this.setSize(reff[i].width,reff[i].height,true);
      }
    }
  }*/
  setFocus(focused){
    if(focused){

      this.elmnt.classList.add("selected");

      var allResizers=this.elmnt.getElementsByClassName("resizer");
      for(i = 0; i<allResizers.length; i++){
        allResizers[i].style.display="block";
      }
      var allFocus=this.elmnt.getElementsByClassName("displayFocus");
      for(i = 0; i<allFocus.length; i++){
        allFocus[i].style.display="block";
      }
    }else{

      this.elmnt.classList.remove("selected");

      var allResizers=this.elmnt.getElementsByClassName("resizer");
      for(i = 0; i<allResizers.length; i++){
        allResizers[i].style.display="none";
      }
      var allFocus=this.elmnt.getElementsByClassName("displayFocus");
      for(i = 0; i<allFocus.length; i++){
        allFocus[i].style.display="none";
      }
    }
  }
}
class Spawner{
  constructor(elmnt) {
    this.x=elmnt.offsetLeft;
    this.y=elmnt.offsetTop;
    this.height = elmnt.offsetHeight;
    this.width = elmnt.offsetWidth;

    this.spawn=elmnt.innerHTML;
    elmnt.innerHTML="";

    this.elmnt=elmnt;
  }
  spawnNew(){

    var toAdd = document.createElement("DIV");
    toAdd.className="drag";
    toAdd.spawner=this;
    toAdd.innerHTML=this.spawn;

    this.elmnt.parentElement.appendChild(toAdd);

    var wide = toAdd.offsetWidth;
    var high = toAdd.offsetHeight;
    //var wide = this.elmnt.offsetWidth;
    //var high = toAdd.offsetWidth;
    //toAdd.style.y=high/2+"px";
    //toAdd.style.x=wide/2+"px";

    toAdd.style.width=0+"px";
    toAdd.style.height=0+"px";
    //addDrag(toAdd);
    toAdd.style.marginTop=high/2+"px";
    toAdd.style.marginLeft=wide/2+"px";
    addDrag(toAdd,this.x,this.y,wide,high);

    var animateTime=0.6;

    toAdd.style.setProperty("-webkit-transition", "width "+animateTime+"s, height "+animateTime+"s, margin "+animateTime+"s");
    toAdd.style.setProperty("transition", "width "+animateTime+"s, height "+animateTime+"s, margin "+animateTime+"s");
    
    toAdd.style.width="";
    toAdd.style.height="";
    toAdd.style.marginTop=0+"px";
    toAdd.style.marginLeft=0+"px";

  }

}

function defocus(){
  var i;
  for (i = 0; i < dragE.length; i++) {
    if(dragE[i].grabClick!=clickNum){
    dragE[i].setFocus(false);
    }
  }
}

function addDrag(addElement){
  var toAdd=new Element(addElement);

  addElement.tracker=toAdd;

  addElement.addEventListener("mousedown", function (event) {
    // toAdd.grab(posMX,posMY);
    this.tracker.grab(posMX,posMY);
  });
  dragE.push(toAdd);
}
function addDrag(addElement,x,y,w,h){
  var toAdd=new Element(addElement);
  toAdd.setPos(x,y);
  toAdd.setSize(w,h);

  addElement.tracker=toAdd;

  addElement.addEventListener("mousedown", function (event) {
    // toAdd.grab(posMX,posMY);
    this.tracker.grab(posMX,posMY);
  });
  dragE.push(toAdd);
}

var posMX=0, posMY=0, realMX=0,realMY=0, spawnX=100, delX=200;
var minX,minY,maxX,maxY;
var gridSize=100;

addGrid(true);
expandBar();
var allDrag=document.getElementsByClassName("drag");
var allSpawners=document.getElementsByClassName("spawner");
var dragE=[];
var spawnE=[];
let i=0;
var clickNum=0;
for (i = 0; i < allDrag.length; i++) {
  let toAdd=new Element(allDrag[i]);

  allDrag[i].tracker=toAdd;

  allDrag[i].addEventListener("mousedown", function (event) {
    // toAdd.grab(posMX,posMY);
    this.tracker.grab(posMX,posMY);
  });
  dragE.push(toAdd);
  //dragElement(allDrag[i]);
}
for (i = 0; i < allSpawners.length; i++) {
  let toAdd=new Spawner(allSpawners[i]);

  spawnE.push(toAdd);
  //dragElement(allDrag[i]);

  toAdd.spawnNew();
}

var allOutline=document.getElementsByClassName("snapOutline");

document.onmousemove = drag;
document.onscroll = scroll;
document.onmousedown =
  function(e) {
    e.preventDefault();
    defocus();
    clickNum++;
    //console.log(clickNum);
  };
document.onmouseup = mouseUp;

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8||evt.keyCode == 46) {
        deleteSelected();
    }
};

function deleteSelected(){
  let i;
  let j;

  for (i = dragE.length-1; i >=0; i--) {
    if(dragE[i].grabClick==clickNum-1&&clickNum!=0){
      for (j = 0; j < allDrag.length; j++) {
        if(dragE[i].elmnt==allDrag[j]){
          allDrag[j].parentNode.removeChild(allDrag[j]);
          break;
        }
      }
      dragE.splice(i,1);
    }
  }
  removeOutline();
}

function drag(e) {

  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  posMX = e.clientX + window.scrollX;
  posMY = e.clientY + window.scrollY;
  realMX = e.clientX;
  realMY = e.clientY;

  updateMouse();
}

function scroll(e) {
  e = e || window.event;
  e.preventDefault();

  posMX = realMX + window.scrollX;
  posMY = realMY + window.scrollY;

  updateMouse();
}

function updateMouse(){
  let i=0;
  for (i = 0; i < dragE.length; i++) {
    dragE[i].move(posMX,posMY);
  }
}
function mouseUp(){
  let i=0;
  for (i = 0; i < dragE.length; i++) {
    dragE[i].release();
  }
}
function setOutline(x,y,w,h){
  let i=0;
  for (i = 0; i < allOutline.length; i++) {
    allOutline[i].style.visibility="visible";

    var rx=Math.round(x/gridSize)*gridSize;
    var ry=Math.round(y/gridSize)*gridSize;

    var rh = Math.max(-Math.round(-h/gridSize),1)*gridSize;
    var rw =  Math.max(-Math.round(-w/gridSize),1)*gridSize;

    allOutline[i].style.left = rx + "px";
    allOutline[i].style.top = ry + "px";

    allOutline[i].style.height = rh + "px";
    allOutline[i].style.width = rw + "px";
  }
}
function removeOutline(){
  console.log(allOutline);
  let i=0;
  for (i = 0; i < allOutline.length; i++) {
    allOutline[i].style.visibility="hidden";
  }
}

function expandBar(){
  let allBars=document.getElementsByClassName("editBar");
  let i=0;

  for (i = 0; i < allBars.length; i++) {
    let barHigh=allBars[i].offsetHeight;
    let barWide=allBars[i].offsetWidth;
    let barX=allBars[i].offsetLeft;
    let barY=allBars[i].offsetTop;

    if(minX != undefined){
      minX=Math.min(barX,minX);
    }else{
      minX=gridX;
    }
    if(minY != undefined){
      minY=Math.min(barY,minY);
    }else{
      minY=gridY;
    }

    if(maxX != undefined){
      maxX=Math.max(barWide+barX,maxX);
    }else{
      maxX=barWide+barX;
    }

    if(maxY != undefined){
      maxY=Math.max(barHigh+barY,maxY);
    }else{
      maxY=barHigh+barY;
    }
  }
}

function addGrid(){

  let allGrids=document.getElementsByClassName("editBack");
  let i=0;

  for (i = 0; i < allGrids.length; i++) {
    let gridHigh=allGrids[i].offsetHeight;
    let gridWide=allGrids[i].offsetWidth;
    let gridX=allGrids[i].offsetLeft;
    let gridY=allGrids[i].offsetTop;

    if(minX != undefined){
      minX=Math.min(gridX,minX);
    }else{
      minX=gridX;
    }
    if(minY != undefined){
      minY=Math.min(gridY,minY);
    }else{
      minY=gridY;
    }

    if(maxX != undefined){
      maxX=Math.max(gridWide+gridX,maxX);
    }else{
      maxX=gridWide+gridX;
    }

    if(maxY != undefined){
      maxY=Math.max(gridHigh+gridY,maxY);
    }else{
      maxY=gridHigh+gridY;
    }

    let cols=gridWide/gridSize;
    let rows=gridHigh/gridSize;

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('height',gridHigh);
    svg.setAttribute('width',gridWide);
    allGrids[i].appendChild(svg);
    //let svg=allGrids[i].getElementsByClassName("displayGrid")[0];
    console.log(svg,gridWide);

    let x;
    for (x = 1; x < cols; x++) {
      let newLineCol = document.createElementNS('http://www.w3.org/2000/svg','line');
      newLineCol.setAttribute('x1',x*gridSize);
      newLineCol.setAttribute('y1',0);
      newLineCol.setAttribute('x2',x*gridSize);
      newLineCol.setAttribute('y2',gridHigh);

      if(x%3==0){
        newLineCol.classList.add("thickLine");
      }else{
        newLineCol.classList.add("thinLine");
      }
      svg.appendChild(newLineCol);
    }
    let y;
    for (y = 0; y < rows; y++) {
      let newLineRow = document.createElementNS('http://www.w3.org/2000/svg','line');
      newLineRow.setAttribute('x1',0);
      newLineRow.setAttribute('y1',y*gridSize);
      newLineRow.setAttribute('x2',gridWide);
      newLineRow.setAttribute('y2',y*gridSize);
      svg.appendChild(newLineRow);
      if(y%3==0){
        newLineRow.classList.add("thickLine");
      }else{
        newLineRow.classList.add("thinLine");
      }
    }
  }
}