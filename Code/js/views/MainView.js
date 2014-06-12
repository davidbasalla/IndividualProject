define(["views/NavBarView", "views/SidePanelView", "views/ViewerWindowView"],
       function(NavBarView, SidePanelView, ViewerWindowView) {
	   var MainView = Backbone.View.extend({
	       initialize:function() {
		   console.log('MainView.init()');

		   $(window).on("resize", this.setSize);

	   
		   this.navBar = new NavBarView({
		       el: $('#navbar')
		   });

		   //var navBarHeight = h - $('#navbar').height();
		   
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

		   console.log('Dimensions = ');
		   var w = window.innerWidth;
		   var h = window.innerHeight;
		   console.log(w + ', ' + h);

		   var navBar_height = $('#navbar').height();
		   var sidePanel_height = h - navBar_height;

		   console.log('NavBar_height = ' + navBar_height);
		   console.log('sidePanel_height = ' + sidePanel_height);

		   //set the heights
		   $('#sidePanel').css({ "height": sidePanel_height});
		   $('#viewerWindow').css({ "height": sidePanel_height});

		   
	       },
	   });
	   return MainView;
       });
