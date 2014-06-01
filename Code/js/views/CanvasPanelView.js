//need to pass a variable here

define(["text!templates/CanvasPanel.html"], function(CanvasPanelTemplate) {
    var ViewerWindowView = Backbone.View.extend({
	template: _.template(CanvasPanelTemplate),
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?
	    
	    //this.layer
	    //this.view

	    this.title = "";
	    this.mode = "";
	    this.container = "";

	    //event listener for file loaded
	    Backbone.on('fileLoaded', this.loadFile, this);
	    Backbone.on('fileRemoved', this.clearFile, this);

	    //create place holder for render data
	    this.createData();

	},
	render:function() {

	    switch (this.mode) {
	    case "3D":
		this.container = "viewer3D";
		break;
	    case "X":
		this.container = "viewerX";
		break;
	    case "Y":
		this.container = "viewerY";
		break;
	    case "Z":
		this.container = "viewerZ";
		break;
	    }
	    
	    this.$el.html(this.template({title: this.title, container: this.container}));

	    return this; //to enable chain calling
	},
	initViewer:function(){
	    
	    // create the viewer
	    if(this.mode == "3D")
		this.viewer = new X.renderer3D();
	    else
		this.viewer = new X.renderer2D();
	    
	    this.viewer.container = this.container;

	    if(this.mode == "X")
		this.viewer.orientation = 'X';
	    else if (this.mode == "Y")
		this.viewer.orientation = 'Y';
	    (this.mode == "Z")
	    this.viewer.orientation = 'Z';

	    this.viewer.init();
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
		    
		    _this.viewer.add(_this.volume);
		    _this.viewer.render();
		}
	    };
	},

	
    });
    return ViewerWindowView;
});
