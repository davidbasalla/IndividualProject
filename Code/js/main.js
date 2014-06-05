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
	//layers.addItem();

	var levels = new LevelsView({
	    el: $('#sidePanel')
	});
	levels.render();

	var viewerWindow = new ViewerWindowView({
	    el: $('#viewerWindow')
	});
	viewerWindow.render();

	//NEED TO ADD PANEL VIEW BACK IN

    };
    return {
	initialise: initialise
    }
});
