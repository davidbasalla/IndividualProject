define([], function(){
    var Annotation = function () {
	this.shape = "cube";
	this.label = "test";
	this.color = "#888888";
	this.points3D = [];
	this.visible = true;

	this.print = function () {
	    console.log('BLAH');
	};

	this.clone = function () {
	    var annoObj = {};
	    jQuery.extend(annoObj, this);
	    return annoObj;
	};
	
	//MINMAX 3D
	this.getMinMaxValues = function(dir){
	    var max = Number.NEGATIVE_INFINITY;
	    var min = Number.POSITIVE_INFINITY;
	    
	    for(var i = 0; i < this.points3D.length; i++){
		if(this.points3D[i][dir] > max)
		    max = this.points3D[i][dir];		
		if(this.points3D[i][dir] < min)
		    min = this.points3D[i][dir];
	    }
	    return [min, max];
	};

	//MINMAX 2D
	this.getMinMax2D = function(dir){
	    //0 = X
	    //1 = Y

	    var max = Number.NEGATIVE_INFINITY;
	    var min = Number.POSITIVE_INFINITY;
	    
	    for(var i = 0; i < this.points2D.length; i++){

		var val = 0;
		if(dir == 0)
		    val = this.points2D[i].x;
		else if (dir == 1)
		    val = this.points2D[i].y;


		if(val > max)
		    max = val;		
		if(val < min)
		    min = val;
	    }
	    return [min, max];
	};


	this.sort2DPointsForRect = function(){

	    var sortedPoints = [];

	    while(this.points2D.length != 0){

		var point = this.points2D.shift();
		if(!sortedPoints.length){
		    sortedPoints.push(point); //push the first point
		}
		else{
		    if(point.x == sortedPoints[sortedPoints.length - 1].x ||
		       point.y == sortedPoints[sortedPoints.length - 1].y){
			sortedPoints.push(point)
		    }
		    else{
			this.points2D.push(point); //return to array if no match
		    }
		}
	    }
	    this.points2D = sortedPoints;	    
	};
	
	this.calculateLabelPos = function(){
	    
	    var labelPoint = [];
	    if(this.points2D){
		
		//could actually store these locally!
		var minMaxX = this.getMinMax2D(0);
		var minMaxY = this.getMinMax2D(1);
		
		//IF SPACE AT TOP
		labelPoint[0] = minMaxX[0];
		labelPoint[1] = minMaxY[0] - 10;
	    }		
	    this.labelPos = labelPoint;
	};
	
	this.set2DPointParents = function(){
	    
	    for(var i = 0; i < this.points2D.length; i++)
		this.points2D[i].parent = this;
	};
	
	this.move2DPoint = function(point2D, mouseX, mouseY){

	    var minMaxX = this.getMinMax2D(0);
	    var minMaxY = this.getMinMax2D(1);

	    if((point2D.x == minMaxX[0] && mouseX < minMaxX[1] - 15) ||
	       (point2D.x == minMaxX[1] && mouseX > minMaxX[0] + 15)){
		var xNeighbor = this.getNeighbor2DPoint(point2D, 0);
		xNeighbor.x = mouseX;
    		point2D.x = mouseX;
	    }
	    

	    if((point2D.y == minMaxY[0] && mouseY < minMaxY[1] - 15) ||
	       (point2D.y == minMaxY[1] && mouseY > minMaxY[0] + 15)){
		var yNeighbor = this.getNeighbor2DPoint(point2D, 1);
		yNeighbor.y = mouseY;
		point2D.y = mouseY;
	    }
	};

	this.getNeighbor2DPoint = function(point2D, dir){
	    //get the neighboring points on either side


	    var neighbor = null;
	    var val = null;
	    var valSrc = null;
	    
	    for(var i = 0; i < this.points2D.length; i++){
		//exclude src point
		if(this.points2D[i] != point2D){

		    if(dir == 0){
			val = this.points2D[i].x;
			valSrc = point2D.x;
		    }
		    else if(dir == 1){
			val = this.points2D[i].y;
			valSrc = point2D.y;
		    }

		    if(val == valSrc) 
			return(this.points2D[i]);
		}
	    }
	    return null;
	};

    };
    return Annotation;
});

/*

X.....X
.     .
.     .
.     .
X.....X

*/
