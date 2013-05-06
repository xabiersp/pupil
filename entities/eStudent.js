var orm = require('orm')
  , model_name = 'student';


exports.get = function(req, res){
	var model = req.db.models[model_name];
	var id = req.params.id;

	console.log('Retrieving student: ' + id);

	return model.get(id, function(err, item){
		if(!err) {
			return res.send(item);
		} else {
			return res.send(console.log(err));
		}		
	});
}

exports.findAll = function(req, res){
	var model = req.db.models[model_name];
	
	console.log('Retrieving all students');	

	return model.find({}, function(err, items){
		if(!err){
			return res.send(items);
		} else {
			return console.log(err);
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
