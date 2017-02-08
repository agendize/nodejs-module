process.env.AGENDIZE_MODULE_DEBUG_LEVEL = 2;
process.env.AGZ_API_HOST = "api.agendize.com"

var agendize = require('../../');

var serviceAgendize = new agendize({
	var client_id = 'qwertyuiopxxxxxxxxxxxxxqwertyu';
	var client_secret = 'asdfghjklxxxxxxxxxxxxxasdfghj';
	var callback_url = "https://your-application-callback-url.com"
})

//1: redirect the user, or go to the the serviceAgendize.oauth2_redirect_url

//2: a code will be sent in GET param to the callback url you enetered

//3: Get a refresh token with the tokenRequest
agendizeServicesOAuth2.tokenRequest(
{
	code:"abcd1234efgh4567",
},function(error,tokens){
	if(error)
		console.log("Agendize module resulted an error:"+error)
	else
		console.log("Agendize module sent the tokens, you should store the refresh token");
});

//4 Use the token to do some requests
var refreshToken = 'abe5e94608xxxxxxxxxxxxx4332648c';

agendizeServicesOAuth2.tokenRequest(
{
	refresh_token:refreshToken,
},function(error,tokens){
	if(error){
		next(error)
		return;
	}

	agendizeServicesOAuth2.getClients(tokens.access_token,function(error,clients){
		if(error){
			console.log("Agendize module answered an error:"+error)
		}
		else{
			console.log("Agendize answered the clients into this account: "clients);
		}
	
	});

})