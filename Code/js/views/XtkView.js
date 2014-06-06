//need to pass a variable here

define(["text!templates/XTK.html"], function(XTKTemplate) {
    var XtkView = Backbone.View.extend({
	el: '#xtkPanels',
	template: _.template(XTKTemplate),
	events: {
	},
	initialize:function(options) {
	    console.log('initXTK()');
	    this.layerIndex = options.layerIndex;
	    this.render();

	},
	render:function() {
	    console.log('render()');
	    console.log(this.el);
	    console.log(this.$el);

	    this.$el.append(this.template({layerIndex: 'xtkViewer_L' + this.layerIndex}));
	    this.initViewers();
	},
	initViewers:function(){
	    //create all 4 viewers

	    //set x to be the master viewer
	},
	loadFile:function(){
	    //do file stuff, load it into the master viewer
	},
    });
    return XtkView;
});
