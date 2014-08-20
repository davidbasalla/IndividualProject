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
	    'change input#filePicker': 'fileLoaded',
	    'click a#addLabelMap': 'addLabelMap',
	    'click': 'clickSelected',
	},
	render: function(){

	    //add style to rendering of the layer item
	    $(this.el).addClass('list-group-item');
	    $(this.el).addClass('layer');

	    
	    //template - set title
	    this.$el.html(this.template({layer_title: this.model.attributes.title}));
	    
	    $("#loadFile", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#delete", this.el).tooltip({delay: { show: 500, hide: 100 }});

	    $("#textHolder", this.el).tooltip({delay: { show: 500, hide: 100 }});


	    //hide the file pickers
	    $('#filePicker', this.el).hide();


	    return this; // for chainable calls, like .render().el
	},
	clickSelected:function(e){
	    //console.log('LayerItemView.clickSelected()');
	    //console.log(e.target);

	    this.layersView.setSelected(this.model, this);
	},
	setSelected: function(){
	    //console.log('LayerItemView.setSelected()');
	    
	    $(this.el).removeClass('layer');
	    $(this.el).addClass('layer-selected');
	},
	setUnselected: function(){
	    //console.log('LayerItemView.setUnselected()');
	    
	    $(this.el).removeClass('layer-selected');
	    $(this.el).addClass('layer');
	},
	loadFile: function(event){
	    //trigger the hidden fileLoader
	    $('#filePicker',this.el).trigger('click');
	    event.stopPropagation(); 
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
		//fileName: e.currentTarget.files[0].name,
		file : e.currentTarget.files[0]
	    });
	},
	labelLoaded: function(e){
	    //add text to layer preview
	    ////console.log('labelLoaded()');
	    //$('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    //call draw function
	    //loadLabelMap(e.currentTarget.files[0]);
	    Backbone.trigger('labelLoaded', [e.currentTarget.files[0], this.model.attributes.index]);
	},
	deleteLayer: function(event){
	    this.layersView.removeItem(this.model, this);
	    $(this.el).remove();

	    //cool stuff, stops the event from continuing (thereby
	    //causing multiple click events!
	    event.stopPropagation(); 
	},
	addLabelMap: function(event){
	    ////console.log('addLabelMap');
	    ////console.log($(this.el));
	    ////console.log($(this.el.parentElement));
	    //$('#layerList', this.el.parentElement).append('<li>TEST</li>')
	    //$(this.el.parentElement).append('<li>TEST</li>')
	    this.loadLabelMap();
	    event.stopPropagation(); 
	},
    });

    return LayerItemView;
});
