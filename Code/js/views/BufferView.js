define(["text!templates/Buffer.html"], function(BufferTemplate) {
    
    var BufferView = Backbone.View.extend({
	//define the template
	template: _.template(BufferTemplate),
	events: {
	    'click button#bufferA':'setBuffer',
	    'click button#bufferB':'setBuffer',
	},
	initialize:function(options) {

	    this.layersModel = options.layersModel;
	    this.render();
	},
	render:function() {

	    this.$el.html(this.template);
	    
	},
	setBuffer:function(value){
	    console.log('setBuffer()');

	    if (value.currentTarget.id == 'bufferA'){
		console.log('A');

		this.layersModel.toggleBuffer(0);
		
		$('#bufferB', this.el).removeClass('layer-selected');
		$('#bufferB', this.el).addClass('layer-unselected');
		$('#bufferA', this.el).removeClass('layer-unselected');
		$('#bufferA', this.el).addClass('layer-selected');
	    }
	    else{
		console.log('B');

		this.layersModel.toggleBuffer(1);

		$('#bufferA', this.el).removeClass('layer-selected');
		$('#bufferA', this.el).addClass('layer-unselected');
		$('#bufferB', this.el).removeClass('layer-unselected');
		$('#bufferB', this.el).addClass('layer-selected');
	    }
	},
    });
    
    return BufferView;
});
