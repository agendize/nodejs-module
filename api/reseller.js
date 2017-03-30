var logger = require('../logger');
var errors = require('../errors');
var httpsClient = require('../network');
const AGZ_API_HOST = process.env.AGZ_API_HOST;
const AGZ_ROLE_SCHEDULER = "scheduler"

this.getAccounts = function(credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - getAccounts STARTING")

	httpsClient.doAgendizeRequest('GET','/api/2.0/resellers/accounts',null,credentials,function(err,result){
		if(err)
			callback(err)
		else
			callback(null,result.items)
	});
}

this.removeAccount = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - removeAccount STARTING")
	if(!options.hasOwnProperty('id')){
		callback(new errors.BadRequest('Missing account ID to delete it'));
		return
	}
	httpsClient.doAgendizeRequest('DELETE','/api/2.0/resellers/accounts/'+options.id,null,credentials,function(err,result){
		if(err)
			callback(err)
		else
			callback(null,result)
	});
}



this.changePlan = function(options,credentials,callback){
	var accountId = options.account_id;
	var destinationPlan = options.destination_plan;

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - changePlan for STARTING with account "+accountId+" and desination plan "+JSON.stringify(destinationPlan))

	var data = {
		profile:{
			nativePlan:true,
			id:destinationPlan
		}
	};

	httpsClient.doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			if(!result.hasOwnProperty('ssoToken'))
				callback(new errors.AgendizeAPI('Agendize api returned an account without ssoToken'))
			else
				callback(null,result)
		}
	});
}



this.updateAccount = function(options,credentials,callback){
	
	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - updateAccount for STARTING");

	if(!options.hasOwnProperty('account_id')){
		callback(new errors.BadRequest('Missing account ID to update it'));
		return
	}

	if(!options.hasOwnProperty('account')){
		callback(new errors.BadRequest('Missing account resource to update it'));
		return
	}

	var accountId = options.account_id;

	var account = options.account;

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - updateAccount for STARTING with account "+accountId+" and desination account "+JSON.stringify(account))

	var data = account

	httpsClient.doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			if(!result.hasOwnProperty('ssoToken'))
				callback(new errors.AgendizeAPI('Agendize api returned an account without ssoToken'))
			else
				callback(null,result)
		}
	});
}


this.desactiveAccount = function(options,credentials,callback){

	var accountId = options.account_id;

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - desactiveAccount for STARTING with account "+accountId)

	var data = {
		status:"disabled"
	};

	httpsClient.doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			if(!result.hasOwnProperty('ssoToken'))
				callback(new errors.AgendizeAPI('Agendize api returned an account without ssoToken'))
			else
				callback(null,result)
		}
	});
}



this.activeAccount = function(options,credentials,callback){

	var accountId = options.account_id;

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - activeAccount for STARTING with account "+accountId)

	var data = {
		status:"enabled"
	};

	httpsClient.doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			if(!result.hasOwnProperty('ssoToken'))
				callback(new errors.AgendizeAPI('Agendize api returned an account without ssoToken'))
			else
				callback(null,result)
		}
	});
}

this.createAccount = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"agendizeAPI - createAccount for STARTING")

	var account = options.account;

	var paymentProfile = options.payment_profile;

	var data = {
		lastName:account.lastname,
		firstName:account.firstname,
		email:account.email,
		password:account.password,
		preferences:account.preferences,
		profile:paymentProfile,
		tools:account.tools
	};

	httpsClient.doAgendizeRequest('POST','/api/2.0/resellers/accounts',data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			if(!result || !result.hasOwnProperty('ssoToken'))
				callback(new errors.AgendizeAPI('Agendize api returned an account without ssoToken'))
			else
				callback(null,result)
		}
	});
}



this.checkIfAccountExist = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - checkIfAccountExist() STARTING")

	var email = encodeURIComponent(options.email);

	httpsClient.doAgendizeRequest('GET','/api/2.0/resellers/accounts',{userName:email},credentials,function(err,result){
	
		logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - checkIfAccountExist() finished")

		//This error is now checked to see if it's a real error or if the account does not exists or exist but attached to another reseller account
		if(err){
			if(err.code == 404){
				logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - checkIfAccountExist() finished and answered false")
				callback(null,{exists:false})
			}
			else if(err.code == 403){
				logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - checkIfAccountExist() finished and answered true")
				callback(null,{exists:true})
			}
			else{
				logger.log(logger.LEVEL_ERROR,"Error returned by AGZ API and assimilate as real error when checkIfAccountExist")
				callback(err)
			}
		}
		else{
			logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - checkIfAccountExist() finished and answered true")
			callback(null,{exists:true})
		}
	},true)

}



module.exports = this;


