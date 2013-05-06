var forms = require('../../entities/forms')

exports.process_form = function (req, res, instance, callback){

	var form = eval('forms.' + instance + '_form');	
	var template = 'forms/form-' + instance;
	var title = 'Add new ' + instance;

	if(req.route.method == 'post'){
		form.handle(req, {
			success: callback,
			error: function(form){
				res.render(template, {
					'title': title,
					'form': form.toHTML()
				});
			},
			empty: function(form){
				res.render(template, {
					'title': title,
					'form': form.toHTML()
				});
			}
		});
	} else {
		res.render(template, {
			'title': title,
			'form': form.toHTML()
		});
	}
}