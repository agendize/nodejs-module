var logger = require('../logger');
var errors = require('../errors');
var httpsClient = require('../network');

this.tokenRequest = function(data,callback){
	
	logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - getTokenFromAgendize() started")
	
	httpsClient.doPostRequestFormDataType(data,'app.agendize.com','/o/oauth2/token',function(error,result){
		if(error)
			callback(error)
		else{
			var tokens = JSON.parse(result);
			callback(null,tokens);
		}
	});
}


module.exports = this;