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
	    _webGLFriendly = true;
	    try {
		// try to create and initialize a 3D renderer
		this.threeD = new X.renderer3D();
		this.threeD.container = '3d';
		this.threeD.init();
	    } catch (Exception) {
		// no webgl on this machine
		_webGLFriendly = false;
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

	    
	},
	loadFile:function(file){

	    console.log('XtkViewer.loadItem()');

	    var f = file;
	    var _fileName = f.name;
	    var _fileExtension = _fileName.split('.').pop().toUpperCase();
	    
	    //add data to data_holder
	    this._data['volume']['file'].push(f);


	    
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

}

	
    });
    return XtkViewerView;
});
