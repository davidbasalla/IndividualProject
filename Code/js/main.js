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

		console.log("File: ");
		console.log(volume.file);
		
		console.log("FileDate: ");
		console.log(volume.filedata);
		console.log("Center: ");
		console.log(volume.center);
		volume.center = [50,200,100];
		console.log(volume.center);
		console.log(volume.dimensions);
		console.log(volume.lowerThreshold);
		console.log(volume.transform);
		volume.lowerThreshold = -10;

		console.log('Image:');
		console.log(volume.image);
		console.log(volume.indexX);
		
		sliceX.add(volume);
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
	sliceZ.add(volume);
	sliceZ.render();
	
	if (_webGLFriendly) {
	    threeD.add(volume);
	    threeD.render();
	}
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
