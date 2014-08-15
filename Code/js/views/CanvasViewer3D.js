//need to pass a variable here

define(["text!templates/CanvasViewer3D.html","views/CanvasViewer"], function(CanvasViewer3DTemplate, CanvasViewer) {
    var CanvasViewer3D = CanvasViewer.extend({
	template: _.template(CanvasViewer3DTemplate),
	events: function(){
	    return _.extend({}, CanvasViewer.prototype.events,{
		'change input#volumeRender': 'toggleVolumeRender',
		'mousedown': 'setMouseDown',
		'mouseup': 'setMouseUp',
		'mousemove': 'mouseHandler',
		'mouseenter canvas': 'mouseEnter',
		'keydown': 'keyHandler',
	    });
	},
	render:function() {
	    console.log('CanvasViewer3D.render()');

	    this.undelegateEvents();

	    $(this.el).html(this.template({
		topbarId: 'topbar' + this.panelId,
		canvasViewerId: 'canvasViewer' + this.panelId,
	    }));

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


	    //re-check volume render toggle if internal attrib is set
	    if(this.doVolumeRender){
		this.doVolumeRender = true;

		//if not toggled, set toggle
		$('#volumeRender', this.el).prop("checked", true);
		
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

		if(e.button == 0){
		    //rotating - LEFT CLICK
		
		    Backbone.trigger('rotate', 
				     [this.mouseXPrev - this.mouseX,
				      this.mouseYPrev - this.mouseY,
				      this.currentLayerItemTop, 
				      this.mode]);

		    this.mouseXPrev = this.mouseX;
		    this.mouseYPrev = this.mouseY;
		}
		else if(e.button == 1){
		    //panning - MIDDLE MOUSE CLICK
		    Backbone.trigger('pan3D', 
				     [this.mouseXPrev - this.mouseX,
				      this.mouseYPrev - this.mouseY,
				      this.currentLayerItemTop, 
				      this.mode]);

		    this.mouseXPrev = this.mouseX;
		    this.mouseYPrev = this.mouseY;
		}
		else if(e.button == 2){
		    //zooming - RIGHT CLICK		   
		    Backbone.trigger('zoom3D', 
				     [false,
				      this.mouseYPrev - this.mouseY,
				      this.currentLayerItemTop, 
				      this.mode]);
		    
		    this.mouseXPrev = this.mouseX;
		    this.mouseYPrev = this.mouseY;
		}
	    }
	},
	mouseWheelHandler:function(e){
	    //console.log('CanvasViewer3D.mouseWheelHandler()');	    

	    if(this.currentLayerItemTop){

		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		Backbone.trigger('zoom3D', 
				 [true,
				  -(delta),
				  this.currentLayerItemTop, 
				  this.mode]);
	    }

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

	    this.mouseXPrev = e.clientX - this.canvas.offsetLeft;
	    this.mouseYPrev = e.clientY - this.canvas.offsetTop;

	    
	},
	setOpacity:function(){

	    if(this.ctx && this.currentLayerItemTop && this.currentLayerItemBottom){
		this.alphaA = this.currentLayerItemTop.get('opacity')/100;
		this.alphaB = this.currentLayerItemBottom.get('opacity')/100;
	    };
	},
	setAnnotations:function(annoArray){
	    console.log('CanvasViewer3D.setAnnotations() ===================');

	    //convert 3D data to an XCube!

	    //wipe the current annotations
	    this.annotations = [];

	    //DELETE ALL OBJECTS AND TOPLEVEL OBJECTS
	    for(var j = 0; j < this.Xrenderer.topLevelObjects.length; j++){
		if(this.Xrenderer.topLevelObjects[j]._classname == "cube"){
		    this.Xrenderer.topLevelObjects.splice(j, 1);		    
		    j -= 1;
		}
	    }

	    for(var j = 0; j < this.Xrenderer.objects._array.length; j++){
		if(this.Xrenderer.objects._array[j]._classname == "cube"){
		    this.Xrenderer.objects.remove(this.Xrenderer.objects._array[j]);
		    j -= 1;
		}
	    }


	    for(var i = 0; i < annoArray.length; i++){
		//create new object to avoid issues with same reference objects

		if(annoArray[i].visible){

		    var annoObject = annoArray[i].clone();



		    //annoObject["label"] = annoArray[i]["label"];
		    //annoObject["points3D"] = annoArray[i]["points3D"];
		    //annoObject["color"] = annoArray[i]["color"];

		    //update local array
		    this.annotations.push(annoObject);
		    
		    //add cube
		    cube = new X.cube();
		    cube.opacity = 0.5;

		    //determine center of XML OBJ
		    
		    //var annoCenter = this.getAnnoCenter(annoObject["points3D"]);
		    var annoCenter = annoObject.getCenterPoint3D();
		    
		    var volume = this.Xrenderer.topLevelObjects[0];
		    var x = annoCenter[0] * volume._childrenInfo[0]._sliceSpacing - 
			volume._childrenInfo[0]._originD;
		    var y = annoCenter[1] * volume._childrenInfo[1]._sliceSpacing -
			volume._childrenInfo[1]._originD;
		    var z = annoCenter[2] * volume._childrenInfo[2]._sliceSpacing -
			volume._childrenInfo[2]._originD;

		    cube.center = [x, y, z];

		    //determine dimensions

		    var dimensions = annoObject.getDimensions3D();

		    cube.lengthX = Math.abs(dimensions[0] * volume._childrenInfo[0]._sliceSpacing);
		    cube.lengthY = Math.abs(dimensions[1] * volume._childrenInfo[1]._sliceSpacing);
		    cube.lengthZ = Math.abs(dimensions[2] * volume._childrenInfo[2]._sliceSpacing);

		    cube.color = annoObject.getColorArray();
		    //add cube to viewer

		    this.Xrenderer.add(cube);
		}
	    }
	    //this.annotations
	},
	setToBlack:function(){	    
	    
	    //console.log('CanvasViewer2D.setToBlack()');

	    this.ctx.fillStyle = 'black';
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	},
	toggleVolumeRender:function(){

	    console.log('CanvasViewer3D.toggleVolumeRender()');

	    if (!this.doVolumeRender){
		this.doVolumeRender = true;

		//if not toggled, set toggle
		$('#volumeRender', this.el).prop("checked", true);
		this.viewerWindowView.setVolumeRender(true);
		
	    }
	    else{
		this.doVolumeRender = false;
		$('#volumeRender', this.el).prop("checked", false);
		this.viewerWindowView.setVolumeRender(false);
	    }


	},
	update:function(){


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
