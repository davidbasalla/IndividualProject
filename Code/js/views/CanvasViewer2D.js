//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer"], function(CanvasViewer2DTemplate, CanvasViewer) {
    var CanvasViewer2D = CanvasViewer.extend({
	template: _.template(CanvasViewer2DTemplate),
	render:function() {
	    console.log($(this.el));
	    
	    $(this.el).html(this.template({
		overlay: 'overlayToggle' + this.mode,
		canvasViewerId: 'canvasViewer3D',
		slider: 'sliderVertical' + this.mode,
	    }));

	    $( "#sliderVertical" + this.mode, this.el ).slider({
		orientation: "vertical",
		//range: "min",
		min: 0,
		max: 100,
		value: 50,
		slide: function( event, ui ) {
		    $( "#amount" ).val( ui.value );
		}
	    });

	    
	    return this; //to enable chain calling
	},
    });
    return CanvasViewer2D;
});
