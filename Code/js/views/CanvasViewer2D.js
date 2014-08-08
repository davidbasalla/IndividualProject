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
		    this.setAnnotations(this.annotations);
		}
		else if(e.buttons == 4){
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
		else if(e.buttons == 2){
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
	    //console.log('CanvasViewer2D.setAnnotations()');
	    //NEED TO FORCE THIS TO REDRAW WHENEVER CHANGING INDEX...
	    
	    //wipe local array
	    this.annotations = [];

	    for(var i = 0; i < annoArray.length; i++){
		//create new object to avoid issues with same reference objects
		var annoObject = {};

		annoObject["label"] = annoArray[i]["label"];
		annoObject["points3D"] = annoArray[i]["points3D"];
		annoObject["points2D"] = this.convertPoints(annoObject["points3D"]);
		annoObject["labelPos"] = this.calculateLabelPoint(annoObject["points2D"]);
		annoObject["color"] = annoArray[i]["color"];

		//update local array
		this.annotations.push(annoObject);
	    }
	},
	convertPoints:function(points3D){
	    console.log('CanvasViewer2D.convertPoints()');
	    console.log('MODE = ' + this.mode);


	    var points2D = [];

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
	    var maxDepth = 0;
	    var minDepth = Number.POSITIVE_INFINITY;

	    for(var i = 0; i < points3D.length; i++){

		if(points3D[i][a] > maxDepth)
		    maxDepth = points3D[i][a];
		else if(points3D[i][a] < minDepth)
		    minDepth = points3D[i][a];
	    }

	    console.log('DEPTH = ' + minDepth + ' - ' + maxDepth);

	    if(minDepth <= curIndex && curIndex <= maxDepth){
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
		
		//console.log('CULLED POINTS = ');
		//console.log(culledPoints);

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

		var point = pointsArray.shift()
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

	    //if space at top left, put there

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
	    labelPoint[1] = Ymin - 5;

	    return labelPoint;
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

		//console.log(this.annotations);
		//console.log(this.annotations[j]);
		var pointsArray2D = this.annotations[j]["points2D"];

		if(pointsArray2D.length == 0)
		    return;

		//var pointsArray2D = this.convertPoints(annos[j]);

		/*
		var pointsArray2D = [[10,10],
				     [0,100],
				     [100,100],
				     [100,0]];*/

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
