//need to pass a variable here

define(["text!templates/CanvasViewer3D.html","views/CanvasViewer"], function(CanvasViewer3DTemplate, CanvasViewer) {
    var CanvasViewer3D = CanvasViewer.extend({
	template: _.template(CanvasViewer3DTemplate),
	render:function() {
	    console.log('CanvasViewer3D.render()');
	    $(this.el).html(this.template({
		canvasViewerId: 'canvasViewer0',
	    }));
    
	    return this; //to enable chain calling
	},
	setSrcCanvas:function(index){
	    console.log('settingSrc to ' +  index);
	    //this.draw();
	},
	draw:function(){
	    //update the canvases
	},
    });
    return CanvasViewer3D;
});
