/*
 * Module dependencies
 */

const fbId = '524565790919472'
const fbSecret = '61b7d72113f231cc458a1078be514466'

var express = require('express')
  , orm = require('orm')
  , stylus = require('stylus')
  , nib = require('nib')  
  , auth = require('connect-auth')
  , FB = require('fb')
  , courseFrontend = require('./controllers/frontend/course')
  , studentFrontend = require('./controllers/frontend/student')
  , user = require('./entities/eUser')
  , courseApi = require('./controllers/api/course')
  , studentApi = require('./controllers/api/student')
  , userApi = require('./controllers/api/user')
  , forms = require('./entities/forms')
  , request = require('request')
  , querystring = require('querystring')

var app = express()



function compile(str, path) {
  return stylus(str)  	
    .set('filename', path)
    .set('watch', true)
    .use(nib())
}

function requiresLogin(req, res, next){
	if(req.session.user){
		next();
	} else {
		console.log('Session no existe');
		//res.redirect('/session/new?redir=' + req.url);
		res.redirect('/');
	}
}



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(orm.express("mysql://root:root@localhost/pupil", {
	define: function (db, models) {
		db.settings.set("properties.primary_key", "id");
		db.load('./entities/models', function(err){
			if(err){
				//return cb(err);
				console.log(err)
				return err;
			}

		});
/*		
		for(var key in db.models){
			var object = db.models[key];
			console.log('Dropping ' + key);
			object.drop(function(err){
				if(err){
					console.log(!err ? 'Error droping ' + key : err + ' ' + key );
				}
				
			});
		}
*/
		db.sync(function(err){
			if(err){
				console.log(!err ? 'Error syncing models' : err);
			}
			!err && console.log('Models synced');
		});

	}
}));
app.use(express.cookieParser());
app.use(express.session({secret: '|@#¢∞¬÷“¬∞¢'}));
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public',
  	compile: compile
  }));
app.use(function(req, res, next){
	res.locals.session = req.session;
	next();
});
app.use(function(req, res, next){
	if(req.xhr){
		res.locals.isAjax = true;
	} else {
		res.locals.isAjax = false;
	}
	next();
});

app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.locals.pretty = true;

app.listen(3000)



app.get('/', function (req, res) {
	res.render('home', {title: 'Home'});
});


app.get('/home', requiresLogin, function (req, res) {
	res.render('protected', {title: 'Home'});
});


/* API CALSS */

//Students
app.get('/api/student/:id', studentApi.get);
app.get('/api/student', studentApi.find);
app.post('/api/student', studentApi.add);
app.put('/api/student/:id', studentApi.update);
app.delete('/api/student/:id', studentApi.delete);

//Courses
app.get('/api/course/:id', courseApi.get);
app.get('/api/course', courseApi.find);
app.post('/api/course', courseApi.add);
app.put('/api/course/:id', courseApi.update);
app.delete('/api/course/:id', courseApi.delete);
//app.post('/course/:id/student/:id', course.addStudent);

//USer
app.get('/api/user/:id/course', userApi.course);


function process_form(req, res, instance, callback){
	var form = eval('forms.' + instance + '_form');	
	var template = eval('forms/form-' + instance);
	var title = 'Add new student';

	if(req.route.method == 'post'){
		form.handle(req, {
			success: callback,
			error: function(form){
				res.render(template, {
					'title': title,
					'form': form.toHTML()
				});
			},
			empty: function(form){
				res.render(template, {
					'title': title,
					'form': form.toHTML()
				});
			}
		});
	} else {
		res.render(template, {
			'title': title,
			'form': form.toHTML()
		});
	}

}


app.all('/student/new', function(req, res){
	if(req.route.method == 'post'){
		forms.student_form.handle(req, {
			success: function(form){
				var data = {
					first_name: form.data.first_name,
					last_name: form.data.last_name,
					second_last_name: form.data.second_last_name,
					email: form.data.email
				};
				request.post('http://pupil.cl:3000/api/student', {					
					qs: data
				}, function(err, response, body){					
					if(!err && response.statusCode == 200){
						console.log(body);
						
						if(req.xhr){
							res.render('form-done', {})
						}
					} else {
						console.log(err);
						res.send(err + ' ' + response.statusCode);
					}
				});				
			},
			error: function(form){
				res.render('forms/form-student', {
					'title': 'Add Student',
					'form': form.toHTML()
				});
			},
			empty: function(form){
				res.render('forms/form-student', {
					'title': 'Add Student',
					'form': form.toHTML()
				});
			}
		});

	} else {
		console.log('responding');
		res.render('forms/form-student', {
			'title': 'Add new student',
			'form': forms.student_form.toHTML(),			
		});
	}
});

app.all('/course/new', function(req, res){
	process_form(req, res, 'course', function(form){
		var data = {
			name: form.data.name,
			description: form.data.description,
			initials: form.data.initials
		}

		request.post('http://pupil.cl:3000/api/course', {qs: data}, function(err, response, body){
			if(!err && response.statusCode == 200){
				console.log(body);

				if(req.xhr){

				} else {

				}
			}
		});
	});
});



app.get('/user/faebook/create_user', user.register_facebook);

app.get('/courses', requiresLogin, courseFrontend.courses);
app.get('/course/:id', requiresLogin, courseFrontend.course);
//app.get('/course/:id/edit', requiresLogin, course.edit);


app.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('/');	
});








