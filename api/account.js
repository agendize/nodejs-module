var logger = require('../logger');
var errors = require('../errors');

var httpsClient = require('../network');

this.deleteWebhook= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeAccountAPI - deleteWebook() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('webhook_id')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing watcherId resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : watcherId'))
		return;
	}

	httpsClient.doAgendizeRequest('DELETE','/api/2.0/watchers/'+options.webhook_id,null,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeAccountAPI - deleteWebook() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}

this.createWebhookForCalls=function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"accountAPI - createWebhookForCalls() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('webhook')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook'))
		return;
	}

	var webhook = options.webhook;

	if(!webhook.hasOwnProperty('address')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook address")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook.address'))
		return;
	}

	var data = webhook;

	httpsClient.doAgendizeRequest('POST','/api/2.0/calls/watch',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"agendizeAccountAPI - createWebhookForCalls() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}


this.createWebhookForForms=function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"accountAPI - createWebhookForForms() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('webhook')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook'))
		return;
	}

	var webhook = options.webhook;

	if(!webhook.hasOwnProperty('address')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook address")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook.address'))
		return;
	}

	var data = webhook;

	httpsClient.doAgendizeRequest('POST','/api/2.0/forms/0/results/watch',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"agendizeAccountAPI - createWebhookForForms() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}

this.createWebhookForChat=function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"accountAPI - createWebhookForForms() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('webhook')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook'))
		return;
	}

	var webhook = options.webhook;

	if(!webhook.hasOwnProperty('address')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook address")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook.address'))
		return;
	}

	var data = webhook;

	httpsClient.doAgendizeRequest('POST','/api/2.0/chat/sessions/watch',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"agendizeAccountAPI - createWebhookForForms() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}
module.exports = this;