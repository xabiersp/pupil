$(document).ready(function(){
		$('[aspex-action="dialog-open"]').bind('click', function(e){
			e.preventDefault();
			$('<div />').dialog({url: $(this).attr('href')});
		});
});

(function($, window, document, undefined){	
	var dialogObject = {
		url: '',
		type: 'form',
		element: '',
		blackout: '',
		header: {
			showTitle: true,
			content: ''
		},
		body: {
			content: ''
		},
		footer: {

		}
	};
		
	var methods = {
		init : function(options){
			dialogObject.url = options.url

			return this.each(function(){
				var $this = $(this),
					data = $this.data('dialog'),
					dialog = $('<div />', {text: $this.attr('title')});
					blackout = $('<div />', {text: $this.attr('title')});

					dialogObject.element = dialog;
					dialogObject.blackout = blackout;
					dialogObject.url = options.url;
					
					methods._getData();

				if(!data){

					$(this).data('dialog', {
						target: $this,
						dialog: dialog,
						blackout: blackout
					});
				}
			});
		},
		show : function(){
			alert('showing');
			this._draw();
		},
		close : function(){
			dialogObject.element.remove();
			dialogObject.blackout.remove();
		},
		_draw : function(){
			var dialog = dialogObject.element;
			var blackout = dialogObject.blackout;
			
			blackout.addClass('dialog_blackout');
			dialog.text('');


			dlg_content = $('<div >').addClass('dialog_content');
			dlg_header = $('<div />').addClass('dialog_header');
			dlg_body = $('<div />').addClass('dialog_body');
			dlg_footer = $('<div />').addClass('dialog_footer');

			//Title dialog
			if(dialogObject.header.showTitle){
				h3 = $('<h3 />');
				h3.append(dialogObject.header.content);
				dlg_header.append(h3);
			}
			if(dialogObject.type == 'form'){
				form_content = $('<div />').addClass('form-content');
				form = $('<form />').attr('method', 'post');
				form.attr('action', dialogObject.url);

				form.append(dialogObject.body.content);
				form_content.append(form);
				dlg_body.append(form_content);

				btn_send = $('<div />').addClass('btn').append('Send');
				btn_close = $('<div />').addClass('btn').append('Close');

				dlg_footer.append(btn_close);
				dlg_footer.append(btn_send);
			} else {
				dlg_body.html(dialogObject.body.content);
			}			

			dialog.addClass('dialog');

			dlg_content.append(dlg_header);
			dlg_content.append(dlg_body);
			dlg_content.append(dlg_footer);

			dialog.append(dlg_content);

			dialog.appendTo('body');
			dialogObject.blackout.appendTo('body');

			dialogObject.blackout.bind('click', methods.close);
			
			btn_close.bind('click', methods.close);			
			btn_send.bind('click', methods._sendForm)

			form.bind('submit', methods._submitFormAjax);


			//El siguiente timeout da el Foco al primer input con error o solo al primer imput
			setTimeout(function(){
				if($('.dialog').find('.error').length > 0){
					$('.dialog').find('.error:first').find('input:first').focus();
				} else {
					$('.dialog').find('input:first').each(function(){
						$(this).focus();
					});
				}			
			}, 300);

			//Centra el dialog en el medio de la pantalla
			methods._centered();

		},
		_centered: function(){
			var w = dialogObject.element.outerWidth() / 2;
			var h = dialogObject.element.outerHeight() / 2;
			dialogObject.element.css('left', '50%');
			dialogObject.element.css('margin-left', '-' + w + 'px');
			dialogObject.element.css('top', '40%');
			dialogObject.element.css('margin-top', '-' + h + 'px');
			
		},
		_getData : function(data, method_){
			if(data && data !== 'undefined'){
				params = data
			} else {
				params = ''
			}
			if(method_ && method_ !== 'undefined'){
				var method = method_
			} else {
				var method = 'get'
			}

			$.ajax({
				url: dialogObject.url,
				data: params,
				type: method,
				success: this._getDataSuccess,
				error: this._getDataError
			});
		},
		_getDataSuccess : function(data, textStatus, jqXHR){
			res_type = jqXHR.getResponseHeader('content-type');			
			if(res_type.indexOf('json') > -1){
				if(data.type.indexOf('form') > -1){
					dialogObject.type = data.type;
					dialogObject.url = data.action;
					dialogObject.body.content = data.form;
					dialogObject.header.content = data.title;

					methods._draw();
				} else if(data.type.indexOf('code') > -1) {
					if(data.action == 200){
						alert('closing');
						methods.close();
						//Llamar a callback si es que hay
					}
				} else {
					dialogObject.type = data.type
					dialogObject.body.content = data.form
					dialogObject.header.content = data.title

					methods._draw();
				}
			} else if(res_type.indexOf('html') > -1) {
				dialogObject.body.content = data
				methods._draw();
			}
			
		},
		_getDataError : function(jqXHR, textStatus,errorThrown){
			alert(jqXHR + ' ' + textStatus + ' ' + errorThrown);
		},
		_sendForm : function(e){
			e.preventDefault();
			form = dialogObject.element.find('form');
			form.submit();
		},
		_submitFormAjax : function(e){
			e.preventDefault();
			methods._getData(form.serialize(), 'post');
		}
	};

	$.fn.dialog = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + + ' does not exist on jQuery.dialog');
		}
	};
})(jQuery);