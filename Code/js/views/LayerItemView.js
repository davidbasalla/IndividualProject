define(["text!templates/Layer.html" , "models/LayerItem","views/ViewerWindowView"], function(LayerTemplate, LayerItem, ViewerWindowView) {
    
    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(LayerTemplate),
	
	initialize: function(){
	    //_.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
    	
	    var viewerWindow = new ViewerWindowView({
		el: $('#viewerWindow')
	    });
	    viewerWindow.layer = this.model.attributes.title;
	    
	    viewerWindow.render();
	    //console.log(viewerWindow);
	    //viewerWindow.initViewer();

	    Backbone.on('setSelected', this.setUnselected, this);
	    
	    //Backbone.trigger('newLayer', this.model.attributes.title);
	},
	events: {
	    //event for toggling visibility
	    'click button#loadFile': 'loadFile',
	    'click button#delete': 'deleteLayer',
	    'change input#checkBox': 'toggleVisibility',
	    'change input#filePicker': 'fileLoaded',
	    'change input#labelPicker': 'labelLoaded',
	    'click a#addLabelMap': 'addLabelMap',
	    'click': 'setSelected',
	},
	render: function(){

	    //add style to rendering of the layer item
	    $(this.el).addClass('list-group-item');

	    
	    //template - set title
	    this.$el.html(this.template({layer_title: this.model.attributes.title}));

	    //hide the file pickers
	    $('#filePicker', this.el).hide();
	    $('#labelPicker', this.el).hide();

	    return this; // for chainable calls, like .render().el
	},
	setSelected: function(){
	    $(this.el).removeClass('layer-unselected');
	    $(this.el).addClass('layer-selected');
	    
	    Backbone.trigger('setSelected', this.model.attributes.title);
	},
	setUnselected: function(layer){

	    if (this.model.attributes.title!=layer){
		$(this.el).removeClass('layer-selected');
		$(this.el).addClass('layer-unselected');
	    }
	},
	loadFile: function(){
	    //trigger the hidden fileLoader
	    $('#filePicker',this.el).trigger('click');
	},
	loadLabelMap: function(){
	    //trigger the hidden fileLoader
	    $('#labelPicker',this.el).trigger('click');
	},
	fileLoaded: function(e){
	    //add text to layer preview
	    $('#textHolder', this.el).html(e.currentTarget.files[0].name);

	    //trigger event that file has loaded, expected by XtkViewer
	    //send file along as a parameter
	    Backbone.trigger('fileLoaded', [e.currentTarget.files[0], this.model.attributes.title]);
	},
	labelLoaded: function(e){
	    //add text to layer preview
	    console.log('labelLoaded()');
	    //$('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    //call draw function
	    //loadLabelMap(e.currentTarget.files[0]);
	    Backbone.trigger('labelLoaded', [e.currentTarget.files[0], this.model.attributes.title]);
	},
	toggleVisibility: function(e){
	    this.model.attributes.visible = e.target.checked;
	    Backbone.trigger('toggleVisibility', [this.model.attributes.visible, this.model.attributes.title]);
	},	
	deleteLayer: function(){
	    Backbone.trigger('layerRemoved', this.model.attributes.title);
	    $(this.el).remove();
	},
	addLabelMap: function(){
	    console.log('addLabelMap');
	    //console.log($(this.el));
	    //console.log($(this.el.parentElement));
	    //$('#layerList', this.el.parentElement).append('<li>TEST</li>')
	    //$(this.el.parentElement).append('<li>TEST</li>')
	    this.loadLabelMap();
	},
    });

    return LayerItemView;
});
