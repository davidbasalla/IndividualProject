function myFunction()
{

    console.log('Loading the viewer')

    //create _data dataholder
    createData();


    //get file from viewer
    var filePicker = document.getElementById("filePicker");
    console.log(filePicker.files[0]);

    var f = filePicker.files[0];

    var _fileName = f.name;
    var _fileExtension = _fileName.split('.').pop().toUpperCase();


    //add data to data_holder
    _data['volume']['file'].push(f);





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

		sliceX.add(volume);
		sliceX.render();
		
	    }
	    
	};
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




    ///////////////////////////////////////////////

    //load file into volume
    
    // create the 2D renderer for X
    sliceX = new X.renderer2D();
    sliceX.container = 'sliceX';
    sliceX.orientation = 'X';
    sliceX.init();
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