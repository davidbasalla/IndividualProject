define(["text!templates/Layer.html" , "models/LayerItem","views/ViewerWindowView"], function(LayerTemplate, LayerItem, ViewerWindowView) {
    
    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(LayerTemplate),
	
	initialize: function(options){

	    console.log('LayerItemView.init()');
	    this.model = options.model;
	    this.layersModel = options.layersModel;
	    this.layersView = options.layersView;
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
	    $(this.el).addClass('layer');

	    
	    //template - set title
	    this.$el.html(this.template({layer_title: this.model.attributes.title}));

	    //hide the file pickers
	    $('#filePicker', this.el).hide();
	    $('#labelPicker', this.el).hide();

	    return this; // for chainable calls, like .render().el
	},
	setSelected: function(){
	    console.log('LayerItemView.setSelected()');
	    
	    $(this.el).removeClass('layer');
	    $(this.el).addClass('layer-selected');
	},
	setUnselected: function(){
	    console.log('LayerItemView.setUnselected()');
	    
	    $(this.el).removeClass('layer-selected');
	    $(this.el).addClass('layer');
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
	    console.log('fileLoaded()')
	    //add text to layer preview
	    $('#textHolder', this.el).html(e.currentTarget.files[0].name);

	    this.model.set({
		fileName: e.currentTarget.files[0].name,
		file : e.currentTarget.files[0]
	    });

	    console.log(this.model);
	    
	    //trigger event that file has loaded, expected by XtkViewer
	    //send file along as a parameter
	    //Backbone.trigger('fileLoaded', [e.currentTarget.files[0], this.model.attributes.index]);
	},
	labelLoaded: function(e){
	    //add text to layer preview
	    //console.log('labelLoaded()');
	    //$('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    //call draw function
	    //loadLabelMap(e.currentTarget.files[0]);
	    Backbone.trigger('labelLoaded', [e.currentTarget.files[0], this.model.attributes.index]);
	},
	deleteLayer: function(){
	    this.layersView.removeItem(this.model);
	    $(this.el).remove();
	},
	addLabelMap: function(){
	    //console.log('addLabelMap');
	    //console.log($(this.el));
	    //console.log($(this.el.parentElement));
	    //$('#layerList', this.el.parentElement).append('<li>TEST</li>')
	    //$(this.el.parentElement).append('<li>TEST</li>')
	    this.loadLabelMap();
	},
    });

    return LayerItemView;
});
