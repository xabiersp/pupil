(function( $ ){
	
	var methods = {
		init: function( options ){
			return this.each(function(){
				alert($(this).attr('class'));
			});

		},
		show: function(){
			this.each(function(){
				var position = {
					top: $(this).offset().top + $(this).height(),
					left: $(this).offset().left,
					width: $(this).outerWidth(true)
				}

				$(this).children('ul').each(function(){			
					
					console.log(position);

					obj = $(this).clone();
					obj.css('display', 'block');
					obj.css('position', 'absolute');
					obj.css('top', position.top + 'px');
					obj.css('left', position.left + 'px');
					obj.css('width', position.width + 'px');
					obj.attr('id', 'dropdown_displayed');

					obj.appendTo('body');
					//obj.bind('clickoutside', function(e){ alert('hide')});
					$('body').click(methods.hide);
				});
			});
		},
		hide: function(e){
			$('#dropdown_displayed').remove();
			/*
			$('#dropdown_displayed').hide(function(){
				$(this).remove();
			});
*/

		}
	}

	$.fn.dropdown = function(method){
		if ( methods[method] ) {
      		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	} else if ( typeof method === 'object' || ! method ) {
      		return methods.init.apply( this, arguments );
    	} else {
      		$.error( 'Method ' +  method + ' does not exist on jQuery.dropdown' );
    	}  
    }

})(jQuery);

$(document).ready(function(){
	$('.dropdown').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).dropdown('hide');
		$(this).dropdown('show');
	});	
});