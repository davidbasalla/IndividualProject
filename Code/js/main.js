console.log('running stuff');

define(["views/NavBarView","views/LayersView"], function(NavBarView,LayersView) {
    
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



    };
    return {
	initialise: initialise
    }
});
