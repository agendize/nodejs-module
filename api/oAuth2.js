var logger = require('../logger');
var errors = require('../errors');
var httpsClient = require('../network');

this.tokenRequest = function(data,callback){
	
	logger.info("AgendizeAPI - getTokenFromAgendize() started")
	
	httpsClient.doPostRequestFormDataType(data,'app.agendize.com','/o/oauth2/token',function(error,result){
		if(error)
			callback(error)
		else{
			// try {
				var tokens = JSON.parse(result);
				callback(null,tokens);
			// } catch(e) {
			// 	callback(new errors.AgendizeAPI("Error e:"+e+"Problem when trying to get oauth2 tokens, when doing post request response was not json formated. Response was: "+result))
			// }
		}
	});
}



module.exports = this;