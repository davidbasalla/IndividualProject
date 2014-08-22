require.config({
    baseUrl: "js", //load here by default
    paths: {
	//can give these arbitrary names!
	//Backbone: "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min",
	Backbone: "libs/backbone-min",
	//Underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore",
	Underscore: "libs/underscore-min",
	jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery",
	jqueryUI: "libs/jquery-ui.min",
	json2: "http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2",
	Bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
	text: "libs/text",
	templates: "../templates",
	xtk: "../../X/xtk-deps",
	closure: "../../X/lib/google-closure-library/closure/goog/base",
	//colorpicker: "../../Colorpicker/colorpicker-master/jquery.colorpicker",
	colorpicker: "../../Colorpicker/colpick/js/colpick",
	xtk: "../../X/utils/xtk",
	//goog: "../../X/lib/google-closure-library/closure/goog/base"
    },
    shim: {
	/* used to fix dependency order */
	"Backbone": {
	    deps: ['Underscore', 'jquery', 'text'],
	    exports: "Backbone"
	},
	"jqueryUI": {
            deps: ['jquery']
        },
	"xtk":{
	    deps:['closure'],
	    exports: "xtk"
	},
	"Bootstrap": {
	    deps: ['jquery', 'jqueryUI'],
	    exports: "Bootstrap"
	},
	"colorpicker":{
	    deps: ['jquery', 'jqueryUI']
	},
	"views/MainView": {
	    deps: ['Backbone','Bootstrap','jqueryUI','colorpicker','xtk']
	    //deps: ['Backbone','Bootstrap','jqueryUI','colorpicker']
	},
    },
});

//load main app
require(["views/MainView"], function(MainView) {

    console.log('running main');

    //goog.require("X");
    // goog.require("X.renderer3D");
    //goog.require("X.renderer2D");
    //goog.require("X.vector");


    var main = new MainView();
    
    //app.initialise();
});
/*require(['jquery'], function($){
    $('#output').html('Hello World');
});*/
//<script type="text/javascript" src="X/lib/google-closure-library/closure/goog/base.js"></script>
//<script type="text/javascript" src="X/xtk-deps.js"></script>
//xtk: "../../X/utils/xtk",
