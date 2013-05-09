$(document).ready(function(){
	$('[dialog-action="open"]').fancybox({
		type: 'ajax',
		openEffect: 'none',
		closeEffect: 'none'
	});
	
	//Asigna evento a todo 
	$(document).on('click', '[dialog-action="close"]', function(e){
		e.preventDefault();
		$.fancybox.close();
	});


	$(document).on('submit', '.fancybox-wrap form', function(e){
		e.preventDefault();

		$.ajax({
			url: $(this).attr('action'),
			type: 'post',
			data: $(this).serialize(),
			beforeSend: $.fancybox.showLoading,
			timeout: errorLoadingContent,
			error: errorLoadingContent,
			success: function(data){
				$.fancybox(data);
			}
		});
	});


});

function errorLoadingContent(){
	var error = '<p class="error">Something goes wrong. Please try again later</p>';

	$.fancybox.hideLoading();
	$.fancybox(error);

	setTimeout(function(){
		$.fancybox.close();
	}, 3500);
}