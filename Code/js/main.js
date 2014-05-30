console.log('running stuff');

define(["views/NavBarView", "views/LayersView", "views/XtkViewerView"], function(NavBarView, LayersView, XtkViewerView) {
    
    var initialise = function() {

	console.log('running initialise');
	var navBar = new NavBarView({
	    el: $('#navbar')
	});
	navBar.render();

	var layers = new LayersView({
	    el: $('#sidePanel')
	});
	layers.render();


	var xtkViewer = new XtkViewerView({
	    el: $('#xtkViewer')
	});
	xtkViewer.render();


    };
    return {
	initialise: initialise
    }
});
