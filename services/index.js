module.exports.scheduling = require('./scheduling.js');
module.exports.reseller = require('./reseller.js');
module.exports.oauth2 = require('./oauth2.js');
module.exports.account = require('./account.js');

var logger = require('../logger');
var crypto = require('crypto');

module.exports.createSSO = function(ssoToken,email){

	logger.log(logger.LEVEL_DEBUG,"Agendize module creates a sso for email "+email+" and sso token "+ssoToken)

	var ts = new Date().getTime();
	var secret = ssoToken;
	var message = email+''+ts+''+600000;
	const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');

	if(process.env.AGZ_API_HOST == 'az2.agendize.com')
		return "https://az2.agendize.com/sso/1.0/sso?email="+encodeURIComponent(email)+"&ts="+ts+"&mac="+hash
	else
		return "https://app.agendize.com/sso/1.0/sso?email="+encodeURIComponent(email)+"&ts="+ts+"&mac="+hash

}
