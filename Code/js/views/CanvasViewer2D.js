//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer", "classes/Annotation"], 
       function(CanvasViewer2DTemplate, CanvasViewer, Annotation) {
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
		else if(e.button == 0){


		    //test for annotation overlap first!!	    
		    if(this.manipulatorSelected)
			this.setManipulatorTransformation();
		    else{
			this.traversing = true;

			Backbone.trigger('traverse', 
					 [this.mouseX,
					  this.mouseY,
					  this.currentLayerItemTop, 
					  this.mode]);
			this.setAnnotations(this.annotations);
		    }
		}
		else if(e.button == 1){
		    //console.log('Panning!');

		    //return normalised/relative mouse data
		    var x = this.mouseXPrev - e.clientX;
		    var y = this.mouseYPrev - e.clientY;


		    //Backbone.trigger('pan', [x, y, this.currentLayerItemTop, this.mode]);

		    //tap into renderer directly, should be faster!
		    this.Xrenderer.camera.view[12] += -x/4;
		    this.Xrenderer.camera.view[13] += y/4;

		    this.mouseXPrev = e.clientX;
		    this.mouseYPrev = e.clientY;

		    this.setAnnotations(this.annotations);
		}
		else if(e.button == 2){
		    //console.log('Zooming!');

		    //return normalised/relative mouse data
		    var z = this.mouseZPrev - e.clientY;

		    Backbone.trigger('zoom', [z, this.currentLayerItemTop, this.mode]);

		    this.mouseZPrev = e.clientY;

		    this.setAnnotations(this.annotations);
		}
	    }
	},
	keyHandler:function(e){
	    //console.log('CanvasViewer2D.keyHandler()');
	    //console.log(e.which);
	    
	    if(e.which == 70){
		Backbone.trigger('focus', [this.currentLayerItemTop, this.mode]);
		this.setAnnotations(this.annotations);
	    }
	    if(e.which == 79){
		this.toggleOverlay();
	    }
	},
	setMouseDown:function(e){
	    this.mouseDown = true;
	    this.storeMousePos(e);
	    this.checkForManipulator(e);
	},
	setMouseUp:function(e){
	    this.mouseDown = false;
	    this.traversing = false;

	    if(this.manipulatorSelected){
		
		this.updateAnnoPoints3D();
		this.manipulatorSelected = null;
	    }
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

		this.setAnnotations(this.annotations);
	    }

	},
	setOpacity:function(){

	    if(this.ctx && this.currentLayerItemTop && this.currentLayerItemBottom){
		this.alphaA = this.currentLayerItemTop.get('opacity')/100;
		this.alphaB = this.currentLayerItemBottom.get('opacity')/100;
	    };
	},
	setAnnotations:function(annoArray){
	    console.log('CanvasViewer2D.setAnnotations() =====================');
	    //need to create a copy of the array here, as we're changing
	    //attrs like points2D per renderer!
	    
	    //wipe local array
	    console.log(this.annotations);
	    this.annotations = [];

	    for(var i = 0; i < annoArray.length; i++){

		var annoObj = annoArray[i].clone();

		annoObj.points2D = this.convertPoints(annoArray[i])
		annoObj.labelPos = this.calculateLabelPoint(annoObj.points2D);	
		annoObj.manipulators = this.setManipulators(annoObj);

		this.annotations.push(annoObj);
	    };
	},
	setManipulators:function(annoObject){	    
	    console.log('CanvasViewer2D(' + this.mode + ').setManipulators()');

	    //possible another function that should be part of 
	    //annoObject class?
	    var manipArray = [];
	    if(annoObject.points2D){
		
		//per corner, create one manipulatorRect
		var pointsArray = annoObject.points2D;
		for(var i = 0; i < pointsArray.length; i++){
		    
		    //add manipArray
		    var manipulator = {
			x:pointsArray[i][0],
			y:pointsArray[i][1],
			width: 5,
			parent:annoObject,
			color: '#FFFFFF',
			//put intersect function here
		    };
		    manipArray.push(manipulator);
		}
	    }
	    return manipArray;
	},
	checkForManipulator:function(mouseEvent){
	    console.log('CanvasViewer.checkForManipulator()');

	    //check for annotations
	    if(this.annotations){
		var mouseX = mouseEvent.clientX - this.canvas.offsetLeft;
		var mouseY = mouseEvent.clientY - this.canvas.offsetTop;

		for(var i = 0; i < this.annotations.length; i++){
		    //check for manipulators
		    if(this.annotations[i].manipulators){
			for(var j = 0; j < this.annotations[i].manipulators.length; j++){

			    var manip = this.annotations[i].manipulators[j];
			    
			    if(mouseX > manip.x - manip.width &&
			       mouseX < manip.x + manip.width &&
			       mouseY > manip.y - manip.width &&
			       mouseY < manip.y + manip.width){
				//console.log('HIT!!!!');

				//set currently selected manipulator
				this.manipulatorSelected = manip;
			    }
			    	
			}
		    }
		}
	    }
	},
	setManipulatorTransformation:function(){
	    console.log('CanvasViewer2D.setManipulatorTransformation()');
	    //grab global manipulator
	    //grab global mouse coords



	    //find points in annoObject that match this

	    var parent = this.manipulatorSelected.parent;
	    for(var i = 0; i < parent.points2D.length; i++){
		if(parent.points2D[i][0] == this.manipulatorSelected.x)
		    parent.points2D[i][0] = this.mouseX;
		if(parent.points2D[i][1] == this.manipulatorSelected.y)
		    parent.points2D[i][1] = this.mouseY;
	    }


	    //find other manips who match this
	    for(var j = 0; j < parent.manipulators.length; j++){
		if(this.manipulatorSelected == parent.manipulators[j])
		    continue;
		else{
		    if(parent.manipulators[j].x == this.manipulatorSelected.x)
			parent.manipulators[j].x = this.mouseX;
		    if(parent.manipulators[j].y == this.manipulatorSelected.y)
			parent.manipulators[j].y = this.mouseY;
		}	
	    }


	    //do the main manipulator
	    this.manipulatorSelected.x = this.mouseX;
	    this.manipulatorSelected.y = this.mouseY;

	    parent.labelPos = this.calculateLabelPoint(parent.points2D);
	},
	updateAnnoPoints3D:function(){	    
	    console.log('CanvasViewer2D.updateAnnoPoints3D()');
	    /*convert new points2D to points3D to save in annotation and update
	      throughout program */

	    var points3D = [];
	    var parent = this.manipulatorSelected.parent;

	    var _x = 0, _y = 1, _z = 2;
	    if(this.mode == 1){
		//console.log('MODE 1!');
		_z = 0;
		_x = 1;
		_y = 2;
	    }
	    else if(this.mode == 2){
		//console.log('MODE 2!');
		_z = 1;
		_x = 0;
		_y = 2;
	    }
	    else if(this.mode == 3){
		//console.log('MODE 3!');
		_z = 2;
		_x = 0;
		_y = 1;
	    }	    

	    //do depth matching
	    var minMaxDepth = parent.getMinMaxValues(_z);

	    for(var i = 0; i < parent.points2D.length; i++){
		
		var _ijk = this.Xrenderer.xy2ijk(parent.points2D[i][0],
						 parent.points2D[i][1])[0];
	    
		var point1 = [0,0,0];
		point1[_z] = minMaxDepth[0];
		point1[_x] = _ijk[_x];
		point1[_y] = _ijk[_y];
	    
		var point2 = [0,0,0];
		point2[_z] = minMaxDepth[1];
		point2[_x] = _ijk[_x];
		point2[_y] = _ijk[_y];

		points3D.push(point1);
		points3D.push(point2);
	    }
		
	    //reset the points!
	    parent["points3D"] = points3D;
	    //console.log(this.annotations);
	    this.currentLayerItemTop.set({
		annotations: this.annotations
	    });
	    //console.log(this.currentLayerItemTop.get('annotations'));

	},
	convertPoints:function(annoObj){
	    console.log('CanvasViewer2D.convertPoints()');

	    var points2D = [];
	    var points3D = annoObj.points3D;

	    //given 8 points, need to extract the 4 corner points of the drawn cube

	    //X-Dir

	    var a = 0, b = 1, c = 2;
	    var curIndex = 0;

	    depthCoords = [];
	    if (this.mode == 1){
		//X
		a = 0;
		b = 1;
		c = 2;
		curIndex =  this.currentLayerItemTop.get('indexX');
	    }
	    else if (this.mode == 2){
		//Y
		a = 1;
		b = 0;
		c = 2;		
		curIndex =  this.currentLayerItemTop.get('indexY');
	    }
	    else if (this.mode == 3){
		//Z
		a = 2;
		b = 0;
		c = 1;		
		curIndex =  this.currentLayerItemTop.get('indexZ');
	    }

	    //do depth matching
	    var minMaxDepth = annoObj.getMinMaxValues(a);

	    if(minMaxDepth[0] <= curIndex && curIndex <= minMaxDepth[1]){
		console.log('DEPTH-WISE INSIDE THE ANNOTATION!!!');

		//discard etra points, return 4 2D points based on sliceIndex
		
		var culledPoints = [];
		for(var i = 0; i < points3D.length; i++){

		    var point = [points3D[i][b], points3D[i][c]];
		    
		    var pointExists = false;
		    for(var j = 0; j < culledPoints.length; j++){
			if(_.isEqual(point, culledPoints[j]))
			    pointExists = true;
		    }
		    if(!pointExists)
			culledPoints.push(point);	    
		}
		

		//expecting an XtkView here
		if(!this.Xrenderer){
		    console.log('No Xtk Viewer found');
		    return;
		}
		else{
		    //convert these points to XY format
		    //need to run a ij2xy function
		    for (var i = 0; i < culledPoints.length; i++){

			var point = this.Xrenderer.ij2xy(
			    culledPoints[i][0], culledPoints[i][1]);
			
			points2D.push(point);		
		    }
		}
	    }
	    else 
		console.log('DEPTH-WISE OUTSIDE THE ANNOTATION!!!');

	    //need to sort the points, so no Z-formation gets created
	    points2D = this.sortPointsForRectangle(points2D);

	    return points2D;
	},
	sortPointsForRectangle:function(pointsArray){
	    //super simplistic at the moment
	    //assumes that the points are legal, could go into a loop!
	    //compares x and y, sorts by assuming that one dimensions of
	    //next point is equal to last point

	    //use the method that takes a centre point and then measures the angle of each new
	    //point and sort by angle distance!

	    var sortedPoints = [];

	    while(pointsArray.length != 0){

		var point = pointsArray.shift();
		if(!sortedPoints.length){
		    sortedPoints.push(point);
		}
		else{
		    if(point[0] == sortedPoints[sortedPoints.length - 1][0] ||
		       point[1] == sortedPoints[sortedPoints.length - 1][1]){
			sortedPoints.push(point)
		    }
		    else{
			pointsArray.push(point);
		    }
		}
	    }
	    return sortedPoints;
	},
	calculateLabelPoint:function(pointsArray2D){
	    //console.log('CanvasViewer2D.setToBlack()');
	    //if space at top left, put there

	    if(pointsArray2D){
		var labelPoint = [];
		
		var xArray = [], yArray = [];
		
		for(var i = 0; i < pointsArray2D.length; i++){
		    //console.log(pointsArray2D[i]);
		    xArray.push(pointsArray2D[i][0]);
		    yArray.push(pointsArray2D[i][1]);
		}	
	    var Xmin = Math.min.apply(Math, xArray);
		var Ymin = Math.min.apply(Math, yArray);
		
		//IF SPACE AT TOP
		labelPoint[0] = Xmin;
		labelPoint[1] = Ymin - 10;
		
		return labelPoint;
	    }
	    else
		return[0,0];
	},
	setToBlack:function(){	    
	    
	    //console.log('CanvasViewer2D.setToBlack()');

	    this.ctx.fillStyle = 'black';
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	},
	update:function(){

	    this.setAnnotations(this.annotations);

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
	    
	    if(this.annotations){
		this.drawAnnotation();
	    }

	    if(this.showOverlay)
		this.drawOverlay();

	    if(this.showLine)
		this.drawLine();

	    if(this.traversing)
		this.drawCrosshair();

	},
	drawAnnotation:function(){
	    //console.log('drawAnnotation()');

	    //draw a bunch of given points
	    //need a way to convert the points from the annotation into 2D points


	    //do this loop per annotation

	    for(var j = 0; j < this.annotations.length; j++){

		var pointsArray2D = this.annotations[j]["points2D"];

		if(pointsArray2D.length == 0)
		    continue;

		this.ctx.globalAlpha = 1;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		
		//first point
		this.ctx.moveTo(pointsArray2D[0][0], pointsArray2D[0][1]);
		
		//loop through rest of points
		for(var i = 1; i < pointsArray2D.length; i++){
		    this.ctx.lineTo(pointsArray2D[i][0], pointsArray2D[i][1]);
		}
		//close loop
		this.ctx.lineTo(pointsArray2D[0][0], pointsArray2D[0][1]);
			
		//get color here from model
		this.ctx.strokeStyle = this.annotations[j]["color"];
		
		//draw and finish
		this.ctx.stroke();
		this.ctx.closePath();

		//draw manipulators

		for(var i = 0; i < this.annotations[j].manipulators.length; i++){
		    this.drawManipulator(this.annotations[j].manipulators[i]);
		}



		//do label		
		if(this.annotations[j].label || this.annotations[j].labelPos){
		    this.ctx.font="15px Arial";
		    this.ctx.fillStyle = this.annotations[j]["color"];
		    this.ctx.fillText(this.annotations[j].label, 
				 this.annotations[j].labelPos[0], 
				 this.annotations[j].labelPos[1]);
		}
	    }
	},
	drawManipulator:function(manipulator){

	    this.ctx.beginPath();
	    this.ctx.lineWidth="10px";
	    this.ctx.fillStyle = manipulator.parent.color;
	    this.ctx.rect(manipulator.x - manipulator.width, 
			  manipulator.y - manipulator.width, 
			  manipulator.width*2, 
			  manipulator.width*2);
	    //this.ctx.stroke();

            this.ctx.fill();
	    
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
