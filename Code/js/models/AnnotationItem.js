//do I need require/define here?
define(function() {

    var AnnoItem = Backbone.Model.extend({
	defaults: {
	    visible: true,
	    label: "",
	    color: [255, 255, 255],
	    points :[],
	}
    });
    return AnnoItem;
});
