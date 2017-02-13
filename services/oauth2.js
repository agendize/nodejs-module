var oauth2API = require('../api').oauth2;
var logger = require('../logger');

module.exports.getRedirectURLFromClientIdAndCallbackURL = function(client_id,callback_url){
	return "https://app.agendize.com/o/oauth2/authorize?scope=agendize&client_id="+client_id+"&redirect_uri="+callback_url
}

module.exports.tokenRequest = oauth2API.tokenRequest;
