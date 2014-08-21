define(["text!templates/NavBar.html"], function(NavBarTemplate) {

    var NavBarView = Backbone.View.extend({
	template: _.template(NavBarTemplate),
	events: {
	    'click button#layoutButton1':'setLayout',
	    'click button#layoutButton2':'setLayout',
	    'click button#layoutButton3':'setLayout',
	    'click button#layoutButton4':'setLayout',	    
	    //'click a#sampleData':'setSampleData',
	},
	initialize:function() {
	    this.render();
	},
	render:function() {
	    this.$el.html(this.template);	    

	    
	    $("#layoutButton1").tooltip({delay: { show: 500, hide: 100 }});
	    $("#layoutButton2").tooltip({delay: { show: 500, hide: 100 }});
	    $("#layoutButton3").tooltip({delay: { show: 500, hide: 100 }});
	    $("#layoutButton4").tooltip({delay: { show: 500, hide: 100 }});

	},
	setSampleData:function(){

	    //new sampleDataView

	    


	},
	setLayout:function(e){
	    /*send signal to XtkView to set a layout
	     could make this more efficient by checking if current layout 
	    is being clicked, skipping it*/

	    console.log(e.currentTarget.id);

	    var layout = e.currentTarget.id;
	    
	    console.log(this.$el);

	    this.$el.find("#layoutButton1").removeClass('layout-selected');
	    this.$el.find("#layoutButton2").removeClass('layout-selected');
	    this.$el.find("#layoutButton3").removeClass('layout-selected');
	    this.$el.find("#layoutButton4").removeClass('layout-selected');

	    this.$el.find("#layoutButton1").addClass('layout-unselected');
	    this.$el.find("#layoutButton2").addClass('layout-unselected');
	    this.$el.find("#layoutButton3").addClass('layout-unselected');
	    this.$el.find("#layoutButton4").addClass('layout-unselected');


	    if(layout == 'layoutButton1'){
		this.$el.find("#layoutButton1").addClass('layout-selected');
		this.$el.find("#layoutButton1").removeClass('layout-unselected');
	    	Backbone.trigger('setLayout', 1);
	    }
	    else if (layout == 'layoutButton2'){
		this.$el.find("#layoutButton2").addClass('layout-selected');
		this.$el.find("#layoutButton2").removeClass('layout-unselected');
	    	Backbone.trigger('setLayout', 2);
	    }
	    else if (layout == 'layoutButton3'){
		this.$el.find("#layoutButton3").addClass('layout-selected');
		this.$el.find("#layoutButton3").removeClass('layout-unselected');
	    	Backbone.trigger('setLayout', 3);
	    }
	    else if (layout == 'layoutButton4'){
		this.$el.find("#layoutButton4").addClass('layout-selected');
		this.$el.find("#layoutButton4").removeClass('layout-unselected');
	    	Backbone.trigger('setLayout', 4);
	    }

	},
    });

    
    return NavBarView;
    
});
