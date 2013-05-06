var utils = require('./utils');
var request = require('request');

exports.students = function(req, res){
	
}

exports.add = function(req, res){
	utils.process_form(req, res, 'student', function(form){
		var data = {
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			second_last_name: form.data.second_last_name,
			email: form.data.email
		}
		request.post('http://pupil.cl:3000/api/student', {qs: data}, function(err, response, body){
			if(!err && response.statusCode == 200){
				console.log(body);

				if(req.xhr){

				} else {

				}
			}
		});
	});
}