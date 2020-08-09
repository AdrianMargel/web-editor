var dialogSpacing=14;

document.onmousemove = drag;
var dragSub=[];
function subscribeDrag(toSub){
	dragSub.push(toSub);
}
function drag(e){
	let mouse=new Vector(e.clientX,e.clientY);
	for(let i=0;i<dragSub.length;i++){
		dragSub[i](mouse);
	}
}


document.onmouseup=(e)=>{mouseUp(e)};
var MUSub=[];
function subscribeMouseUp(toSub){
	MUSub.push(toSub);
}
function mouseUp(e){
	for(let i=0;i<MUSub.length;i++){
		MUSub[i]();
	}
}


class Vector {
  constructor(xOrVec,y,angleInit) {

  	if(arguments.length == 0) {
  		this.x=0;
  		this.y=0;
  	}else if(arguments.length == 1) {
      this.x=xOrVec.x;
      this.y=xOrVec.y;
    }else {
      let x=xOrVec;
      if(arguments.length == 3&&angleInit){
        this.x=Math.cos(x)*y;
        this.y=Math.sin(x)*y;
      }else{
        this.x=x;
        this.y=y;
      }
    }
    //console.log(this,xOrVec,y,angleInit);
  }
  addVec(vec) {
    this.x+=vec.x;
    this.y+=vec.y;
  }
  subVec(vec) {
    this.x-=vec.x;
    this.y-=vec.y;
  }
  multVec(vec) {
    this.x*=vec.x;
    this.y*=vec.y;
  }
  divVec(vec) {
    this.x/=vec.x;
    this.y/=vec.y;
  }
  sclVec(scale) {
    this.x*=scale;
    this.y*=scale;
  }
  nrmVec(mag){
  	if(arguments.length == 1) {
    	this.sclVec(mag/this.getMag());
	}else{
	    this.sclVec(1/this.getMag());
	}
  }
  limVec(lim){
    var mag=this.getMag();
    if(mag>lim){
      this.sclVec(lim/mag);
    }
  }
  getAng(vec) {
  	if(arguments.length == 1) {
    	return Math.atan2(vec.y-this.y, vec.x-this.x);
	}else{
    	return Math.atan2(this.y, this.x);
	}
  }
  getMag(vec) {
  	if(arguments.length == 1) {
    	return Math.sqrt(Math.pow(vec.x-this.x,2)+Math.pow(vec.y-this.y,2));
    }else{
	    return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
    }
  }
  rotVec(rot){
    var mag=this.getMag();
    var ang=this.getAng();
    ang+=rot;
    this.x=Math.cos(ang)*mag;
    this.y=Math.sin(ang)*mag;
  }
  minVec(min){
    this.x=Math.min(this.x,min.x);
    this.y=Math.min(this.y,min.y);
  }
  maxVec(max){
    this.x=Math.max(this.x,max.x);
    this.y=Math.max(this.y,max.y);
  }
  inRange(vec,dist){
    let diffX=Math.abs(vec.x-this.x);
    if(diffX>dist){
      return false;
    }
    let diffY=Math.abs(vec.y-this.y);
    if(diffY>dist){
      return false;
    }
    return Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2))<=dist;
  }
  setVec(vec){
    this.x=vec.x;
    this.y=vec.y;
  }
}

class Dialog extends HTMLElement{
	constructor(){
		super();
		this.grabPos=null;
		this.resize=null;
		this.originalPos=null;
		this.originalSize=null;

		this.resizers=[];
		this.minSize=new Vector(150,100);
		this.size=new Vector(this.minSize);
		this.pos=new Vector(200,100);
		for(let x=-1;x<=1;x++){
			let col=[];
			for(let y=-1;y<=1;y++){
				if(!(x==0&&y==0)){
					let toAdd=new Resizer(new Vector(x,y),this);
					col.push(toAdd);
				}
			}
			this.resizers.push(col);
		}
		this.inner=document.createElement("DIV");
		this.inner.classList.add("inner");
		subscribeDrag((e)=>{this.drag(e)});
		subscribeMouseUp(()=>{this.release()});
	}

	connectedCallback(){
		for(let i=0;i<this.resizers.length;i++){
			for(let j=0;j<this.resizers[i].length;j++){
				this.appendChild(this.resizers[i][j]);
			}
		}
		let title=this.getAttribute("title"); 
		if(title==null){
			title="";
		}
		let mover=new Mover(title,this);
		this.appendChild(mover);
		this.appendChild(this.inner);
		this.updateSize();
		this.updatePos();
	}
	drag(mouse){
		if(this.resize!=null){
			let diff=null;
			diff=new Vector(mouse);
			diff.subVec(this.grabPos);


			if(this.resize.x==1){
				this.size.x=Math.max(diff.x+this.originalSize.x,this.minSize.x);
			}
			if(this.resize.x==-1){
				let tarSize=this.originalSize.x-diff.x;
				let correction=0;
				if(tarSize<this.minSize.x){
					correction=tarSize-this.minSize.x;
				}
				this.size.x=tarSize-correction;
				this.pos.x=this.originalPos.x+diff.x+correction;
			}

			if(this.resize.y==1){
				this.size.y=Math.max(diff.y+this.originalSize.y,this.minSize.y);
			}
			if(this.resize.y==-1){
				let tarSize=this.originalSize.y-diff.y;
				let correction=0;
				if(tarSize<this.minSize.y){
					correction=tarSize-this.minSize.y;
				}
				this.size.y=tarSize-correction;
				this.pos.y=this.originalPos.y+diff.y+correction;
			}

			if(this.resize.x==0&&this.resize.y==0){
				this.pos=new Vector(diff);
				this.pos.addVec(this.originalPos);
			}

			this.updateSize();
			this.updatePos();
		}
	}
	grab(mouse,resize){
		this.grabPos=new Vector(mouse);
		this.resize=new Vector(resize);
		this.originalPos=new Vector(this.pos);
		this.originalSize=new Vector(this.size);
	}
	release(){
		this.grabPos=null;
		this.resize=null;
	}
	updateSize(){
		this.style.width=this.size.x+"px";
		this.style.height=this.size.y+"px";
	}
	updatePos(){
		this.style.left=this.pos.x+"px";
		this.style.top=this.pos.y+"px";
	}
}

class Mover extends HTMLElement{
	constructor(title,parent){
		super();
		this.title=title;
		this.parent=parent;
	}

	connectedCallback(){
		let ttlElm=document.createElement("H1");
		ttlElm.innerHTML=this.title;
		this.appendChild(ttlElm);

		this.onmousedown=(e)=>{this.grab(e)};
		this.onmouseup=(e)=>{this.release(e)};
	}
	grab(e){
		let mouse=new Vector(e.clientX,e.clientY);
		this.parent.grab(mouse,new Vector(0,0));
	}
	release(e){
		this.parent.release();
	}
}

class Resizer extends HTMLElement{
	constructor(resize,parent){
		super();
		this.resize=resize;
		this.parent=parent;
	}

	connectedCallback(){
		let gap=(-dialogSpacing/2)+"px";
		if(this.resize.x==0){
			this.style.right=gap;
			this.style.left=gap;
    		this.style.cursor="n-resize";
		}
		if(this.resize.x==1){
			this.style.right=gap;
		}
		if(this.resize.x==-1){
			this.style.left=gap;
		}

		if(this.resize.y==0){
			this.style.top=gap;
			this.style.bottom=gap;
    		this.style.cursor="e-resize";
		}
		if(this.resize.y==1){
			this.style.bottom=gap;
		}
		if(this.resize.y==-1){
			this.style.top=gap;
		}

		if(Math.abs(this.resize.x)+Math.abs(this.resize.y)==2){
			this.classList.add("corner");
			let cornerInner=document.createElement("DIV");
			this.appendChild(cornerInner);
			if(this.resize.x*this.resize.y>0){
    			this.style.cursor="nwse-resize";
			}else{
    			this.style.cursor="nesw-resize";
			}
		}else{
			this.classList.add("edge");
		}
		this.onmousedown=(e)=>{this.grab(e)};
		this.onmouseup=(e)=>{this.release(e)};
	}
	grab(e){
		let mouse=new Vector(e.clientX,e.clientY);
		this.parent.grab(mouse,this.resize);
	}
	release(e){
		this.parent.release();
	}
}
customElements.define('dialog-main', Dialog);
customElements.define('dialog-resizer', Resizer);
customElements.define('dialog-mover', Mover);

class WebTool extends HTMLElement{
	constructor(){
		super();
		this.tArea=document.createElement("TEXTAREA");
		this.target=null;
	}

	connectedCallback(){
		this.target=document.getElementById("selected");
		let inputHandler = (e) => {
			this.target.style.cssText=e.target.value;
		}
		this.tArea.innerHTML=this.target.style.cssText;
		this.tArea.addEventListener('input', inputHandler);
		this.tArea.addEventListener('propertychange', inputHandler);
		this.appendChild(this.tArea);
	}

}

customElements.define('web-tool', WebTool);