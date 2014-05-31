define(["text!templates/XtkViewer.html"], function(XtkViewerTemplate) {
    var XtkViewerView = Backbone.View.extend({
	template: _.template(XtkViewerTemplate),
	events: {
	},
	initialize:function() {

	    //event listener for file loaded
	    Backbone.on('fileLoaded', this.loadFile, this);

	    //create place holder for render data
	    this.createData();
	},
	render:function() {
	    this.$el.html(this.template);

	    ///////////////////////////////////////////////
	    //init the viewers - have to wait for template to draw content
	    ///////////////////////////////////////////////

	    // create the 3D renderer
	    this._webGLFriendly = true;
	    try {
		// try to create and initialize a 3D renderer
		this.threeD = new X.renderer3D();
		this.threeD.container = '3d';
		this.threeD.init();
	    } catch (Exception) {
		// no webgl on this machine
		this._webGLFriendly = false;
	    }

	    // create the 2D renderers
	    this.sliceX = new X.renderer2D();
	    this.sliceX.container = 'sliceX';
	    this.sliceX.orientation = 'X';
	    this.sliceX.init();
	    
	    this.sliceY = new X.renderer2D();
	    this.sliceY.container = 'sliceY';
	    this.sliceY.orientation = 'Y';
	    this.sliceY.init();

	    this.sliceZ = new X.renderer2D();
	    this.sliceZ.container = 'sliceZ';
	    this.sliceZ.orientation = 'Z';
	    this.sliceZ.init();

	    // the onShowtime method gets executed after all files were fully loaded and
	    // just before the first rendering attempt
	    // add the volume to the other 3 renderers
	    _this = this;
	    this.sliceX.onShowtime = function() {

		_this.sliceY.add(_this.volume);
		_this.sliceY.render();

		_this.sliceZ.add(_this.volume);
		_this.sliceZ.render();
		
		if (_this._webGLFriendly) {
		    _this.threeD.add(_this.volume);
		    _this.threeD.render();
		}
	    };
	},
	loadFile:function(file){

	    console.log('XtkViewer.loadItem()');

	    var f = file;
	    var _fileName = f.name;
	    var _fileExtension = _fileName.split('.').pop().toUpperCase();
	    
	    //add data to data_holder
	    this._data['volume']['file'].push(f);

	    //load files
	    _this = this;
	    
	    this._types.forEach(function(v) {

		if (_this._data[v]['file'].length > 0) {
		    
		    _this._data[v]['file'].forEach(function(u) {
			
			var reader = new FileReader();
			
			reader.onerror = _this.errorHandler;
			reader.onload = (_this.loadHandler)(v,u); // bind the current type
			
			// start reading this file
			reader.readAsArrayBuffer(u);
		    });
		}
	    });
	    
	    
	},
	createData:function() {
	    // the data holder for the scene
	    // includes the file object, file data and valid extensions for each object
	    
	    this._data = {
		'volume': {
		    'file': [],
		    'filedata': [],
		    'extensions': ['NRRD']
		},
	    };

	    //FROM SLICEDROP, MAKE SURE TO UNDERSTAND THIS
	    this._types = Object.keys(this._data);
	    // number of total files - legacy from SliceDrop code
	    this._numberOfFiles = 1;
	    this._numberRead = 0;
	},
	loadHandler:function(type,file){

	    _this = this;
	    
	    return function(e) {
		// reading complete

		var data = e.target.result;
		
		// might have multiple files associated
		// attach the filedata to the right one
		
		_this._data[type]['filedata'][_this._data[type]['file'].indexOf(file)] = data;
		//console.log(_this._data[type]['filedata'][_this._data[type]['file'].indexOf(file)]);
		
		_this._numberRead++;
		if (_this._numberRead == _this._numberOfFiles) {
		    
		    // all done, start the parsing
		    //parse(_data);   
		    
		    // we have a volume
		    _this.volume = new X.volume();
		    //console.log('aboutToLoad volume.file');

		    _this.volume.file = _this._data['volume']['file'].map(function(v) {
			return v.name;
		    });

		    _this.volume.filedata = _this._data['volume']['filedata'];
		    
		    _this.sliceX.add(_this.volume);
		    _this.sliceX.render();
		}
	    };
	},
    });
    return XtkViewerView;
});
