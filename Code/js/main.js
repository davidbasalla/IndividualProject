console.log('running stuff');

define(["views/NavBarView",
	"views/SidePanelView",
	"views/ViewerWindowView",
	"models/LayersItem"],
       function(NavBarView,
		SidePanelView,
		ViewerWindowView,
		LayersItem) {
    
    var initialise = function() {

	console.log('getting dimensions');
	var w = window.innerWidth;
	var h = window.innerHeight;

	
	
	console.log(w);
	console.log(h);
	
	console.log('running initialise');
	var navBar = new NavBarView({
	    el: $('#navbar')
	});

	//var navBarHeight = h - $('#navbar').height();


	var sidePanel = new SidePanelView({
	    el: $('#sidePanel')
	});
	
	//init the layers item here...
	//pass it as an arg to the viewer window
	//viewer window to pass it to the indivdual views




	/*
	var viewerWindow = new ViewerWindowView({
	    el: $('#viewerWindow'),
	    layersModel: layersModel,
	});
	viewerWindow.render();
	

	var levels = new LevelsView({
	    el: $('#sidePanel')
	});
	levels.render();
	*/

	//layers.addItem();

	//NEED TO ADD PANEL VIEW BACK IN

    };
    return {
	initialise: initialise
    }
});
