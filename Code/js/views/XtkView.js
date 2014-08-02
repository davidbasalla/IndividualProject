//need to pass a variable here

define(["text!templates/XTK.html"], function(XTKTemplate) {
    var XtkView = Backbone.View.extend({
	el: '#xtkPanels',
	template: _.template(XTKTemplate),
	initialize:function(options) {
	    console.log('initXTK()');


	    //INIT VARS
	    this.layerIndex = options.layerIndex;
	    this.layout = options.layout;//current layout
	    this.model = options.model;
	    this.webGLFriendly = true;
	    this.panVector = new X.vector(0,0,0);  //x, y, d

	    this.viewerX_OrigX = 0;
	    this.viewerX_OrigY = 0;
	    this.viewerX_OrigZ = 0;

	    this.viewerY_OrigX = 0;
	    this.viewerY_OrigY = 0;
	    this.viewerY_OrigZ = 0;

	    this.viewerZ_OrigX = 0;
	    this.viewerZ_OrigY = 0;
	    this.viewerZ_OrigZ = 0;


	    //settings for xtkContainers
	    var viewer0_dict = {
		"jQString":".xtkPanel0",
		"currentPos": 0,
		"dimensions":[0, 0],
		};

	    var viewer1_dict = {
		"jQString":".xtkPanel1",
		"currentPos": 1,
		"dimensions":[0, 0],
		};

	    var viewer2_dict = {
		"jQString":".xtkPanel2",
		"currentPos": 2,
		"dimensions":[0, 0],
		};

	    var viewer3_dict = {
		"jQString":".xtkPanel3",
		"currentPos": 3,
		"dimensions":[0, 0],
		};

	    this.viewerDictArray = [viewer0_dict, viewer1_dict, viewer2_dict, viewer3_dict];



	    //MODEL RELATED EVENTS
	    this.model.on("change:fileName", this.loadFile, this);
	    this.model.on("change:indexX", this.changeIndexX, this);
	    this.model.on("change:indexY", this.changeIndexY, this);
	    this.model.on("change:indexZ", this.changeIndexZ, this);
	    this.model.on("change:windowLow", this.setWindowLow, this);
	    this.model.on("change:windowHigh", this.setWindowHigh, this);
	    this.model.on("change:thresholdLow", this.setThresholdLow, this);
	    this.model.on("change:thresholdHigh", this.setThresholdHigh, this);
	    this.model.on("change:colortable", this.setColortable, this);


	    //GLOBAL EVENTS
	    Backbone.on('pan', this.setPan, this);
	    Backbone.on('zoom', this.setZoom, this);
	    Backbone.on('focus', this.setFocus, this);
	    Backbone.on('traverse', this.traverse, this);
	    Backbone.on('rotate', this.rotate, this);
	    Backbone.on('zoom3D', this.setZoom3D, this);
	    Backbone.on('pan3D', this.setPan3D, this);
	    //Backbone.on('setLayout', this.setLayout, this);

	    this.render();

	},
	render:function() {
	    console.log('XtkView.render()');
	    console.log(this.el);

	    //this.$el.append(this.template({
	    $('#xtkPanels').append(this.template({
		layerIndex: 'xtkViewer_L' + this.layerIndex,
		containerIndex3D: 'xtkContainer3D_L' + this.layerIndex,
		containerIndexX: 'xtkContainerX_L' + this.layerIndex,
		containerIndexY: 'xtkContainerY_L' + this.layerIndex,
		containerIndexZ: 'xtkContainerZ_L' + this.layerIndex,
	    }));

	    //reset this to correct elements (for proper destruction)
	    this.el = document.getElementById('xtkViewer_L' + this.layerIndex);
	    this.$el = $('#xtkViewer_L' + this.layerIndex);

	    this.initViewers();
	    this.setDimensions();	    
	},
	destroy:function(){
	    console.log('XtkView.destroy()');

	    if(this.webGLFriendly)
		this.viewer3D.destroy();

	    this.viewerX.destroy();
	    this.viewerY.destroy();		
	    this.viewerZ.destroy();

	    this.remove(); 
	    this.unbind();
	},
	setDimensions:function(){
	    console.log('XtkView.setSize(' + this.layout + ')');

	    var height = $('#canvasPanels').height() - 20;
	    var width = $('#canvasPanels').width() - 20;

    
	    if(this.layout == 1){
		console.log('Layout 1');

		for(var i = 0; i < 4; i++){
		    this.viewerDictArray[i].dimensions = [width/2, height/2];
		}
	    }
	    else if(this.layout == 2){
		console.log('Layout 2');

		this.viewerDictArray[0].dimensions = [width*(2/3), height];
		this.viewerDictArray[1].dimensions = [width*(1/3), height/3 - 6];
		this.viewerDictArray[2].dimensions = [width*(1/3), height/3 - 6];
		this.viewerDictArray[3].dimensions = [width*(1/3), height/3 - 6];

	    }
	    else if(this.layout == 3){
		console.log('Layout 3');

		this.viewerDictArray[0].dimensions = [width, height*(2/3)];
		this.viewerDictArray[1].dimensions = [width/3 - 6, height*(1/3)];
		this.viewerDictArray[2].dimensions = [width/3 - 6, height*(1/3)];
		this.viewerDictArray[3].dimensions = [width/3 - 6, height*(1/3)];

	    }
	    else if(this.layout == 4){
		console.log('Layout 4');

		this.viewerDictArray[0].dimensions = [width, height];
	    }

	    this.applyDimensions();

	    //resize the topLayer
	    var height2 = $('#canvasPanels').height();
	    var width2 = $('#canvasPanels').width();
	    
	    $('#xtkViewer_L' + this.layerIndex).css({ "height": height2});
	    $('#xtkViewer_L' + this.layerIndex).css({ "width": width2});

	},
	applyDimensions:function(){
	    console.log('XtkView.applyDimensions()');

	    for(var i = 0; i < 4; i++){

		//find the correct viewer
		var j = this.viewerDictArray[i].currentPos;

		/*
		console.log('setting ' + this.viewerDictArray[j].jQString + ' to ' 
			    +  this.viewerDictArray[i].dimensions[0] + ',' + 
			    this.viewerDictArray[i].dimensions[1]);*/

		$(this.viewerDictArray[j].jQString).css({
		    "height": this.viewerDictArray[i].dimensions[1],
		    "width": this.viewerDictArray[i].dimensions[0]
		});
	    }
	    
	    //update the xtkViewers

	    if(this.webGLFriendly)
		this.viewer3D.onResize();

	    this.viewerX.onResize();
	    this.viewerY.onResize();		
	    this.viewerZ.onResize();
	},
	swapDimensions:function(dst, src){
	    /* swap the sizes of 2 xtkViewers */

	    console.log('XtkView.swapSize(' + src + ' with ' + dst + ')');
	    
	    if(dst < 0 || dst > 3 || src < 0 || src > 3)
		console.log('illegal canvas index');

	    if(dst == src)
		console.log('indeces are the same');

	    //was swapping dimensions here, not necessary
	    
	    tmp = this.viewerDictArray[dst].currentPos;
	    this.viewerDictArray[dst].currentPos = this.viewerDictArray[src].currentPos;
	    this.viewerDictArray[src].currentPos = tmp;


	    //apply the changes
	    this.applyDimensions();
	},
	initViewers:function(){
	    //create all 4 viewers

	    //set width and height according to original canvas, need to update the size!!
	    var height = $("#canvasViewer0").height();
	    var width = $("#canvasViewer0").width();
	    
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.width = width;
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.height = height;
	    

	    // 3D
	    try {
		// try to create and initialize a 3D renderer
		this.viewer3D = new X.renderer3D();
		this.viewer3D.container = 'xtkContainer3D_L' + this.layerIndex;
		this.viewer3D.init();

	    } catch (Exception) {
		
		// no webgl on this machine
		this.webGLFriendly = false;
		
	    }

	    // X
	    this.viewerX = new X.renderer2D();
	    this.viewerX.container = 'xtkContainerX_L' + this.layerIndex;
	    this.viewerX.orientation = 'X';	    
	    this.viewerX.init();

	    //Y
	    this.viewerY = new X.renderer2D();
	    this.viewerY.container = 'xtkContainerY_L' + this.layerIndex;
	    this.viewerY.orientation = 'Y';
	    this.viewerY.init();

	    //Z
	    this.viewerZ = new X.renderer2D();
	    this.viewerZ.container = 'xtkContainerZ_L' + this.layerIndex;
	    this.viewerZ.orientation = 'Z';
	    this.viewerZ.init();

	    
	    //add id's to the canvases, need to go 2 levels deep now, due to nesting
	    //SUPER DODGY CURRENTLY! - CLEANUP!
	    
	    var containers = document.getElementById('xtkViewer_L' + this.layerIndex);
	    for(i = j = 0; i < containers.childNodes.length; i++){
		if(containers.childNodes[i].nodeName == 'DIV'){
		    var children = containers.childNodes[i].childNodes;
		    if(children[1].nodeName == 'CANVAS'){
			children[1].setAttribute("id", "xtkCanvas_L" + this.layerIndex + "_" + j);
			j++;
		    }
		}
	    }
	    
	    Backbone.trigger('xtkInitialised', this.model);
	    //set x to be the master viewer
	},
	loadFile:function(model, value, options){
	    //do file stuff, load it into the master viewer
	    console.log('XtkView:loadFile()');

	    var file = model.get('file');

	    //create place holder for render data
	    this.createData();
	    
	    var f = file;
	    var _fileName = value;
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
	    console.log('XtkView:loadHandler()');

	    _this = this;
	    
	    return function(e) {
		// reading complete

		var data = e.target.result;
		
		// might have multiple files associated
		// attach the filedata to the right one
		
		_this._data[type]['filedata'][_this._data[type]['file'].indexOf(file)] = data;
		
		_this._numberRead++;
		if (_this._numberRead == _this._numberOfFiles) {
		    
		    // all done, start the parsing
		    //parse(_data);   
		    
		    // we have a volume
		    _this.parse(_this._data);

		}
	    };
	},
	clearXtkObjects:function(){
	    
	    this.viewerX.objects.clear();
	    this.viewerX.topLevelObjects = [];

	    this.viewerY.objects.clear();
	    this.viewerY.topLevelObjects = [];

	    this.viewerZ.objects.clear();
	    this.viewerZ.topLevelObjects = [];


	    if (this.webGLFriendly) {

		if(this.viewer3D.objects){
		    this.viewer3D.objects.clear();
		}
		if(this.viewer3D.topLevelObjects){
		    this.viewer3D.topLevelObjects = [];
		}
	    }
	    return true;

	},
	parse:function(data){
	    console.log('XtkView:parse()');

	    // CLEAR ANY OLD OBJECTS OUT //////////////////////////
	    if(!this.clearXtkObjects())
		return;



	    // we have a volume
	    this.volume = new X.volume();


	    this.volume.file = data['volume']['file'].map(function(v) {
		return v.name;
	    });
	    this.volume.filedata = data['volume']['filedata'];
	    //this.volume.colortable.file = 'http://x.babymri.org/?genericanatomy.txt';


	    //this.volume.file = 'http://x.babymri.org/?seg.nrrd';


	    // .. and use a color table to map the label map values to colors


	    //this.volume.labelmap.colortable.file = 'http://x.babymri.org/?genericanatomy.txt';

	    //this.volume.labelmap.colortable.file = 'https://www.slicer.org/slicerWiki/images/c/ca/PETCT_Labels.txt';
	    //this.volume.labelmap.colortable.file = 'file://homes/db913/individualproject/Resources/Data/colorExample.txt';

	    try {
	
		this.viewerX.add(this.volume);
		
		this.viewerX.render();
		console.log('SUCCESS');

	    } catch (Exception) {
		
		console.log('BALLS');
	    }

	



	    var _this = this;

	    //this appears to get triggered after reloading the colorMap
	    this.viewerX.onShowtime = function() {
		// add the volume to the other 3 renderers

		console.log('XtkView.parse() - onShowtime!');

		//store initial values into the layerModel


		//ISSUE with this, it resets the MODEL so causes Xtk volume to reset the index
		_this.storeValues();
		
		if(_this.viewerY.objects._array.length == 0){
		    _this.viewerY.add(_this.volume);
		    _this.viewerY.render();
		}
	    
		if(_this.viewerZ.objects._array.length == 0){
		    _this.viewerZ.add(_this.volume);
		    _this.viewerZ.render();
		}
		
		/*
		if (_this.webGLFriendly) {
		    if(_this.viewer3D.objects._array.length == 0){
			_this.viewer3D.add(_this.volume);
			_this.viewer3D.render();
		    }
		    
		}
		*/

		//update the model
		_this.model.set({
		    // modify item defaults
		    loaded: true
		});

		_this.storeOriginalViews();

		Backbone.trigger('onShowtime');
	    };

	},
	storeOriginalViews:function(){
	    
	    this.viewerX_OrigX = this.viewerX.camera.view[12];
	    this.viewerX_OrigY = this.viewerX.camera.view[13];
	    this.viewerX_OrigZ = this.viewerX.camera.view[14];
	    //console.log(this.viewerX.camera.view);

	    this.viewerY_OrigX = this.viewerY.camera.view[12];
	    this.viewerY_OrigY = this.viewerY.camera.view[13];
	    this.viewerY_OrigZ = this.viewerY.camera.view[14];
	    //console.log(this.viewerY.camera.view);

	    this.viewerZ_OrigX = this.viewerZ.camera.view[12];
	    this.viewerZ_OrigY = this.viewerZ.camera.view[13];
	    this.viewerZ_OrigZ = this.viewerZ.camera.view[14];
	    //console.log(this.viewerZ.camera.view);
	},
	storeValues:function(){
	    //console.log('XtkView.storeValues()');

	    //setting indexes
	    this.model.set({
		indexX: this.volume.indexX,
		indexY: this.volume.indexY,
		indexZ: this.volume.indexZ,
	    });
	    
	    //setting levels/window values
	    this.model.set({
		//ORIG
		windowLowOrig: this.volume.windowLow,
		windowHighOrig: this.volume.windowHigh,
		thresholdLowOrig: this.volume.lowerThreshold,
		thresholdHighOrig: this.volume.upperThreshold,
		//CURRENT
		windowLow: this.volume.windowLow,
		windowHigh: this.volume.windowHigh,
		thresholdLow: this.volume.lowerThreshold,
		thresholdHigh: this.volume.upperThreshold,
	    }); 
	    
	    Backbone.trigger('initValuesStored', this.model);
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
	changeIndexX:function(model, value, options){
	    console.log(this.viewerX.objects);

	    if(this.volume){
		//check if this.volume.index and value are the same
		if(this.volume.indexX != value){
		    this.volume.indexX = value;
		    //in case out of bounds, reset model
		    if(this.volume.indexX != value)
			model.set({indexX: this.volume.indexX})
		}
	    }
	},
	changeIndexY:function(model, value, options){

	    //this.viewerY.update(this.volume);
	    console.log(this.viewerY.objects);

	    if(this.volume){
		if(this.volume.indexY != value){
		    this.volume.indexY = value;
		    //in case out of bounds, reset model
		    if(this.volume.indexY != value)
			model.set({indexY: this.volume.indexY})
		}
	    }
	},
	changeIndexZ:function(model, value, options){

	    console.log(this.viewerZ.objects);

	    if(this.volume){
		if(this.volume.indexZ != value){
		    this.volume.indexZ = value;
		    //in case out of bounds, reset model
		    if(this.volume.indexZ != value)
			model.set({indexZ: this.volume.indexZ})
		}
	    }
	},
	setWindowLow:function(model, value, options){
	    this.volume.windowLow = value;
	},
	setWindowHigh:function(model, value, options){
	    this.volume.windowHigh = value;
	},
	setThresholdLow:function(model, value, options){
	    this.volume.lowerThreshold = value;
	},
	setThresholdHigh:function(model, value, options){
	    this.volume.upperThreshold = value;
	},
	setColortable:function(model, value, options){
	    /* can store locations for various color tables here!! 
	       depending on index, the path changes
	       force a reload of the color table

	       ALSO need to force a clear of the cache that disables the 
	       reslicing
	    */

	    console.log('XtkView.setColortable()');

	    var colTableFile = null;

	    if(value == 'Lookup_IDs')
		colTableFile = 'http://x.babymri.org/?genericanatomy.txt';	   

	    //if... else...
	   
	    var viewerArray = [this.viewerX, this.viewerY, this.viewerZ];

	    this.volume.setColortable(colTableFile, viewerArray);

	    /*
	    this.volume.colortable.file = colTableFile;

	    //this.volume.clearChildren(0);
	    //this.volume.clearChildren(1);
	    //this.volume.clearChildren(2);

	    //causes IMAGE to go black - issue here that only viewerX gets updated!?
	    this.viewerX.loader.load(this.volume.colortable, this.volume);
	    */



	    //this.volume.clearChildren(0);
	    //this.volume.clearChildren(1);
	    //xthis.volume.clearChildren(2);
	    /*
	    this.volume.sliceInfoChanged(0);
	    this.volume.sliceInfoChanged(1);
	    this.volume.sliceInfoChanged(2);
	    */

	    /*//once this has loaded, the volumes needs to be changed and the 
	    //modified event triggered!

	    */
	    //this.volume.sliceInfoChanged(0);
	    //this.viewerX.resetViewAndRender();

	},
	setPan:function(args){
	    //console.log('setPan()');

	    if(this.layerIndex == args[2].get('index')){

		if(args[3] == 1){
		    ////console.log('XtkVew.setPanX()');
		    this.viewerX.camera.view[12] += -(args[0])/4;
		    this.viewerX.camera.view[13] += args[1]/4;
		}
		else if(args[3] == 2){
		    ////console.log('XtkVew.setPanY()');
		    this.viewerY.camera.view[12] += -(args[0])/4;
		    this.viewerY.camera.view[13] += args[1]/4;
		}
		else if(args[3] == 3){
		    ////console.log('XtkVew.setPanZ()');
		    this.viewerZ.camera.view[12] += -(args[0])/4;
		    this.viewerZ.camera.view[13] += args[1]/4;
		}
		
	    ////console.log(this.viewerX.camera.view);
	    //this.viewerX.camera.view = a;
	    }
	},
	setZoom:function(args){

	    ////console.log(this.layerIndex);
	    ////console.log(args[2].get('index'));


	    if(this.layerIndex == args[1].get('index')){

		if(args[2] == 1){
		    this.viewerX.camera.view[14] += args[0]/500;
		}
		else if(args[2] == 2){
		    this.viewerY.camera.view[14] += args[0]/500;
		}
		else if(args[2] == 3){
		    this.viewerZ.camera.view[14] += args[0]/500;
		}
	    }
	},
	setFocus:function(args){

	    if(this.layerIndex == args[0].get('index')){

		if(args[1] == 1){
		    this.viewerX.camera.view[12] = this.viewerX_OrigX;
		    this.viewerX.camera.view[13] = this.viewerX_OrigY;
		    this.viewerX.camera.view[14] = this.viewerX_OrigZ;
		}
		else if(args[1] == 2){
		    this.viewerY.camera.view[12] = this.viewerY_OrigX;
		    this.viewerY.camera.view[13] = this.viewerY_OrigY;
		    this.viewerY.camera.view[14] = this.viewerY_OrigZ;
			}
		else if(args[1] == 3){
		    this.viewerZ.camera.view[12] = this.viewerZ_OrigX;
		    this.viewerZ.camera.view[13] = this.viewerZ_OrigY;
		    this.viewerZ.camera.view[14] = this.viewerZ_OrigZ;
		}
	    }
	},
	traverse:function(args){

	    ////console.log('XtkView.traverse()');

	    if(this.layerIndex == args[2].get('index')){

		if(args[3] == 1)
		    var ijk = this.viewerX.xy2ijk(args[0], args[1]);
		else if(args[3] == 2)
		    var ijk = this.viewerY.xy2ijk(args[0], args[1]);
		else if(args[3] == 3)
		    var ijk = this.viewerZ.xy2ijk(args[0], args[1]);

		if(ijk){
		    this.model.set({
			indexX:ijk[0][0],
			indexY:ijk[0][1],
			indexZ:ijk[0][2]});
		};
	    }
	},
	rotate:function(args){
	    //console.log('setPan()');

	    if(this.layerIndex == args[2].get('index')){
		//console.log(args[0]);
		//console.log(args[1]);

		if(args[3] == 0){
		    this.viewer3D.camera.rotate([args[0], args[1]]);
		}
	    }
	},
	setPan3D:function(args){
	    //console.log('setPan()');
	    
	    if(this.layerIndex == args[2].get('index')){
		
		if(args[3] == 0){
		    this.viewer3D.camera.pan([args[0], args[1]]);
		}
	    }
	},
	setZoom3D:function(args){
	    //console.log('setZoom3D()');
	    
	    if(this.layerIndex == args[2].get('index')){
		
		if(args[3] == 0){
		    if(args[1] < 0)
			this.viewer3D.camera.zoomOut(args[0]);
		    else
			this.viewer3D.camera.zoomIn(args[0]);
		}
	    }
		
	},
	setVolumeRender:function(val){

//console.log('XtkView.rotate()');	    

	    this.volume.volumeRendering = val;

	},
    });
    return XtkView;
});
