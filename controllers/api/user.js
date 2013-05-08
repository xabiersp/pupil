var orm = require('orm')
  , model_name = 'user'
  , crypto = require('crypto')
  , request = require('request')


exports.create = function(req, res){
	var User = req.db.models.user;

	if(!req.query.oauth_active){
		if(req.query.password && req.query.password != ''){
			var md5 = crypto.createHash('md5');
			md5.update(req.query.password, 'utf8');
			req.query.password = md5.digest('utf8');

			console.log('Password: ' + req.query.password);
		} else {
			console.log('marcar error');
		}
	}

	User.find({email: req.query.email}, function(err, items){
		if(!err){
			if(items.length == 0){
				console.log(req.query);
				User.create([{
					first_name: req.query.first_name,
					last_name: req.query.last_name,
					email: req.query.email,
					oauth_active: req.query.oauth_active,
					oauth_provider: req.query.oauth_provider,
					oauth_id: req.query.oauth_id,
					gender: req.query.gender,
					birthday: req.query.birthday
				}], function(err, items){
					if(!err){
						return res.json(items[0]);
					} else {
						return res.json(500);
					}
					
				});
			} else {
				return res.json(items[0]);
			}
		} else {
			res.json(400, {error: err});
			console.log(err);
		}
	});
}

exports.facebook = function(req, res){
	if(req.query.access_token){
		FB.setAccessToken(req.query.access_token);
		FB.api('/me', function(response){
			if(res && !res.error){
				var data = {
					first_name: response.first_name,
					last_name: response.last_name,
					email: response.email,
					birthday: response.birthday,
					gender: response.gender,
					oauth_provider: 'fb',
					oauth_active: true,
					oauth_id: response.id
				}
				request({
					url: 'http://pupil.cl:3000/api/user',
					method: 'post',
					qs: data,
					json: true
				}, function(err, response, body){
					console.log(response.statusCode);
					if(!err){
						res.json(body);
					} else {
						console.log(err);
						res.json(500, {error: err});
					}
				});
			} else {
				console.log(res.error);
				res.json(500, {error: res.error});
			}
		});
	} else {
		res.json(500, {error: 'Not fb token'});
		console.log('Not fb token');
	}
}

exports.login = function(req, res){
	var User = req.db.models.user;
	if(req.query.email && req.query.pass){
		User.find({email: req.query.email}, function(err, items){
			if(!err){
				if(items[0].oauth_active){
					if(items[0].oauth_id == req.query.pass){
						internal_login(items[0], req);
						res.json({msg: 'ok'});
					} else {
						res.json(400, {error: 'Email and User OAuth ID does not match'});
					}

				} else {
					var md5 = crypto.createHash('md5');
					md5.update(req.query.pass, 'utf8');
					req.query.pass = md5.digest('utf8');

					if(items[0].password == req.query.pass){
						internal_login(items[0], req);
					} else {
						res.json(400, {error: 'Email or Password wrong'});
					}
				}
			} else {
				console.log(err);
				res.json(500, {error: 'Something goes wrong with this user'});
			}
		});
	} else {
		res.json(500, {error: 'No user or password'});
	}
}

exports.logout = function(req, res){
	req.session.user = null;
	res.json({msg: 'OK'});
}

function internal_login(user, req){
	var user = {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		name: user.first_name + ' ' + user.last_name,
		email: user.email
	}
	req.session.user = user;
}


exports.get = function(req, res){
	var model = req.db.models[model_name];
	var id = req.params.id;

	console.log('Retrieving course: ' + id);

	return model.get(id, function(err, item){
		if(!err) {
			item.getStudents(function(err, students){
				if(!err){
					item.students = students;
					return res.send(item);
				} else {
					console.log(err);
				}				
			});			
		} else {
			return res.send(console.log(err));
		}		
	});
}

exports.find = function(req, res) {
	var model = req.db.models[model_name];

	var keys = Object.keys(req.query);
	var query = {};
	console.log(req.query);
	for(i in keys){
		eval('query.' + keys[i] + ' = req.query.' + keys[i]);
	}
	
	console.log(query);	
	return model.find(query, 10, function(err, items){
		if(!err){
			return res.send(items);
		} else {
			return console.log(err);
		}
	});
}

exports.add = function(req, res) {
	var model = req.db.models[model_name];

	console.log("POST: ");
	console.log(req.query);

	if(req.query.email == ''){
		req.query.email = null;
	}

	model.create([{
		first_name: req.query.first_name,
		last_name: req.query.last_name,
		second_last_name: req.query.second_last_name,
		email: req.query.email
	}], function(err, items) {
		if(!err){
			console.log('created');
			res.send(items);
		} else {
			console.log(err);
			res.send(400);
		}
	});
}

exports.update = function(req, res) {
	var model = req.db.models[model_name];

	return models.get(req.params.id, function(err, item) {
		item.first_name = req.body.first_name;
		item.last_name = req.body.last_name;
		item.second_last_name = req.body.second_last_name;
		item.email = req.body.email;
		item.courses = req.body.courses;

		return item.save(function(err){
			if(!err){
				console.log("update" + item.id);
			} else {
				console.log(err);
			}

			return res.send(item);			
		});
	});
}

exports.delete = function(req, res) {
	var model = req.db.models[model_name];

	return model.get(req.params.id, function(err, item) {
		item.remove(function(err) {
			if(!err){
				console.log("Removed");
				return res.send('');
			} else {
				console.log(err);
			}

		});
	});
}

exports.course = function(req, res) {
	var model = req.db.models[model_name];

	return model.get(req.params.id, function(err, item){
		if(!err){
			item.getCourses(function(err, courses){
				return res.json(courses);
			});
		} else {
			return res.json(500, 'Something goes wrong');
			console.log(err);
		}
	});
}

exports.add_course = function(req, res) {
	var model = req.db.models[model_name];
	console.log(req.params);
	model.get(req.params.id, function(err, user){
		if(!err){
			var Course = req.db.models.course;
			Course.get(req.params.id_course, function(err, course){
				if(!err){
					user.getCourses(function(err, courses){
						if(!err){
							courses.push(course);
							user.setCourses(courses);
							res.json(user);
						} else {
							res.json(400);
						}
						
					});
					
					
				} else {
					res.json(400, {error: 'Bad course id'});
				}
			});			
		} else {
			res.json(400, {error: 'Bad user id'});
		}
	});

}


