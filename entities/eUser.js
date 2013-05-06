orm = require('orm');
FB = require('fb');

create_user = function(req, res, params, callback){
	var User = req.db.models.user;
	var err;

	if(!req || !res){
		err = 'request and response objects are required';
		callback(err);
	} else {
		if(params.oauth_active == true){
			if(!exists_user(req, res, {oauth_id: params.oauth_id, oauth_provider: params.oauth_provider})){
				User.create([{				
					first_name: params.first_name,
					last_name: params.last_name,
					birthday: params.birthday,
					gender: params.gender,
					email: params.email,
					oauth_provider: params.oauth_provider,
					oauth_id: params.oauth_id,
					oauth_active: true
				}], function(err, items){
					if(err){
						console.log(!err ? 'Error ocurred while creating User FB' : err);
					}
					//Llamo callback y devuelvo 
					callback(err, items[0]);
				});
			}
		} else {
			User.create([{
				first_name: params.first_name,
				last_name: params.last_name,
				birthday: params.birthday,
				gender: params.gender,
				email: params.email,			
				password: params.password,
				oauth_active: false
			}], function(err, items){
				if(err){
					console.log(!err ? 'Error ocurred while creating User' : err);
				}
			});
		}
		
	}
}

exists_user = function(req, res, args){
	var User = req.db.models.user;
	var exists = false;

	if(args.oauth_id != 'undefined'){
		User.count({oauth_provider: args.oauth_provider, oauth_id: args.oauth_id}, function(err, count){
			if(err){
				console.log(!err ? 'Error ocurred' : err);
			} else {
				if(count > 0){
					exists = true;
				}
			}
		});
	} else if(args.email != 'undefined') {
		User.count({email: args.email}, function(err, count){
			if(err){
				console.log(!err ? 'Error ocurred counting users by email' : err);
			} else {
				if(count > 0){
					exists = true;
				}
			}
		});
	} else {
		console.log('No parameters');
	}
	return exists;
}

register_facebook = function(req, res){
	if(req.query.access_token){
		FB.setAccessToken(req.query.access_token);
		FB.api('/me', function(response){
			if(!response || response.error){
				console.log(!response ? 'Error ocurred' : response.error);
				res.redirect('/');
			} else {
				create_user(req, res, {
					first_name: response.first_name,
					last_name: response.last_name,
					birthday: response.birthday,
					gender: response.gender,
					oauth_provider: 'fb',
					oauth_active: true,
					oauth_id: response.id,
					email: response.email
				}, function(err, user){
					if(!err){
						user_login('fb', req, res, 
							{ user: user.oauth_id },							
							function(err){
								if(!err){
									res.redirect('/courses');
								} else {
									console.log(err);
									res.redirect('/')								
								}
							});
					}else{
						console.log(err);
						res.redirect('/');
					}
				});
			}
		});
	} else {
		console.log('Request without access token');
		res.redirect('/');
	}
}


user_login = function (type, req, res, args, callback){
	var User = req.db.models.user;
	var user = {
		name: '',
		email: '',
		id: ''
	};
	switch(type){
		case 'fb':
			console.log(args);
			User.find({oauth_id: args.user, oauth_provider: type}, function(err, users){
				if(err){
					console.log(!err ? 'Error ocurred' : err);
				} else {
					if(users.length > 0){						
						user.name = users[0].first_name + ' ' + users[0].last_name;
						user.email = users[0].email
						user.id = users[0].id
						req.session.user = user;

						console.log('graba session ' + req.session.user.id);

						callback(err);
					} else {
						console.log('El usuario no existe');
						callback('Usuario no existe');
					}
				}				
			});
			break;
		case 'basic':
			User.find({user: args.user, pass: args.pass, oauth_active: false}, function(err, users){
				if(users.length >0){
					console.log('El usuario existe');
					req.session.user_id = user[0];
				} else {
					console.log('El no usuario existe');
					res.send('Este usuario no existe');
				}
			});
			break;
	}	
}

exports.register_facebook = register_facebook