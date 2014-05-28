require.config({
    baseUrl: "js", //load here by default
    paths: {
	//can give these arbitrary names!
	//Backbone: "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min",
	Backbone: "libs/backbone-min",
	//Underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore",
	Underscore: "libs/underscore-min",
	jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery",
	json2: "http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2",
	Bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
	text: "libs/text",
	templates: "/templates",
	xtk: "../../X/utils/xtk",
    },
    shim: {
	/* used to fix dependency order */
	"Backbone": {
	    deps: ['Underscore', 'jquery', 'text'],
	    exports: "Backbone"
	},
	"main": {
	    deps: ['Backbone']
	},
    },
});

//load main app
require(["main"]);

/*require(['jquery'], function($){
    $('#output').html('Hello World');
});*/
