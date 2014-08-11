define(["text!templates/AnnotationLayer.html"], function(AnnotationLayerTemplate) {
    
    var AnnotationItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(AnnotationLayerTemplate),
	
	initialize: function(options){

	    console.log('AnnoLayerItemView.init()');
	    this.index = options.index;
	    this.model = options.model;
	    this.annoObject = options.annoObject;
	    this.layersModel = options.layersModel;
	    this.parent = options.annosView;
	    console.log(this.annoObject);
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

	    //set the label
	    $('#labelInput', this.el).val(this.annoObject.label);



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
	deleteLayer: function(event){	    
	    console.log('AnnonationItemView.deleteLayer()');
	    //this.layersView.removeItem(this.model, this);
	    //$(this.el).remove();

	    this.parent.deleteLayerView(this);

	    //remove object from array
	    //remove layer from display


	    //cool stuff, stops the event from continuing (thereby
	    //causing multiple click events!
	    event.stopPropagation(); 
	},
    });

    return AnnotationItemView;
});
