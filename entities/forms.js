var forms = require('forms')
  , fields = forms.fields
  , validators = forms.validators
  , widgets = forms.widgets
  , course = require('./eCourse')
  , user = require('./eUser')
  , student = require('./eStudent')


var course_form = forms.create({
	name: fields.string({required: true}),
	initial: fields.string({required: true}),
	description: fields.string({widget: widgets.textarea(), label: 'Descripción'})
});

var student_form = forms.create({
	first_name: fields.string({required: true}),
	last_name: fields.string({required: true}),
	second_last_name: fields.string(),
	email: fields.email()
});

var sendForm = function(args){

	var req = args.req
	var res = args.res
	var form = args.form
	var title = args.title

	var form_ =  eval(form + '_form');
	var model_ = eval(form);

	var response = {
		type: 'form',
		action: req.path,
		title: title,
		form: form_.toHTML()
	}

	var validate = function(req, res){
		form.handle(req, {
			success: args.success,
			error: args.success,
			empty: args.success
		});

	}

	var sendResponse = function(req, res){
		if(req.xhr){
			res.json(response);
		} else {
			res.render('forms/form-class', {
				form: response.form,
				title: response.title
			});		
		}
	}

	var sendResponseSaved = function(req, res){
		response.type = 'code',
		response.action = 200
		res.json(response);
	}

	var send = function(req, res){

	}

	if(req.route.method == 'post'){
		form_.handle(req, {
			success: function(form){
				var keys = Object.keys(form.data);
				var data = {};
				for(i in keys){
					eval('data.' + keys[i] + ' = form.data.' + keys[i]);
				}
				model_.create({req: req, res: res, data: data}, sendResponseSaved);

			},
			error: function(form){
				response.form = form.toHTML();
				sendResponse(req, res);
			},
			empty: function(form){
				response.form = form.toHTML();
				sendResponse(req, res);
			}
		});
	} else {
		sendResponse(req, res);
	}
}



exports.course_form = course_form;
exports.student_form = student_form;
exports.sendForm = sendForm;



