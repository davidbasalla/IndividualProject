define(["views/CanvasViewer3D", "views/CanvasViewer2D","text!templates/ViewerWindow.html"], function(CanvasViewer3D, CanvasViewer2D, ViewerWindowTemplate) {
    var ViewerWindowView = Backbone.View.extend({
	el:'#viewerWindow',
	template: _.template(ViewerWindowTemplate),
	events: {
	    'click': 'update2'
	},
	initialize:function(options) {
	    console.log('init()');
	    
	    //set the current layer
	    this.layersModel = options.layersModel;
	    this.layersModel.on("change:currentLayer", this.setCurrentLayerItem, this);

	    Backbone.on('onRender', this.update, this);
	    
	    this.layerIndex = 0;
	    this.currentItem = "";
	},
	render:function() {
	    //load the template

	    this.$el.append(this.template);
	    
	    //create the 4 different views here

	    //need to pass which CanvasSource to look at
	    this.viewer1 = new CanvasViewer3D();
	    this.viewer1.el = '#panel3D';
	    this.viewer1.render();

	    this.viewer2 = new CanvasViewer2D();
	    this.viewer2.el = '#panelX';
	    this.viewer2.mode = 1;
	    this.viewer2.render();

	    this.viewer3 = new CanvasViewer2D();
	    this.viewer3.el = '#panelY';
	    this.viewer3.mode = 2;
	    this.viewer3.render();

	    this.viewer4 = new CanvasViewer2D();
	    this.viewer4.el = '#panelZ';
	    this.viewer4.mode = 3;
	    this.viewer4.render();

	    //NEED TO HIDE THE PLACEHOLDER DIV HERE
	},
	setCurrentLayerItem:function(model, value, options){
	    console.log('viewerWindowView.setCurrentLayerItem()');


	    //turn off triggers for previous object
	    if(this.currentItem)
		this.currentItem.off("change:loaded", this.update, this);
	    
	    this.currentItem = model.get('currentItem');
	    this.currentItem.on("change:loaded", this.update, this);


	    //need to set the canvas to copy from
	    this.viewer2.setSrcCanvas(this.currentItem.get('index'));
	    this.viewer3.setSrcCanvas(this.currentItem.get('index'));
	    this.viewer4.setSrcCanvas(this.currentItem.get('index'));
	    
	    
	},
	update:function(){
	    console.log('ViewerWindowView.update()');
	    //console.log(this.currentItem);
	    this.viewer2.draw();
	    this.viewer3.draw();
	    this.viewer4.draw();

	    
	    //call draw functions of all canvases



	},
    });
    return ViewerWindowView;
});
