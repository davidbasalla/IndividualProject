  // include all used X-classes here
  // this is only required when using the xtk-deps.js file

function myFunction()
{
    
    goog.require('X.renderer3D');
    goog.require('X.cube');
    
    var run = function() {
	
	var r = new X.renderer3D();
	r.container = 'r';
	r.init();
	
	var cube = new X.cube();
	
	r.add(cube);
	
	r.render();
	
    };
    
