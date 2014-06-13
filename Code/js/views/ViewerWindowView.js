/* SHOULD TAKE CARE OF XTK VIEWER MANAGEMENT:
   - when new viewer is added, add it to an array for querying
*/

define(["views/CanvasViewer3D", "views/CanvasViewer2D", "text!templates/ViewerWindow.html"],
       function(CanvasViewer3D, CanvasViewer2D, ViewerWindowTemplate)
       {
	   var ViewerWindowView = Backbone.View.extend({
	       el:'#viewerWindow',
	       template: _.template(ViewerWindowTemplate),
	       initialize:function(options) {
		   console.log('ViewerWindowView.init()');
		   
		   //set the current layer
		   this.layersModel = options.layersModel;
		   this.layersModel.on("change:currentLayer", this.setCurrentLayerItem, this);

		   Backbone.on('onRender', this.update, this);

		   this.layerIndex = 0;
		   this.currentItem = "";

		   this.render();
		   this.setSize();
	       },
	       setSize:function(){
		   console.log('ViewerWindowView.setSize()');

		   //RESET THE GLOBAL CONTAINER DIMENSIONS
		   var height = $('#canvasPanels').height() - 20;
		   var width = $('#canvasPanels').width() - 20;
		   
		   $('.canvasPanel').css({ "height": height/2});
		   $('.canvasPanel').css({ "width": width/2});


		   //RESET THE VIEWER CANVAS DIMENSIONS
		   var myList = document.getElementsByTagName("canvas");

		   for(var i = 0; i < myList.length; i++){
		       $(myList[i]).attr("height", height/2 - 40);
		       $(myList[i]).attr("width", width/2);
		   }

		   //RESET THE XTK PANELS
		   console.log('Resizing XTK Panels');
		   console.log($('#xtkPanels'));

		   
	       },
	       render:function() {
		   //load the template

		   this.$el.append(this.template);
		   
		   //create the 4 different views here

		   //need to pass which CanvasSource to look at
		   this.viewer0 = new CanvasViewer2D({
	    	       el: '#panel0',
		       viewerIndex: 0,
		       mode: 0,
		   });
		   this.viewer0.render();
		   this.viewer0.setMode(0);

		   this.viewer1 = new CanvasViewer2D({
		       el:'#panel1',
		       viewerIndex: 1,
		       mode: 1,
		   });
		   this.viewer1.render();
		   this.viewer1.setMode(1);

		   this.viewer2 = new CanvasViewer2D({
		       el:'#panel2',
		       viewerIndex: 2,
		       mode: 2,
		   });
		   this.viewer2.render();
		   this.viewer2.setMode(2);

		   this.viewer3 = new CanvasViewer2D({
		       el:'#panel3',
		       viewerIndex: 3,
		       mode: 3,
		   });
		   this.viewer3.render();
		   this.viewer3.setMode(3);
	       },
	       setCurrentLayerItem:function(model, value, options){
		   // console.log('viewerWindowView.setCurrentLayerItem()');

		   //turn OFF triggers for previous object
		   if(this.currentItem)
		       this.currentItem.off("change:loaded", this.update, this);

		   //turn ON triggers for current object
		   this.currentItem = model.get('currentItem');
		   this.currentItem.on("change:loaded", this.update, this);


		   //need to set the canvas to copy from
		   this.viewer0.setCurrentItem(this.currentItem);
		   this.viewer1.setCurrentItem(this.currentItem);
		   this.viewer2.setCurrentItem(this.currentItem);
		   this.viewer3.setCurrentItem(this.currentItem);
		   
	       },
	       update:function(){
		   //console.log('ViewerWindowView.update()');

		   this.viewer0.draw();
		   this.viewer1.draw();
		   this.viewer2.draw();
		   this.viewer3.draw();

		   
		   //call draw functions of all canvases
	       },
	       scroll:function(){
		   
		   //console.log('ViewerWindowView.scroll()');

		   var oldX = this.currentItem.get('indexX');
		   if(e.originalEvent.wheelDelta < 0)
		       this.currentItem.set({
			   indexX: oldX - 1,
		       });
		   else
		       this.currentItem.set({
			   indexX: oldX + 1,
		       });
	       },
	   });
	   return ViewerWindowView;
       });
