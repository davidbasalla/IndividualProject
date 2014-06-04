//need to pass a variable here

define(["text!templates/CanvasPanel.html"], function(CanvasPanelTemplate) {
    var ViewerWindowView = Backbone.View.extend({
	template: _.template(CanvasPanelTemplate),
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?

	    //_.bindAll(this, 'setThreshold'); // every function that uses 'this' as the current object should be in here
	    
	    this.master = false; //false by default
	    this.title = "";
	    this.mode = "";
	    this.container = "";
	    this.visible = true;
	    this.layerIndex = 0;

	    //levels data
	    this.originalThresholdLow = 0;
	    this.originalThresholdHigh = 100;
	    this.originalWindowLow = 0;
	    this.originalWindowHigh = 100;
	    

	    //event listener for file loaded
	    Backbone.on('fileLoaded', this.loadFile, this);
	    Backbone.on('labelLoaded', this.loadLabelFile, this);
	    
	    //Backbone.on('fileRemoved', this.clearFile, this);
	    Backbone.on('onShowtime', this.drawXTK, this);
	    
	    Backbone.on('layerThresholdChange', this.setThreshold, this);
	    Backbone.on('layerLevelsChange', this.setLevels, this);

	    
	},
	render:function() {

	    var toggle = "";
	    
	    switch (this.mode) {
	    case "3D":
		this.container = "viewer3D_" + this.layerIndex;
		toggle = "#3Dtoggle";
		break;
	    case "X":
		this.container = "viewerX_" + this.layerIndex;
		toggle = "#Xtoggle";
		break;
	    case "Y":
		this.container = "viewerY_" + this.layerIndex;
		toggle = "#Ytoggle";
		break;
	    case "Z":
		this.container = "viewerZ_" + this.layerIndex;
		toggle = "#Ztoggle";
		break;
	    }

	    this.$el.html(this.template({title: this.title, container: this.container}));

	    //init slider

	    $( "#sliderVertical", this.el ).slider({
		orientation: "vertical",
		//range: "min",
		min: 0,
		max: 100,
		value: 60,
		slide: function( event, ui ) {
		    $( "#amount" ).val( ui.value );
		}
	    });
	    
	    $(toggle, this.el).addClass('layer-selected');

	    //this.initViewer();
	    
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
	    else if (this.mode == "Z")
		this.viewer.orientation = 'Z';

	    this.viewer.init();

	    if(this.master){
		_this = this;
		this.viewer.onShowtime = function() {

		    //store original values

		    /*//debug
		    console.log('Orig Thresh = ' + _this.volume.lowerThreshold + ', ' +  _this.volume.upperThreshold);
		    console.log('Orig Levels = ' + _this.volume.windowLow + ', ' +  _this.volume.windowHigh);
		    */
		    
		    _this.originalThresholdLow = _this.volume.lowerThreshold;
		    _this.originalThresholdHigh = _this.volume.upperThreshold;

		    _this.originalWindowLow = _this.volume.windowLow;
		    _this.originalWindowHigh = _this.volume.windowHigh;
		    
		    Backbone.trigger('onShowtime',  [_this.volume, _this.layerIndex]);
		}
	    };
	    
	},
	/*
	toggleVisibility:function(vis){
	    console.log('toggleVis( ' + vis + ')');

	    console.log(this.el);
	    console.log(this.$el);
	    console.log($('#' + this.container));
	    
	    if(vis)
		$('#' + this.container).show();
	    else
		$('#' + this.container).hide();

	},
	*/
	loadFile:function(args){

	    console.log('loadFile()');

	    var file = args[0];
	    var layerIndex = args[1];

	    //create place holder for render data
	    this.createData();
	    
	    if(this.master && this.layerIndex == layerIndex){
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
	    }
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
		    _this.parse(_this._data);

		    //Backbone.trigger('onShowtime', _this.volume);
		}
	    };
	},
	parse:function(data){

	    console.log('parse()');
	    
	    // we have a volume
	    this.volume = new X.volume();
	    //console.log('aboutToLoad volume.file');

	    this.volume.file = data['volume']['file'].map(function(v) {
		return v.name;
	    });

	    this.volume.filedata = data['volume']['filedata'];

	    console.log(this.viewer);
	    console.log(this.viewer.objects);
	    console.log(this.viewer.topLevelObjects);

	    

	    this.viewer.objects.clear();
	    this.viewer.topLevelObjects = [];
	    
	    /*
	    if(this.viewer._objects){
		this.viewer._objects.clear();
		delete this._viewer.objects;
	    };

	    if (this.viewer._topLevelObjects){
		this.viewer._topLevelObjects.length = 0;
		delete this.viewer._topLevelObjects;
	    };
	    */

	    console.log('add()');
	    this.viewer.add(this.volume);

	    console.log('render()');

	    this.viewer.render();
	    //console.log(this.viewer.objects);
	},
	drawXTK:function(args){

	    volume = args[0];
	    layerIndex = args[1];
	    
	    console.log('VOLUME:');
	    console.log(this.volume);

	    if(!this.master && this.layerIndex == layerIndex){

		this.viewer.objects.clear();
		this.viewer.topLevelObjects = [];
		
		this.viewer.add(volume);
		this.viewer.render();
	    }
	    

	},
	setThreshold:function(args){

	    //should test if divider ever goes negative!
	    
	    if(this.layerIndex == args[0] && this.master){

		/*//for debug//
		console.log('RECEIVING');
		console.log(this.layerIndex + ', ' + this.mode);
		console.log(this.volume);*/
		
		var divider = (this.originalThresholdHigh - this.originalThresholdLow)/100;
		this.volume.lowerThreshold = divider*args[1];
		this.volume.upperThreshold = this.originalThresholdHigh * (args[2]/100);
	    }
	},
	setLevels:function(args){

	    if(this.layerIndex == args[0] && this.master){

		/*//for debug//
		console.log('RECEIVING');
		console.log(this.layerIndex + ', ' + this.mode);
		console.log(this.volume);*/
		
		var divider = (this.originalWindowHigh - this.originalWindowLow)/100;
		this.volume.windowLow = divider*args[1];
		this.volume.windowHigh = this.originalWindowHigh * (args[2]/100);
	    }
		},
	
    });
    return ViewerWindowView;
});
