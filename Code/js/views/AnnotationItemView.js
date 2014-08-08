define(["text!templates/AnnotationLayer.html"], function(AnnotationLayerTemplate) {
    
    var AnnotationItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(AnnotationLayerTemplate),
	
	initialize: function(options){

	    console.log('AnnoLayerItemView.init()');
	    this.model = options.model;
	    this.layersModel = options.layersModel;
	    this.render();
	},
	events: {
	    //event for toggling visibility
	    'click button#delete': 'deleteLayer',
	    'change input#filePicker': 'fileLoaded',
	    'click': 'clickSelected',
	},
	render: function(){
	    console.log('AnnoLayerItemView.render()');
	    
	    //add style to rendering of the layer item
	    $(this.el).addClass('list-group-item');
	    $(this.el).addClass('layer');

	    
	    //template - set title
	    this.$el.html(this.template);

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
	fileLoaded: function(e){
	    console.log('fileLoaded()')
	    //add text to layer preview
	    $('#textHolder', this.el).html(e.currentTarget.files[0].name);

	    this.model.set({
		fileName: e.currentTarget.files[0].name,
		file : e.currentTarget.files[0]
	    });

	    //console.log(this.model);
	    
	    //trigger event that file has loaded, expected by XtkViewer
	    //send file along as a parameter
	    //Backbone.trigger('fileLoaded', [e.currentTarget.files[0], this.model.attributes.index]);
	},
	deleteLayer: function(event){
	    this.layersView.removeItem(this.model, this);
	    $(this.el).remove();

	    //cool stuff, stops the event from continuing (thereby
	    //causing multiple click events!
	    event.stopPropagation(); 
	},
    });

    return AnnotationItemView;
});
