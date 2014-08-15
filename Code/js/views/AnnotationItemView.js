define(["text!templates/AnnotationLayer.html"], function(AnnotationLayerTemplate) {
    
    var AnnotationItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	template: _.template(AnnotationLayerTemplate),
	
	initialize: function(options){

	    console.log('AnnoLayerItemView.init()');

	    this.currentItem = options.currentItem;
	    this.annoObject = options.annoObject;
	    this.layersModel = options.layersModel;
	    this.parent = options.annosView;
	},
	events: {
	    //event for toggling visibility
	    'change input#annoVisible': 'setVisibility',
	    'click button#delete': 'deleteLayer',
	    'change input#filePicker': 'fileLoaded',
	    'change input#labelInput': 'setLabelText',
	    'click': 'clickSelected',
	},
	render: function(){
	    console.log('AnnoLayerItemView.render()');
	    
	    //add style to rendering of the layer item
	    $(this.el).addClass('list-group-item');
	    $(this.el).addClass('layer');
	    
	    
	    //template - set title
	    this.$el.html(this.template);

	    console.log(this.annoObject);
	    console.log(this.annoObject.identifier);

	    $(this.el).attr("id", this.annoObject.identifier);

	    //should set the color to the appropriate color
	    $('.color-box', this.el).css('background-color', this.annoObject.color);

	    //$("#colorpicker-popup", this.el).colorpicker();
	    $("#picker", this.el).colpick();

	    //add colorpicker
	    var _this = this;
	    $('.color-box', this.el).colpick({
		colorScheme:'dark',
		layout:'rgbhex',
		color:'ff8800',
		onSubmit:function(hsb,hex,rgb,el) {
		    $(el).css('background-color', '#'+hex);
		    $(el).colpickHide();
		    _this.setColor(hex);
		}
	    })

	    //check the visibility checkbox if visible
	    console.log(this.annoObject);

	    if(!this.annoObject.visible){		
		$('#annoVisible', this.el).prop("checked", false);
	    }
	    else
		$('#annoVisible', this.el).prop("checked", true);	


	    //set the label
	    $('#labelInput', this.el).val(this.annoObject.label);



	    return this; // for chainable calls, like .render().el
	},
	clickSelected:function(e){
	    //console.log('LayerItemView.clickSelected()');
	    //console.log(e.target);

	    //this.layersView.setSelected(this.model, this);
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

	    this.currentItem.removeAnno(this.annoObject);

	    this.parent.deleteLayerView(this);

	    event.stopPropagation(); 
	},
	setLabelText:function(e){
	    console.log(e);
	    
	    //set the current
	    this.annoObject.label = e.target.value;
	    this.parent.updateModel();
	},
	setColor:function(hex){
	    console.log(hex.toUpperCase());	    

	    this.annoObject.color = '#' + hex.toUpperCase();
	    this.parent.updateModel();
	},	
	setVisibility:function(e){
	    console.log('AnnotationItemView.setVisibility');

	    //set the current
	    if(this.annoObject.visible)
		this.annoObject.visible = false;
	    else
		this.annoObject.visible = true;

	    this.parent.updateModel();
	},
    });

    return AnnotationItemView;
});
