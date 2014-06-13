define(["views/NavBarView", "views/SidePanelView", "views/ViewerWindowView"],
       function(NavBarView, SidePanelView, ViewerWindowView) {
	   var MainView = Backbone.View.extend({
	       initialize:function() {
		   console.log('MainView.init()');

		   //INTERESTING, NEED TO THIS KEEP FOCUS FOR SET_SIZE FUNCTION!
		   _.bindAll(this, 'setSize');

		   //EVENT FOR RESIZING OF WINDOW
		   $(window).on("resize", this.setSize);

		   //INIT SUBCOMPONENTS
		   this.navBar = new NavBarView({
		       el: $('#navbar')
		   });

		   this.sidePanel = new SidePanelView({
		       el: $('#sidePanel')
		   });

		   this.viewerWindow = new ViewerWindowView({
		       el: $('#viewerWindow'),
		       layersModel: this.sidePanel.layersView.layersModel,
		   });
		   
		   //set size first time
		   this.setSize();
		   
	       },
	       setSize:function(){
		   console.log('MainView.setSize()');

		   var w = window.innerWidth;
		   var h = window.innerHeight;

		   var navBar_height = $('#navbar').height();
		   var sidePanel_height = h - navBar_height;
		   var sidePanel_width = $('#sidePanel').width();
		   var viewerWindow_height = sidePanel_height*2;
		   var viewerWindow_width = w - sidePanel_width - 20;

		   var canvasPanels_height = sidePanel_height;
		   var canvasPanels_width = viewerWindow_width;
		   var xtkPanels_height = sidePanel_height;
		   var xtkPanels_width = viewerWindow_width;
		   
	   

		   //SET THE DIMENSIONS...
		   
		   $('#sidePanel').css({ "height": sidePanel_height});
		   
		   $('#viewerWindow').css({ "height": viewerWindow_height});
		   $('#viewerWindow').css({ "width": viewerWindow_width});

		   $('#canvasPanels').css({ "height": canvasPanels_height});
		   $('#canvasPanels').css({ "width": canvasPanels_width});
		   $('#xtkPanels').css({ "height": xtkPanels_height});
		   $('#xtkPanels').css({ "width": xtkPanels_width});

		   this.viewerWindow.setSize();
	       },
	   });
	   return MainView;
       });
