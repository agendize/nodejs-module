var logger = require('../logger');
var errors = require('../errors');

var httpsClient = require('../network');

this.createButton= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeChatAPI - createButton() started")

	if(!options.hasOwnProperty('button')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing button ")
		callback(new errors.BadRequest('chat button creation error missing entry parameter : button'))
		return;
	}

	var data = options.button;

	if(!data.hasOwnProperty('name')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing button name")
		callback(new errors.BadRequest('chat button creation error missing entry parameter : button.name'))
		return;
	}

	httpsClient.doAgendizeRequest('POST','/api/2.0/chat/buttons',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeChatAPI - createButton() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}
