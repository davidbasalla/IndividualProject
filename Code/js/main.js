console.log('running stuff');

define(["views/NavBarView", "views/LayersView","views/LevelsView","views/ViewerWindowView"], function(NavBarView, LayersView, LevelsView, ViewerWindowView) {
    
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

	var levels = new LevelsView({
	    el: $('#sidePanel')
	});
	levels.render();

	
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
