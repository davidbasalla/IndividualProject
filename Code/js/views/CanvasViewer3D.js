//need to pass a variable here

define(["text!templates/CanvasViewer3D.html","views/CanvasViewer"], function(CanvasViewer3DTemplate, CanvasViewer) {
    var CanvasViewer3D = CanvasViewer.extend({
	template: _.template(CanvasViewer3DTemplate),
	events: function(){
	    return _.extend({}, CanvasViewer.prototype.events,{
		'mousedown': 'setMouseDown',
		'mouseup': 'setMouseUp',
		'mousemove': 'mouseHandler',
		'mouseenter canvas': 'mouseEnter',
		'keydown': 'keyHandler',
	    });
	},
	mouseEnter:function(e){
	    //need to focus the canvas here
	    $(e.target).focus();
	},
	mouseHandler:function(e){

	    if(this.mouseDown){
		this.mouseX = e.clientX - this.canvas.offsetLeft;
		this.mouseY = e.clientY - this.canvas.offsetTop;

		if(e.buttons == 1){
		    //rotating
		}
		else if(e.buttons == 4){
		    //panning
		}
		else if(e.buttons == 2){
		    //zooming
		}
	    }
	},
	mouseWheelHandler:function(e){
	    console.log('CanvasViewer3D.mouseWheelHandler()');
	},
	keyHandler:function(e){
	    //console.log('CanvasViewer2D.keyHandler()');
	    //console.log(e.which);
	    
	    if(e.which == 70){
		Backbone.trigger('focus', [this.currentLayerItemTop, this.mode]);
	    }
	},
	setMouseDown:function(e){
	    this.mouseDown = true;
	    this.storeMousePos(e);

	},
	setMouseUp:function(e){
	    this.mouseDown = false;
	    this.traversing = false;
	},
	storeMousePos:function(e){
	    //console.log('storeMousePos');

	    this.mouseXPrev = e.clientX;
	    this.mouseYPrev = e.clientY;
	    this.mouseZPrev = e.clientY;
	    
	},
	render:function() {
	    console.log('CanvasViewer3D.render()');

	    $(this.el).html(this.template({
		canvasViewerId: 'canvasViewer' + this.mode,
	    }));

	    //DST CANVAS
	    this.canvas = document.getElementById("canvasViewer" + this.viewerIndex);
	    this.ctx = this.canvas.getContext("2d");
	    
	    this.setMode(this.mode);
	    
	    return this; //to enable chain calling
	},
	setOpacity:function(){

	    if(this.ctx && this.currentLayerItemTop && this.currentLayerItemBottom){
		this.alphaA = this.currentLayerItemTop.get('opacity')/100;
		this.alphaB = this.currentLayerItemBottom.get('opacity')/100;
	    };
	},
	setToBlack:function(){	    
	    
	    //console.log('CanvasViewer2D.setToBlack()');

	    this.ctx.fillStyle = 'black';
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	},
	draw:function(){
	    //update the canvases at 60 frames a second?

	    //console.log('CanvasViewer2D.draw()');

	    //CLEAR - NEED TO FIX THESE COORDS
	    this.ctx.fillStyle = 'black';

	    //DRAW BLACK BACKGROUND - SO ALWAYS A BLACK BACKGROUND
	    this.setToBlack();
	    

	    //SET SECOND ALPHA
	    this.ctx.globalAlpha = this.alphaA;

	    //DRAW TOP CANVAS
	    if(this.currentLayerItemTop){
		if(this.currentLayerItemTop.get('loaded')){
		    //this.ctx.drawImage(this.srcCanvasA, 0, 0);
		    
		    this.ctx.drawImage(this.srcCanvasA,
				       0, 0,
				       this.canvas.width - this.clipPosX,
				       this.canvas.height - this.clipPosY,
				       1, 1,
				       this.canvas.width - this.clipPosX,
				       this.canvas.height - this.clipPosY);
		}
	    }

	},
    });
    return CanvasViewer3D;
});
