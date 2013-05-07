$(document).ready(function(){
	$('#fb-login-btn').bind('click', function(e){
			e.preventDefault();					
			login();
		});
});
window.fbAsyncInit = function(){
	FB.init({
		appId: '524565790919472',
		status: true,
		cookie: true,
		xfbml: true					
	});
};

(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

function loginStatus(){
	FB.getLoginStatus(function(response){
		if(response.status == 'connected'){
			alert('connected');
		}else if(response.status === 'not_authorized'){
			alert('not authorized');
			//login();
		}else{
			alert('not logged in');
			//login();
		}
	}, true);
}

function login(){
	FB.login(function(response){
		if(response.authResponse){
			var access_token = FB.getAuthResponse()['accessToken'];
			console.log(access_token);
			$.ajax({
				url: 'http://pupil.cl:3000/api/user/facebook?access_token=' + access_token,
				type: 'post',							
				error: function(e1,e2,e3){ 
					$.easyNotification({text: 'Error creating user', error: true});
					console.log('error llamando a api' +e1 + ' ' + e2 + ' ' +e3) 
				},
				success: function(data, status, jqXHR){
					if(data.oauth_id){
						$.ajax({
							url: 'http://pupil.cl:3000/api/user/login?email=' + data.email + '&pass=' + data.oauth_id,
							type: 'POST',
							error: function(e1,e2,e3){ 
								$.easyNotification({
									text: 'Error login user', 
									error: true,
									autoClose: true});
								console.log('Error login user: ' +e1 + ' ' + e2 + ' ' +e3); 
							},
							success: function(data, status, jqXHR){
								window.location = '/courses';
							}
						});

					}								
				}
			});
		}else{
			alert('error');
			console.log(response);
		}
	},{scope: 'email,user_birthday, user_education_history' });
}	