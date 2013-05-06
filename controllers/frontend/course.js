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

exports.edit = function(req, res){
	res.send('editing');
}