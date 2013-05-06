var orm = require('orm')
  , model_name = 'user'
  , crypto = require('crypto')


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
			if(!items){
				User.create([req.query], function(err, items){

				});
			} else {
				return res.send(items[0]);
			}
		} else {
			console.log(err);
		}
	});
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
				return res.send(courses);
			});
		} else {
			console.log(err);
		}
	});
}
