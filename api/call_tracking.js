var logger = require('../logger');
var errors = require('../errors');

var httpsClient = require('../network');

this.get = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"AgendizeCallTrackingAPI - get() started ")

	httpsClient.doAgendizeRequest('GET','/api/2.0/calls/calltrackings',{},credentials,function(err,result){

		logger.log(logger.LEVEL_DEBUG,"AgendizeCallTrackingAPI - get() finished")

		if(err){
			callback(err)
		}
		else{
			callback(null,result.items)
		}

	});
}

this.delete = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"AgendizeCallTrackingAPI - delete() started ")

	let lineId = options.line_id;

	httpsClient.doAgendizeRequest('DELETE','/api/2.0/calls/calltrackings/'+lineId,{},credentials,function(err,result){

		logger.log(logger.LEVEL_DEBUG,"AgendizeCallTrackingAPI - delete() finished")

		if(err){
			callback(err)
		}
		else{
			callback(null,result)
		}

	});
}

