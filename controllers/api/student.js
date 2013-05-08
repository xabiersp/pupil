var orm = require('orm')
  , model_name = 'student'
  , u = require('./utils')


exports.get = function(req, res){
	var model = req.db.models[model_name];
	var id = req.params.id;

	console.log('Retrieving student: ' + id);

	return model.get(id, function(err, item){
		if(!err) {
			return res.json(u.api_res({ data: item }));
		} else {
			return res.json(u.api_res({ status: error, msg: err }));
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
	
	return model.find(query, 10, function(err, items){
		if(!err){
			return res.json(u.api_res({data: items}));
		} else {
			return res.json(u.api_res({ status: error, msg: err }));
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
			return res.json(u.api_res({data: items}));
		} else {
			return res.json(u.api_res({ status: error, msg: err }));
			console.log(err);
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
				return res.json(u.api_res({data: item}));
			} else {
				console.log(err);
				return res.json(u.api_res({ status: error, msg: err }));
			}
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
