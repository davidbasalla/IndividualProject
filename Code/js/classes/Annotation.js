define([], function(){
    var Annotation = function () {
	this.shape = "cube";
	this.label = "test";
	this.color = "#888888";
	this.points3D = [];


	this.print = function () {
	    console.log('BLAH');
	};

	this.clone = function () {
	    var annoObj = {};
	    jQuery.extend(annoObj, this);
	    return annoObj;
	};
	
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
    };
    return Annotation;
});
