var orm = require('orm');

module.exports = function(db, cb){
	var User = db.define('user', {
		//properties
		first_name:	String,
		last_name: String,
		birthday: String,
		gender: String,
		photo: String,
		oauth_provider: String,
		oauth_active: Boolean,
		oauth_id: String,
		password: String,
		email: String
	},{
		methods: {
			fullName: function(){
				return this.name + ' ' + this.last_name;
			}
		},
		validations: {
			email: orm.validators.patterns.email(),
			email: orm.validators.notEmptyString(),
			first_name: orm.validators.notEmptyString(),
			last_name: orm.validators.notEmptyString()
		}
	});
	
	var Course = db.define('course', {
		//properties
		name: String,
		initial: String,
		description: String,
		country: String,
		marks_average: String,
		start_date: Date,
		end_date: Date,
	},{
		methods: {
		},
		validations: {
			name: orm.validators.notEmptyString()
		}
	});	

	var Student = db.define('student', {
		//properties
		first_name: String,
		last_name: String,
		second_last_name: String,
		email: { type: 'text', size:'255', required: false, defaultValue: null}
	},{
		methods: {
		},
		validations: {
			first_name: orm.validators.notEmptyString(),
			last_name: orm.validators.notEmptyString(),
			email: orm.validators.patterns.email()
		}
	});


	//Relationships
	User.hasMany("courses", Course, {
		rol: String
	});
	Student.hasOne("user", User, {required: false});
	Course.hasMany("students", Student);


	/*
	ConcurrenceDate.hasMany('dates', CourseDate);
	Course.hasMany('students', Student, {reverse: 'courses'});
	Course.hasMany('dates', ConcurrenceDate, { required: false });	
	*/



	

	return cb();
};
