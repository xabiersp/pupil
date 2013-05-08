var utils = require('./utils');
var request = require('request');
var qs = require('querystring');


var api = 'http://pupil.cl:3000/api';

exports.courses = function(req, res){
	request.get({
		url: api + '/user/' + req.session.user.id + '/course',
		json: true
	}, function(err, response, body){
		if(!err && response.statusCode == 200){
			res.render('courses', {'courses': body, 'title': 'Courses'});
		} else if(err){
			console.log(err);
		} else {
			console.log(response.statusCode);
		}
	});
}

exports.course = function(req, res){
	var Course = req.db.models.course;
	request.get({
		url: api + '/course/' + req.params.id,
		json: true 
	}, function(err, response, body){
		if(!err && response.statusCode == 200){
			res.render('course', {'course': body, 'title': 'Course' });
		} else if(err){
			console.log(err);
		} else {
			console.log(response.statusCode);
		}
	});
}

exports.add = function(req, res){
	utils.process_form(req, res, 'course', function(form){
		var data = {
			name: form.data.name,
			description: form.data.description,
			initial: form.data.initial
		}
		request({
			url: 'http://pupil.cl:3000/api/course', 
			qs: data,
			method: 'post',
			json: true }, function(err, response, body){
			if(!err && response.statusCode == 200){
				console.log(body[0]);
				request({
					url: 'http://pupil.cl:3000/api/user/' + req.session.user.id + '/course/' + body[0].id,
					method: 'post',
					json: true
				}, function(err, response, body){
					if(!err && response.statusCode == 200){
						res.redirect(req.path);
					} else  {
						res.send('error');
						console.log(err);
					}
				});
			}
		});
	});
}

exports.edit = function(req, res){
	res.send('editing');
}