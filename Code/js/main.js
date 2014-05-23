function myFunction()
{

    console.log('Loading the viewer')

    //create _data dataholder
    createData();


    _webGLFriendly = true;
    try {
	// try to create and initialize a 3D renderer
	threeD = new X.renderer3D();
	threeD.container = '3d';
	threeD.init();
    } catch (Exception) {
	
	// no webgl on this machine
	_webGLFriendly = false;
	
    }
    
    //get file from viewer
    var filePicker = document.getElementById("filePicker");
    console.log(filePicker.files[0]);

    var f = filePicker.files[0];

    var _fileName = f.name;
    var _fileExtension = _fileName.split('.').pop().toUpperCase();


    //add data to data_holder
    _data['volume']['file'].push(f);



    ///////////////////////////////////////////////

    //load file into volume
    
    // create the 2D renderer for X
    sliceX = new X.renderer2D();
    sliceX.container = 'sliceX';
    sliceX.orientation = 'X';
    sliceX.init();
    
    var sliceY = new X.renderer2D();
    sliceY.container = 'sliceY';
    sliceY.orientation = 'Y';

    sliceY.init();
    // .. and for Z
    var sliceZ = new X.renderer2D();
    sliceZ.container = 'sliceZ';
    sliceZ.orientation = 'Z';
    sliceZ.init();
    
    ///////////////////////////////////////////////////

    // we now have the following data structure for the scene
    window.console.log('New data', _data);

    var _types = Object.keys(_data);
    console.log(_types);

    // number of total files - legacy from SliceDrop code
    var _numberOfFiles = 1;
    var _numberRead = 0;
    console.log('Total new files:', _numberOfFiles);


    //
    // the HTML5 File Reader callbacks
    //

    // setup callback for errors during reading
    var errorHandler = function(e) {

	console.log('Error:' + e.target.error.code);

    };

    var cube = new X.cube();
    // the cube is red
    cube.color = [1, 0, 0];
    // captions appear on mouse over
    cube.caption = 'a cube';



    
    // setup callback after reading
    var loadHandler = function(type, file) {

	return function(e) {

	    // reading complete
	    var data = e.target.result;

	    // might have multiple files associated
	    // attach the filedata to the right one
	    _data[type]['filedata'][_data[type]['file'].indexOf(file)] = data;

	    _numberRead++;
	    if (_numberRead == _numberOfFiles) {

		// all done, start the parsing
		//parse(_data);   

		// we have a volume
		volume = new X.volume();
		volume.file = _data['volume']['file'].map(function(v) {
		    return v.name;
		});

		volume.filedata = _data['volume']['filedata'];
		console.log('Opac = ' + volume.opacity);
		volume.opacity = 0.0;
		console.log('Opac = ' + volume.opacity);

		console.log('Image:');
		console.log(volume.image);
		//console.log(volume.indexX);
		
		sliceX.add(volume);
		sliceX.add(cube);
		sliceX.render();
		
	    }
	    
	};
    };



    // the onShowtime method gets executed after all files were fully loaded and
    // just before the first rendering attempt
    sliceX.onShowtime = function() {
	
	//
	// add the volume to the other 3 renderers
	//

	sliceY.add(volume);
	sliceY.render();
	sliceY.ga.height = 150;
	//var ctx = sliceY.ga.getContext("2d");

	//ctx.fillStyle="#FF0000";
	//ctx.fillRect(0,0,150,75);
	//console.log(ctx);
	
	var myCanvas = document.getElementById("myCanvas");
	var myCtx=myCanvas.getContext("2d");

	myCtx.fillStyle="#FF0000";
	myCtx.fillRect(0,0,150,75);
	console.log(myCtx);
	
	//console.log(ctx);
	

	sliceZ.add(volume);
	sliceZ.render();
	
	if (_webGLFriendly) {
	    threeD.add(volume);
	    threeD.add(cube);
	    threeD.render();
	}


	var gui = new dat.GUI();
	
	// the following configures the gui for interacting with the X.volume
	var volumegui = gui.addFolder('Volume');
	// now we can configure controllers which..
	// .. switch between slicing and volume rendering
	var vrController = volumegui.add(volume, 'volumeRendering');
	
	// .. configure the volume rendering opacity
	var opacityController = volumegui.add(volume, 'opacity', 0, 1);
	
	// .. and the threshold in the min..max range
	var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
						     volume.min, volume.max);
	var upperThresholdController = volumegui.add(volume, 'upperThreshold',
						     volume.min, volume.max);
	var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min,
						  volume.max);
	var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min,
						  volume.max);
	// the indexX,Y,Z are the currently displayed slice indices in the range
	// 0..dimensions-1
	var sliceXController = volumegui.add(volume, 'indexX', 0, volume.range[0] - 1);
	var sliceYController = volumegui.add(volume, 'indexY', 0, volume.range[1] - 1);
	var sliceZController = volumegui.add(volume, 'indexZ', 0, volume.range[2] - 1);
	volumegui.open();

    };
	
	///////////////////////////////////////////////

    //
    // start reading
    //
    _types.forEach(function(v) {
	
	if (_data[v]['file'].length > 0) {
	    
	    _data[v]['file'].forEach(function(u) {
		
		var reader = new FileReader();
		
		reader.onerror = errorHandler;
		reader.onload = (loadHandler)(v,u); // bind the current type
		
		// start reading this file
		reader.readAsArrayBuffer(u);
	    });
	}
    });





}



function createData() {

  // the data holder for the scene
  // includes the file object, file data and valid extensions for each object


  // we support here max. 1 of the following
  //
  // volume (.nrrd,.mgz,.mgh)
  // labelmap (.nrrd,.mgz,.mgh)
  // colortable (.txt,.lut)
  // mesh (.stl,.vtk,.fsm,.smoothwm,.inflated,.sphere,.pial,.orig)
  // scalars (.crv)
  // fibers (.trk)


  _data = {
   'volume': {
     'file': [],
     'filedata': [],
     'extensions': ['NRRD']
   },
  };

}
