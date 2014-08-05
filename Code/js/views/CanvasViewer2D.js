//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer"], function(CanvasViewer2DTemplate, CanvasViewer) {
    var CanvasViewer2D = CanvasViewer.extend({
	template: _.template(CanvasViewer2DTemplate),
	events: function(){
	    return _.extend({}, CanvasViewer.prototype.events,{
		'change input#overlayCheckbox': 'toggleOverlay',
		'mousedown': 'setMouseDown',
		'mouseup': 'setMouseUp',
		'mousemove': 'mouseHandler',
		'mouseenter canvas': 'mouseEnter',
		'keydown': 'keyHandler',
	    });
	},
	render:function() {
	    console.log('CanvasViewer2D.render(' + this.mode + ')');

	    //_.bindAll(this, 'draw');
	    
	    $(this.el).html(this.template({
		topbarId: 'topbar' + this.panelId,
		overlay: 'overlayToggle' + this.panelId,
		canvasViewerId: 'canvasViewer' + this.panelId,
		slider: 'sliderVertical' + this.panelId,
	    }));

	    //DST CANVAS
	    this.canvas = document.getElementById("canvasViewer" + this.panelId);
	    this.ctx = this.canvas.getContext("2d");

	    //MOUSEWHEEL SUPPORT
	    if (this.canvas.addEventListener) {
		// IE9, Chrome, Safari, Opera
		this.canvas.addEventListener("mousewheel", this.mouseWheelHandler, false);
		// Firefox
		this.canvas.addEventListener("DOMMouseScroll", this.mouseWheelHandler, false);
	    }
	    // IE 6/7/8
	    else this.canvas.attachEvent("onmousewheel", this.mouseWheelHandler);

	    this.setModeCSS();
	    this.setSrcCanvases();

	    this.delegateEvents();//hook up events again

	    //re-check showOverlay toggle if internal attrib is set
	    if(this.showOverlay){
		this.showOverlay = true;

		//if not toggled, set toggle
		$('#overlayCheckbox', this.el).prop("checked", true);
		
	    }
	
	    return this; //to enable chain calling
	},
	mouseEnter:function(e){
	    //need to focus the canvas here
	    $(e.target).focus();
	},
	mouseHandler:function(e){


	    if(this.mouseDown){
		this.mouseX = e.clientX - this.canvas.offsetLeft;
		this.mouseY = e.clientY - this.canvas.offsetTop;

		if(e.ctrlKey){
		    this.clipPosX = this.canvas.width - this.mouseX;
		    
		    this.showLine = true;
		}
		else if(e.buttons == 1){

		    this.traversing = true;

		    Backbone.trigger('traverse', 
				     [this.mouseX,
				      this.mouseY,
				      this.currentLayerItemTop, 
				      this.mode]);
		}
		else if(e.buttons == 4){
		    //console.log('Panning!');

		    //return normalised/relative mouse data
		    var x = this.mouseXPrev - e.clientX;
		    var y = this.mouseYPrev - e.clientY;

		    Backbone.trigger('pan', [x, y, this.currentLayerItemTop, this.mode]);

		    this.mouseXPrev = e.clientX;
		    this.mouseYPrev = e.clientY;
		}
		else if(e.buttons == 2){
		    //console.log('Zooming!');

		    //return normalised/relative mouse data
		    var z = this.mouseZPrev - e.clientY;

		    Backbone.trigger('zoom', [z, this.currentLayerItemTop, this.mode]);

		    this.mouseZPrev = e.clientY;
		}
	    }
	},
	keyHandler:function(e){
	    //console.log('CanvasViewer2D.keyHandler()');
	    //console.log(e.which);
	    
	    if(e.which == 70){
		Backbone.trigger('focus', [this.currentLayerItemTop, this.mode]);
	    }
	    if(e.which == 79){
		this.toggleOverlay();
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
	toggleOverlay:function(){

	    console.log('CanvasViewer2D.toggleOverlay()');

	    if (!this.showOverlay){
		this.showOverlay = true;

		//if not toggled, set toggle
		$('#overlayCheckbox', this.el).prop("checked", true);
		
	    }
	    else{
		this.showOverlay = false;
		$('#overlayCheckbox', this.el).prop("checked", false);
	    }
	},
	mouseWheelHandler:function(e){
	    console.log('CanvasViewer2D.mouseWheelHandler()');

	    //only scroll if a layerItem is set
	    if(this.currentLayerItemTop){
	
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		//X
		if (this.mode == 1){
	    	    var oldVal = this.currentLayerItemTop.get('indexX');
		    
		    if(delta < 0)
			this.currentLayerItemTop.set({indexX: oldVal - 1});
		    else
			this.currentLayerItemTop.set({indexX: oldVal + 1});
		}
		//Y
		else if (this.mode == 2){
	    	    var oldVal = this.currentLayerItemTop.get('indexY');
		    
		    if(delta < 0)
			this.currentLayerItemTop.set({indexY: oldVal - 1});
		    else
			this.currentLayerItemTop.set({indexY: oldVal + 1});
		}
		//Z
		else if (this.mode == 3){
	    	    var oldVal = this.currentLayerItemTop.get('indexZ');
		    
		    if(delta < 0)
			this.currentLayerItemTop.set({indexZ: oldVal - 1});
		    else
			this.currentLayerItemTop.set({indexZ: oldVal + 1});
		}
	    }

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
	drawTest:function(){

	    //console.log('CanvasViewer2D.draw - ' + this.mode);
	    /*this.ctx.rect(0, 0,
	    		  this.canvas.width - this.clipPosX,
			  this.canvas.height - this.clipPosY);*/

	    this.ctx.rect(0, 0,
	    		  200, 200);

	    //console.log('this.ctx:');
	    //console.log(this.ctx);



	    if(this.mode == 1)
		this.ctx.fillStyle = 'red';
	    if(this.mode == 2)
		this.ctx.fillStyle = 'green';
	    if(this.mode == 3)
		this.ctx.fillStyle = 'blue';

	    this.ctx.fill();

	},
	draw:function(){
	    //update the canvases at 60 frames a second?

	    //CLEAR - NEED TO FIX THESE COORDS
	    this.ctx.fillStyle = 'black';

	    //DRAW BLACK BACKGROUND - SO ALWAYS A BLACK BACKGROUND
	    this.setToBlack();
	    
	    //SET FIRST ALPHA
	    this.ctx.globalAlpha = this.alphaB;

	    //DRAW BOTTOM CANVAS - offset by 1,1 to fit the border in
	    if(this.currentLayerItemBottom){
		if(this.currentLayerItemBottom.get('loaded'))
		    this.ctx.drawImage(this.srcCanvasB, 1, 1);
	    }

	    //SET SECOND ALPHA
	    this.ctx.globalAlpha = this.alphaA;

	    //DRAW BLACK BACKGROUND FOR ITEM_TOP
	    //WITH RED FRAME TO SHOW ACTIVE REGION
	    this.ctx.beginPath();
	    this.ctx.rect(0, 0,
	    		  this.canvas.width - this.clipPosX,
			  this.canvas.height - this.clipPosY);
	    this.ctx.fillStyle = 'black';
	    this.ctx.fill();
	    this.ctx.lineWidth = 2;
	    this.ctx.strokeStyle = 'red';
	    this.ctx.stroke();


	    //if(this.mode == 2)
	    //console.log(this.srcCanvasA);
	    
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

	    //do the overlay

	    if(this.annotation)
		this.drawAnnotation();

	    if(this.showOverlay)
		this.drawOverlay();

	    if(this.showLine)
		this.drawLine();

	    if(this.traversing)
		this.drawCrosshair();

	},
	drawAnnotation:function(){
	    console.log('drawAnnotation()');



	},
	drawLine:function(){
	    //console.log('drawingLine()');

	    this.ctx.globalAlpha = 1;
	    this.ctx.lineWidth = 2;
	    this.ctx.beginPath();
	    this.ctx.moveTo(this.mouseX, 0);
	    this.ctx.lineTo(this.mouseX, this.canvas.height);

	    this.ctx.strokeStyle = 'red';
	    this.ctx.stroke();
	    this.ctx.closePath();

	    
	    //this.ctx.moveTo(this.lineStartX, this.lineStartY);
	    //this.ctx.lineTo(this.lineEndX, this.lineEndY);
	    
	    this.showLine = false;

	},
	drawCrosshair:function(){
	    console.log('TRAVERSE');

	    this.ctx.globalAlpha = 1;
	    this.ctx.lineWidth = 2;
	    this.ctx.beginPath();
	    this.ctx.moveTo(this.mouseX, 0);
	    this.ctx.lineTo(this.mouseX, this.canvas.height);

	    this.ctx.strokeStyle = 'green';
	    this.ctx.stroke();
	    this.ctx.closePath();


	    this.ctx.beginPath();
	    this.ctx.moveTo(0, this.mouseY);
	    this.ctx.lineTo(this.canvas.width, this.mouseY);

	    this.ctx.strokeStyle = 'blue';
	    this.ctx.stroke();
	    this.ctx.closePath();


	},
	drawOverlay:function(){
	    /* displays info about the current layerItem */
	    
	    //reset globalAlpha
	    this.ctx.fillStyle = 'red';
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillStyle = 'white';
	    this.ctx.font="14px Arial";

	    //FILENAME
	    this.ctx.fillText("File: " + this.currentLayerItemTop.get('fileName'), 10, 20);

	    //INDEX
	    var index = 0;
	    var orientation = "";
	    if (this.mode == 1){
		index = this.currentLayerItemTop.get('indexX');
		orientation = 'Axial';
	    }
	    else if (this.mode == 2){
		index = this.currentLayerItemTop.get('indexY');
		orientation = 'Sagittal';

	    }
	    else if (this.mode == 3){
		index = this.currentLayerItemTop.get('indexZ');
		orientation = 'Coronal';

	    }

	    this.ctx.fillText("Orientation: " + orientation,10,40);
	    this.ctx.fillText("Index: " + index,10,60);

	    //OPAC
	    this.ctx.fillText("Opacity: " + this.currentLayerItemTop.get('opacity'),10,80);

	},
    });
    return CanvasViewer2D;
});
