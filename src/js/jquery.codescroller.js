(function( $ ) {
    $.fn.codescroller = function(options) {
		var box = this; 
		var start_text = box.html();  
		
		var container; 
		var scrollarea; 
		var scrollbar; 
		var ruler; 
		
		var scrollRate = 0; 
		
        var options = $.extend({
            width: 400,
			height: 400,
			cursorWidth: 10, 
			blur: false, 
			onPress: null, 
			onUpdate: null, 
			onRelease: null, 
			theme: "default"
        }, options );
		
		$('<link rel="stylesheet" type="text/css" href="css/jquery.codescroller.'+options.theme+'.css" >').appendTo("head");
		
		function init() {
			start_text = box.html(); 
			box.empty(); 
			
			// append container
			box.append("<div class='codescroller-container'></div>"); 
			container = box.find(".codescroller-container");
			container.width(options.width).height(options.height); 

			// append scrollbar
			container.empty(); 
			container.append("<div class='codescroller-scrollbar'><div class='codescroller-scroller'><div class='codescroller-ruler'></div></div></div>"); 
			scrollbar = box.find(".codescroller-scrollbar");
			scrollbar.width(options.cursorWidth).height("100%").css("right", 0).css("top", 0); 
			scrollbar.find(".codescroller-scroller").width("100%").height("100%"); 
			container.append("<div class='codescroller-text'></div>"); 
			scrollarea = box.find(".codescroller-text");
			scrollarea.width(container.width() - scrollbar.width() - 10); // 
			scrollarea.html(start_text); 		

			var ruler_height = (scrollbar.height() / scrollarea.height()) * scrollbar.height(); 
			scrollbar.find(".codescroller-ruler").width("100%").height(ruler_height);   
				
			scrollbar
				.find(".codescroller-ruler")
				.draggable({ 
					axis: "y", 
					containment: scrollbar.find(".codescroller-scroller"), 
					scroll: false,  
					start: function() {
						if (options.onStart != null) {
							options.onStart(); 	
						}
					},
					drag: function() {
						if (options.onUpdate != null) {
							options.onUpdate(); 	
						}						
						updateTextPosition(); 
					},
					stop: function() {
						if (options.onStop != null) {
							options.onStop(); 	
						}						
					}
				});		
				
			var MOUSE_OVER = false;
			$('body').bind('mousewheel', function(e){
				if (MOUSE_OVER) {
					if (e.preventDefault) { e.preventDefault(); }
					e.returnValue = false; 
					return false; 	
				}
			}); 		
				
			container.mouseenter(function(){ MOUSE_OVER=true; });
			container.mouseleave(function(){ MOUSE_OVER=false; });
			
			container.bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
	
				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail); 
				
				if (delta > 0) {
					scrollRate -= 10; 								
				} else {
					scrollRate += 10; 
				}
				
				if (scrollRate < 0) { scrollRate = 0; } 
				if (scrollRate > 100) { scrollRate = 100; }
				
				updateScrollPosition();
			}); 
		}
		
		function updateTextPosition() {
			var scrollbar = box.find(".codescroller-scrollbar");
			var background = scrollbar.find(".codescroller-scroller"); 
			var ruler = scrollbar.find(".codescroller-ruler"); 
			var scrollarea = box.find(".codescroller-text");
			var rate = Math.floor((100 / (background.height() - ruler.height())) * ruler.position().top) ; 
			var text_newy = ((scrollarea.height() - scrollbar.height()) / 100) * rate; 
			
			scrollRate = rate; 
			
			scrollarea.css("top", -text_newy); 
		}
		
		function updateScrollPosition() {
			var scrollbar = box.find(".codescroller-scrollbar");
			var background = scrollbar.find(".codescroller-scroller"); 
			var ruler = scrollbar.find(".codescroller-ruler"); 
			var scrollarea = box.find(".codescroller-text");
			ruler.css("top", ((background.height() - ruler.height()) / 100) * scrollRate);
			scrollarea.css("top", -((scrollarea.height() - scrollbar.height()) / 100) * scrollRate); 
		}		
		
		init(); 

		return box; 
    };
}( jQuery ));