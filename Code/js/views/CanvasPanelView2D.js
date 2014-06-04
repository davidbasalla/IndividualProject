//need to pass a variable here

define(["text!templates/CanvasPanel2D.html","views/CanvasPanelView"], function(CanvasPanelTemplate2D, CanvasPanelView) {
    var ViewerWindowView2D = CanvasPanelView.extend({
	template: _.template(CanvasPanelTemplate2D),
    });
    return ViewerWindowView2D;
});
