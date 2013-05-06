var utils = require('./utils');

exports.add = function(req, res){
	process_form(req, res, 'user', function(form){
		var data = {
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			email: form.data.email,
			password: form.data.confirm
		}
		request({
			url: 'http://pupil.cl:3000/api/user',
			qs: data,
			json: true
		}, function(err, response, body){
			if(!err && response.statusCode == 200){

			} else if(!err) {
				console.log(response.statusCode);
			} else {
				console.log(err);
			}
		});
		
	});	
}