//need to pass a variable here

define(["text!templates/XTK.html"], function(XTKTemplate) {
    var XtkView = Backbone.View.extend({
	el: '#xtkPanels',
	template: _.template(XTKTemplate),
	events: {
	},
	initialize:function(options) {
	    console.log('initXTK()');
	    this.layerIndex = options.layerIndex;
	    this.model = options.model;

	    this.model.on("change:fileName", this.loadFile, this);

	    this.webGLFriendly = true;
	    
	    this.render();
	},
	render:function() {
	    console.log('render()');

	    this.$el.append(this.template({layerIndex: 'xtkViewer_L' + this.layerIndex}));
	    this.initViewers();
	},
	initViewers:function(){
	    //create all 4 viewers

	    //set width and height according to original canvas, need to update the size!!
	    var height = $("#canvasViewer3D").height();
	    var width = $("#canvasViewer3D").width();
	    
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.width = width;
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.height = height;
	    
	    this.viewer3D = new X.renderer3D();
	    this.viewerX = new X.renderer2D();
	    this.viewerY = new X.renderer2D();
	    this.viewerZ = new X.renderer2D();
	    
	    this.viewer3D.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerX.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerY.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerZ.container = 'xtkViewer_L' + this.layerIndex;
	    
	    this.viewerX.orientation = 'X';
	    this.viewerY.orientation = 'Y';
	    this.viewerZ.orientation = 'Z';

	    this.viewer3D.init();
	    this.viewerX.init();
	    this.viewerY.init();
	    this.viewerZ.init();

	    //add id's to the canvases
	    var canvases = document.getElementById('xtkViewer_L' + this.layerIndex);
	    for(i = j = 0; i < canvases.childNodes.length; i++)
		if(canvases.childNodes[i].nodeName == 'CANVAS'){
		    canvases.childNodes[i].setAttribute("id", "xtkCanvas_" + j);
		    j++;
		}
	    
	    console.log('finished');
	    Backbone.trigger('xtkInitialised', this.model);
	    //set x to be the master viewer
	},
	loadFile:function(model, value, options){
	    //do file stuff, load it into the master viewer
	    console.log('XtkView:loadFile()');
	    console.log(model);
	    console.log(value);

	    var file = value;

	    //create place holder for render data
	    this.createData();
	    
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
		    _this.parse(_this._data);

		}
	    };
	},
	parse:function(data){
	    // we have a volume
	    this.volume = new X.volume();

	    this.volume.file = data['volume']['file'].map(function(v) {
		return v.name;
	    });

	    this.volume.filedata = data['volume']['filedata'];

	    this.viewerX.objects.clear();
	    this.viewerX.topLevelObjects = [];
	    
	    this.viewerX.add(this.volume);
	    this.viewerX.render();

	    var _this = this;
	    this.viewerX.onShowtime = function() {
		// add the volume to the other 3 renderers

		_this.viewerY.add(_this.volume);
		_this.viewerY.render();
		_this.viewerZ.add(_this.volume);
		_this.viewerZ.render();
		
		if (_this.webGLFriendly) {
		    _this.viewer3D.add(_this.volume);
		    _this.viewer3D.render();
		}

		//update the model
		_this.model.set({
		    // modify item defaults
		    loaded: true
		});
	    };



	    this.viewerX.onRender = function(){
		Backbone.trigger('onRender');
	    };


	    //set model layer to be loaded
	    

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
    });
    return XtkView;
});
