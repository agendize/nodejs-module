module.exports.scheduling = require('./scheduling.js');
module.exports.reseller = require('./reseller.js');
module.exports.oauth2 = require('./oauth2.js');
module.exports.account = require('./account.js');
module.exports.chat = require('./chat.js');
module.exports.call_tracking = require('./call_tracking.js');

var logger = require('../logger');
var crypto = require('crypto');

module.exports.createSSO = function(ssoToken,email,hostname){

	logger.log(logger.LEVEL_DEBUG,"Agendize module creates a sso for email "+email+" and sso token "+ssoToken)

	var ts = new Date().getTime();
	var secret = ssoToken;
	var message = email+''+ts+''+600000;
	const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');

	var host = hostname

	if(!host){
		if(process.env.AGZ_API_HOST == 'api.agendize.com')
			host = 'app.agendize.com';
		else
			host = process.env.AGZ_API_HOST
	}


	return "https://"+host+"/sso/1.0/sso?email="+encodeURIComponent(email)+"&ts="+ts+"&mac="+hash

}
