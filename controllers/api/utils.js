exports.api_res = function(options){
	var res = {
		status: '',
		to: '',
		data: [],
		message: ''
	}
	res.status = typeof options.status !== 'undefined' ? options.status : 'ok';
	res.data = typeof options.data !== 'undefined' ? options.data : [];
	res.message = typeof options.data !== 'undefined' ? options.message : res.message;
/*
	if(Object.prototype.toString.call(res.data) !== '[object Array]'){
		res.data = [res.data];
	}
*/
	if(options.status == 'error'){
		res.status = 'error';
	} else if(options.status == 'redirect') {
		res.status = 'redirect';
		res.to = options.to;
	} else {
		res.status = 'ok';
	}
	return res;
}