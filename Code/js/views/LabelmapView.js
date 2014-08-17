define(["text!templates/Labelmap.html"], 
       function(LabelmapTemplate) {
    
    var LabelmapView = Backbone.View.extend({
	//define the template
	template: _.template(LabelmapTemplate),
	initialize:function(options) {
	    this.currentItem = null;//item for detecting changes
	    this.layersModel = options.layersModel;

	    this.render();
	},	
	events: {	    		
	    'change input#labelmapVisible': 'setLabelmap',
	},
	render:function() {

	    this.$el.html(this.template);
	    
	    $( "#labelmapOpacitySlider" ).slider({
		min: 0,
		max: 100,
		value: 100,
		slide: function( event, ui ) {
		    $( "#labelmapOpacityInput" ).val(ui.value);
		    Backbone.trigger('labelmapOpacityChange', ui.value);
		}
	    });
	},

	setCurrentItem:function(currentItem){
	    console.log('LabelmapView.setCurrentItem()');

	    if(this.currentItem){
		this.currentItem.off("change:annotations", this.updateFromModel, this);
	    }
	    
	    //get new object
	    this.currentItem = currentItem;
	    
	    //turn ON triggers for current object
	    if(this.currentItem){
		this.currentItem.on("change:annotations", this.updateFromModel, this);
	    }

	    this.setSettings(currentItem);
	},
	setSettings:function(currentItem){
	    //would have to reset the annotations here!!
	    
	},
	setLabelmap:function(){
	    console.log('LabelmapView.setLabelmap()');
	    //Backbone.trigger('labelmapChange');
	    
	    var file = 'http://x.babymri.org/?seg.nrrd';
	    
	    this.currentItem.set({labelmap: file});


	},
    });
    return LabelmapView;
    
});