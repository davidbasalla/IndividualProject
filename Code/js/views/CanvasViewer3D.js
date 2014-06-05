//need to pass a variable here

define(["text!templates/CanvasViewer3D.html","views/CanvasViewer"], function(CanvasViewer3DTemplate, CanvasViewer) {
    var CanvasViewer3D = CanvasViewer.extend({
	template: _.template(CanvasViewer3DTemplate),
	render:function() {
	    $(this.el).html(this.template({
		canvasViewerId: 'canvasViewer3D',
		slider: "sliderVertical" + this.mode,
		overlay: "overlay" + this.mode
	    }));
    
	    return this; //to enable chain calling
	},



    });
    return CanvasViewer3D;
});
