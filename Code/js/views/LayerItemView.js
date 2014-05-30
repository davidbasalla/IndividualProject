define(["text!templates/Layer.html" , "models/LayerItem", "views/XtkViewerView"], function(LayerTemplate, LayerItem, XtkViewer) {
    
    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(LayerTemplate),
	
	initialize: function(){
	    //_.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
	},
	events: {
	    //event for toggling visibility
	    'click button#loadFile': 'loadFile',
	    'click button#delete': 'deleteLayer',
	    'change input#checkBox': 'toggleVisibility',
	    'change input#filePicker': 'fileLoaded',
	    'change input#labelPicker': 'labelLoaded',
	    'click a#addLabelMap': 'addLabelMap',
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
	    Backbone.trigger('fileLoaded', e.currentTarget.files[0]);
	},
	labelLoaded: function(e){
	    //add text to layer preview
	    //$('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    //call draw function
	    loadLabelMap(e.currentTarget.files[0]);
	},
	toggleVisibility: function(e){
	    console.log('ToggleVisibility');
	    this.model.attributes.visible = e.target.checked;
	},	
	deleteLayer: function(){
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
