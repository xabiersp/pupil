var utils = require('./utils')
  , request = require('request')

exports.add = function(req, res){
	utils.process_form(req, res, 'user', function(form){
		var data = {
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			birthday: form.data.birthday,
			gender: form.data.gender,
			email: form.data.email,
			password: form.data.confirm
		}
		console.log(data);
		request({
			url: 'http://pupil.cl:3000/api/user',
			method: 'post',
			qs: data,
			json: true
		}, function(err, response, body){
			if(!err && response.statusCode == 200){
				res.render('register_thankyou');
				console.log(body);
			} else if(!err) {
				console.log(response.statusCode);
			} else {
				console.log(err);
			}
		});
		
	});	
}