console.log('running stuff');

define(["views/NavBarView", "views/LayersView","views/ViewerWindowView"], function(NavBarView, LayersView, ViewerWindowView) {
    
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

	/*
	var viewerWindow = new ViewerWindowView({
	    el: $('#viewerWindow')
	});
	viewerWindow.render();
	*/

    };
    return {
	initialise: initialise
    }
});
