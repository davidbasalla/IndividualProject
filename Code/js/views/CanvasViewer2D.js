//need to pass a variable here

define(["text!templates/CanvasViewer2D.html",
	"views/CanvasViewer",
	"classes/Annotation",
	"classes/Point2D"], 
       function(CanvasViewer2DTemplate, 
		CanvasViewer, 
		Annotation,
		Point2D){
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

	    if(!this.mouseDown){
		this.checkForPoint2DHit(e);
	    }
	    else if(this.mouseDown){
		this.mouseX = e.clientX - this.canvas.offsetLeft;
		this.mouseY = e.clientY - this.canvas.offsetTop;

		if(e.ctrlKey){
		    this.clipPosX = this.canvas.width - this.mouseX;
		    
		    this.showLine = true;
		}
		else if(e.button == 0){


		    //test for annotation overlap first!!	    
		    if(this.point2DSelected){
			this.setPoint2DTransformation();
			//this.updateAnnoPoints3D();
		    }
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
	    //this.checkForManipulator(e);
	},
	setMouseUp:function(e){
	    this.mouseDown = false;
	    this.traversing = false;

	    if(this.point2DSelected){
		
		this.updateAnnoPoints3D();
		this.point2DSelected = null;
	    }
	},
	storeMousePos:function(e){
	    //console.log('storeMousePos');

	    this.mouseXPrev = e.clientX;
	    this.mouseYPrev = e.clientY;
	    this.mouseZPrev = e.clientY;
	    
	},
	toggleOverlay:function(){

	    //console.log('CanvasViewer2D.toggleOverlay()');

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
	    //console.log(this.annotations);
	    this.annotations = [];

	    for(var i = 0; i < annoArray.length; i++){

		var annoObj = annoArray[i].clone();

		annoObj.points2D = this.convertTo2DPoints(annoArray[i])
		annoObj.sort2DPointsForRect();
		annoObj.set2DPointParents();
		annoObj.calculateLabelPos();

		this.annotations.push(annoObj);
	    };
	},
	checkForPoint2DHit:function(mouseEvent){
	    //console.log('CanvasViewer.checkForManipulator()');

	    //check for annotations
	    if(this.annotations){
		var mouseX = mouseEvent.clientX - this.canvas.offsetLeft;
		var mouseY = mouseEvent.clientY - this.canvas.offsetTop;

		for(var i = 0; i < this.annotations.length; i++){
		    if(this.annotations[i].visible){
			//check for manipulators
			if(this.annotations[i].points2D){
			    for(var j = 0; j < this.annotations[i].points2D.length; j++){

				var point = this.annotations[i].points2D[j];
				
				if(mouseX > point.x - point.width &&
				   mouseX < point.x + point.width &&
				   mouseY > point.y - point.width &&
				   mouseY < point.y + point.width){
				    //console.log('HIT!!!!');

				    //set currently selected manipulator
				    this.point2DSelected = point;
				    return;
				}
				else
				    this.point2DSelected = null;
			    }
			}		    
		    }
		}
	    }
	},
	setPoint2DTransformation:function(){
	    //console.log('CanvasViewer2D.setManipulatorTransformation()');

	    //move the actual point - other points handled internally
	    this.point2DSelected.parent.move2DPoint(
		this.point2DSelected, this.mouseX, this.mouseY);

	    //UPDATE LABEL POS
	    this.point2DSelected.parent.calculateLabelPos();

	},
	updateAnnoPoints3D:function(){	    
	    //console.log('CanvasViewer2D.updateAnnoPoints3D()');
	    /*convert new points2D to points3D to save in annotation and update
	      throughout program */

	    var points3D = [];
	    var parent = this.point2DSelected.parent;

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
		
		var _ijk = this.Xrenderer.xy2ijk(parent.points2D[i].x,
						 parent.points2D[i].y);

		var point1 = [0,0,0];
		point1[_z] = minMaxDepth[0];
		point1[_x] = _ijk[0][_x];
		point1[_y] = _ijk[0][_y];
	    
		var point2 = [0,0,0];
		point2[_z] = minMaxDepth[1];
		point2[_x] = _ijk[0][_x];
		point2[_y] = _ijk[0][_y];

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
	convertTo2DPoints:function(annoObj){
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
		//console.log('DEPTH-WISE INSIDE THE ANNOTATION!!!');

		//discard etra points, return 4 2D points based on sliceIndex
		
		var culledPoints = [];
		var culledPoints3D = [];

		for(var i = 0; i < points3D.length; i++){

		    var point = [points3D[i][b], points3D[i][c]];
		    
		    var pointExists = false;
		    for(var j = 0; j < culledPoints.length; j++){
			if(_.isEqual(point, culledPoints[j]))
			    pointExists = true;
		    }
		    if(!pointExists){
			culledPoints.push(point);	    
			culledPoints3D.push(points3D[i]);
		    }
		}
		

		//expecting an XtkView here
		if(!this.Xrenderer){
		    console.log('No Xtk Viewer found');
		    return;
		}
		else{
		    //convert these points to XY format
		    //need to run a ij2xy function
		    for (var i = 0; i < culledPoints3D.length; i++){

			//console.log('RUNNING CONVERSIONS!');

			//console.log('CULLED POINT = ' + culledPoints3D[i]);


			/*
			var point = this.Xrenderer.ijk2xy([
			    curIndex,
			    culledPoints[i][0], 
			    culledPoints[i][1]]);*/

			var point = this.Xrenderer.ijk2xy(culledPoints3D[i]);

			//console.log('2D_POINT = ' + point);
			

			//FOR TESTING
			/*
			var _ijk = this.Xrenderer.xy2ijk(point[0],
							 point[1]);

			console.log('IJK0 = ' + _ijk[0]);*/
			//console.log('IJK1 = ' + _ijk[1]);
			//console.log('IJK2 = ' + _ijk[2]);

			////////////////////////////////////

			var point2D = new Point2D();
			point2D.x = point[0];
			point2D.y = point[1];
			point2D.width = 5;
			//point2D.parent = annoObj;

			//console.log('PUSHING:' + point[0] + ', ' + point[1]);
			

			//console.log(point2D);

			points2D.push(point2D);		
		    }
		}
	    }
	    else 
		console.log('DEPTH-WISE OUTSIDE THE ANNOTATION!!!');

	    //need to sort the points, so no Z-formation gets created
	    //points2D = this.sortPointsForRectangle(points2D);

	    return points2D;
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

		if(this.annotations[j].visible){

		    var pointsArray2D = this.annotations[j]["points2D"];

		    if(pointsArray2D.length == 0)
			continue;

		    this.ctx.globalAlpha = 1;
		    this.ctx.lineWidth = 2;
		    this.ctx.beginPath();
		    
		    //first point
		    this.ctx.moveTo(pointsArray2D[0].x, pointsArray2D[0].y);

		    //loop through rest of points
		    for(var i = 1; i < pointsArray2D.length; i++){
			this.ctx.lineTo(pointsArray2D[i].x, pointsArray2D[i].y);
		    }
		    //close loop
		    this.ctx.lineTo(pointsArray2D[0].x, pointsArray2D[0].y);
		    
		    //get color here from model
		    this.ctx.strokeStyle = this.annotations[j]["color"];
		    
		    //draw and finish
		    this.ctx.stroke();
		    this.ctx.closePath();


		    //draw manipulators
		    for(var i = 0; i < pointsArray2D.length; i++)
			this.drawManipulator(pointsArray2D[i], this.annotations[j].color);


		    //do label		
		    if(this.annotations[j].label || this.annotations[j].labelPos){
			this.ctx.font="15px Arial";
			this.ctx.fillStyle = this.annotations[j]["color"];
			this.ctx.fillText(this.annotations[j].label, 
					  this.annotations[j].labelPos[0], 
					  this.annotations[j].labelPos[1]);
		    }
		}
	    }
	},
	drawManipulator:function(point2D, color){
	   
	    this.ctx.beginPath();
	    this.ctx.lineWidth="1px";	    
	    if(point2D == this.point2DSelected)	    
		this.ctx.fillStyle = "#FFFFFF";
	    else
		this.ctx.fillStyle = "#000000";			

	    this.ctx.rect(point2D.x - point2D.width, 
			  point2D.y - point2D.width, 
			  point2D.width*2, 
			  point2D.width*2);
	    this.ctx.fill();
	    
	    //OUTLINE
	    this.ctx.beginPath();
	    this.ctx.lineWidth="2px";
	    this.ctx.strokeStyle = color;
    
	    this.ctx.rect(point2D.x - point2D.width, 
			  point2D.y - point2D.width, 
			  point2D.width*2, 
			  point2D.width*2)
            this.ctx.stroke();
	    this.ctx.closePath();
	},
	drawLine:function(){

	    this.ctx.globalAlpha = 1;
	    this.ctx.lineWidth = 1;
	    this.ctx.beginPath();
	    this.ctx.moveTo(this.mouseX, 0);
	    this.ctx.lineTo(this.mouseX, this.canvas.height);

	    this.ctx.strokeStyle = 'red';
	    this.ctx.stroke();
	    this.ctx.closePath();
	    
	    this.showLine = false;

	},
	drawCrosshair:function(){
	    //console.log('TRAVERSE');

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
