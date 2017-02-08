var logger = require('../logger');
var errors = require('../errors');
// var thirdPartyServices = require('../global/thirdPartyServices.js');
var httpsClient = require('../network');

const AGZ_API_HOST = process.env.AGZ_API_HOST;
// const AGZ_API_HOST = 'az2.agendize.com'
const AGZ_ROLE_SCHEDULER = "scheduler"


	function doAgendizeRequest(method,path,data,credentials,callback,acceptBadCode){

		if(!credentials || !credentials.hasOwnProperty('apiKey') || !credentials.hasOwnProperty('token')){
			throw new errors.BadRequest('Reseller API requests need api key and token');
		}

		httpsClient.doRequest(data,AGZ_API_HOST,path,method,credentials,callback,acceptBadCode)

	}

	this.changePlan = function(options,credentials,callback){
		var accountId = options.account_id;
		var destinationPlan = options.destination_plan;

		logger.log(logger.LEVEL_INFO,"agendizeAPI - changePlan for STARTING with account "+accountId+" and desination plan "+JSON.stringify(destinationPlan))

		var data = {
			profile:{
				nativePlan:true,
				id:destinationPlan
			}
		};

		doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
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

		logger.log(logger.LEVEL_INFO,"agendizeAPI - desactiveAccount for STARTING with account "+accountId)

		var data = {
			status:"disabled"
		};

		doAgendizeRequest('POST','/api/2.0/resellers/accounts/'+accountId,data,credentials,function(err,result){
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

		logger.log(logger.LEVEL_INFO,"agendizeAPI - createAccount for STARTING")

		var account = options.account;
		var paymentProfile = options.paymentProfile;

		var data = {
			lastName:account.lastname,
			firstName:account.firstname,
			email:account.email,
			password:account.password,
			profile:paymentProfile
		};

		doAgendizeRequest('POST','/api/2.0/resellers/accounts',data,credentials,function(err,result){
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

		logger.log(logger.LEVEL_INFO,"AgendizeAPI - checkIfAccountExist() STARTING")

		var email = encodeURIComponent(options.email);

		doAgendizeRequest('GET','/api/2.0/resellers/accounts',{userName:email},credentials,function(err,result){
		
		logger.log(logger.LEVEL_INFO,"AgendizeAPI - checkIfAccountExist() finished")

		//This error is now checked to see if it's a real error or if the account does not exists or exist but attached to another reseller account
		if(err){
			logger.warn("checkIfAccountExist")
			if(err.code == 404){
				callback(null,{exists:false})
			}
			else if(err.code == 403){
				callback(null,{exists:true})
			}
			else{
				logger.warn("Error returned by AGZ API and assimilate as real error when checkIfAccountExist")
				callback(err)
			}
		}
		else{
			callback(null,{exists:true})
		}


	},true)

}



module.exports = this;


