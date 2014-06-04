//need to pass a variable here

define(["text!templates/CanvasPanel3D.html","views/CanvasPanelView"], function(CanvasPanelTemplate3D, CanvasPanelView) {
    var ViewerWindowView3D = CanvasPanelView.extend({
	template: _.template(CanvasPanelTemplate3D),
	initialize: function(){
	    console.log(this.$el);
	    console.log($('#volumeRender', this.el));
	},

	
	events: {
	    'click button#button': 'setVolumeRender',
	    'change input#volumeRender': 'setVolumeRender',
	},
	setVolumeRender: function(e){
	    console.log('volumeRender');
	    console.log(e.target.checked);

	    console.log(this.volume);
	    
	},
    });
    return ViewerWindowView3D;
});
