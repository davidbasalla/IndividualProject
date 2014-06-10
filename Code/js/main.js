console.log('running stuff');

define(["views/NavBarView", "views/LayersView","views/LevelsView","views/ViewerWindowView","models/LayersItem"], function(NavBarView, LayersView, LevelsView, ViewerWindowView, LayersItem) {
    
    var initialise = function() {

	console.log('running initialise');
	var navBar = new NavBarView({
	    el: $('#navbar')
	});
	navBar.render();


	//init the layers item here...
	//pass it as an arg to the viewer window
	//viewer window to pass it to the indivdual views


	var layersModel = new LayersItem();
	console.log(layersModel);

	
	var layers = new LayersView({
	    el: $('#sidePanel'),
	    layersModel: layersModel,
	});
	layers.render();


	var viewerWindow = new ViewerWindowView({
	    el: $('#viewerWindow'),
	    layersModel: layersModel,
	});
	viewerWindow.render();
	

	var levels = new LevelsView({
	    el: $('#sidePanel')
	});
	levels.render();

	//layers.addItem();

	//NEED TO ADD PANEL VIEW BACK IN

    };
    return {
	initialise: initialise
    }
});
