var pjson = require('./package.json');
console.log("Agendize-module version "+pjson.version)

var logger = require('./logger');
var services = require('./services');
var errors = require('./errors');

// Functions available for reseller accounts
var availableFunctions = {
	'createStaff':{
		agendizeService:'scheduling',
		agendizeFunction:'createStaff',
		requiredParams:['staff','company_id']
	},
	'createResource':{
		agendizeService:'scheduling',
		agendizeFunction:'createResource',
		requiredParams:['resource','company_id']
	},
	'createButton':{
		agendizeService:'scheduling',
		agendizeFunction:'createButton',
		requiredParams:['button','company_id']
	},
	'createService':{
		agendizeService:'scheduling',
		agendizeFunction:'createService',
		requiredParams:['service','company_id']
	},
	'createServices':{
		agendizeService:'scheduling',
		agendizeFunction:'createServices',
		requiredParams:['services','company_id']
	},
	'getAccounts':{
		agendizeService:'reseller',
		agendizeFunction:'getAccounts',
	},
	'createAccount':{
		agendizeService:'reseller',
		agendizeFunction:'createAccount',
		requiredParams:['account','payment_profile']
	},
	'removeAccount':{
		agendizeService:'reseller',
		agendizeFunction:'removeAccount',
		requiredParams:['id']
	},
	'checkIfAccountExist':{
		agendizeFunction:'checkIfAccountExist',
		agendizeService:'reseller',
		requiredParams:['email']
	},'activeAccount':{
		agendizeFunction:'activeAccount',
		agendizeService:'reseller',
		requiredParams:['account_id']
	},
	'desactiveAccount':{
		agendizeFunction:'desactiveAccount',
		agendizeService:'reseller',
		requiredParams:['account_id']
	},
	'changePlan':{
		agendizeFunction:'changePlan',
		agendizeService:'reseller',
		requiredParams:['account_id','destination_plan']
	},
	'call':{
		agendizeFunction:'call',
		agendizeService:'scheduling',
		requiredParams:['button_id','number']
	},
	'getCompanies':{
		agendizeFunction:'getCompanies',
		agendizeService:'scheduling'
	},
	'createAppointment':{
		agendizeService:'scheduling',
		agendizeFunction:'createAppointment',
		requiredParams:['company_id','staff_id','client_id','service_id','date']
	},
	'createCompany':{
		agendizeService:'scheduling',
		agendizeFunction:'createCompany',
		requiredParams:['company']
	},
	'createAppointmentWithAppointment':{
		agendizeFunction:'createAppointment',
		agendizeService:'scheduling',
		requiredParams:['company_id','appointment']
	},
	'getClients':{
		agendizeFunction:'getClients',
		agendizeService:'scheduling'
	},
	'getStaffs':{
		agendizeFunction:'getStaffs',
		agendizeService:'scheduling',
		requiredParams:['company_id']
	},
	'getAccount':{
		agendizeFunction:'getAccount',
		agendizeService:'scheduling'
	},
	'createWebhookForAppointments':{
		agendizeFunction:'createWebhook',
		agendizeService:'scheduling',
		requiredParams:['company_id','webhook']
	},
	'deleteWebhook':{
		agendizeFunction:'deleteWebhook',
		agendizeService:'account',
		requiredParams:['webhook_id']
	},
	'createWebhookForCalls':{
		agendizeFunction:'createWebhookForCalls',
		agendizeService:'account',
		requiredParams:['webhook']
	},
	'createWebhookForForms':{
		agendizeFunction:'createWebhookForForms',
		agendizeService:'account',
		requiredParams:['webhook']
	},
	'createWebhookForChat':{
		agendizeFunction:'createWebhookForChat',
		agendizeService:'account',
		requiredParams:['webhook']
	},
	'updateSettings':{
		agendizeFunction:'updateSettings',
		agendizeService:'scheduling',
		requiredParams:['company_id','settings']
	},
	'updateAccount':{
		agendizeFunction:'updateAccount',
		agendizeService:'reseller',
		requiredParams:['account_id','account']
	},
	'createChatButton':{
		agendizeFunction:'createButton',
		agendizeService:'chat',
		requiredParams:['button']
	},
	'createStaffsAndServices':{
		agendizeFunction:'createStaffsAndServices',
		agendizeService:'scheduling',
		requiredParams:['staffs','services']
	},
	'updateCompany':{
		agendizeFunction:'updateCompany',
		agendizeService:'scheduling',
		requiredParams:['company_id','company']
	},
	'getPermissions':{
		agendizeFunction:'getPermissions',
		agendizeService:'account'
	},
	'getCallTrackingNumbers':{
		agendizeFunction:'get',
		agendizeService:'call_tracking'
	},
	'deleteCallTrackingNumber':{
		agendizeFunction:'delete',
		agendizeService:'call_tracking',
		requiredParams:['line_id']
	}
}


// function that return an error if the input does not contain all the required fields
function checkInputs(functionName,input,requiredFields){
	if(requiredFields && !input){
		var error = new errors.BadRequest('Agendize Module - You need to attach the properties '+JSON.stringify(requiredFields)+' calling function '+functionName);
		logger.log(logger.LEVEL_ERROR,error);
		return error;
	}

	for(var i in requiredFields){
		if(!input.hasOwnProperty(requiredFields[i])){
			var error =  new errors.BadRequest('Agendize Module - Missing Param '+requiredFields[i]+' in input function '+functionName)
			logger.log(logger.LEVEL_ERROR,error);
			return error;
		}
	}

	return null;
}

//function that return a function from a service.
//Extract sso_token from input options (if reseller) or access_token (if application)
var _apiFunction = function(functionToInstanciate,credentials,isReseller){
	var that = this;

	that.function = functionToInstanciate;

	return function(options,callback){

		logger.log(logger.LEVEL_INFO,"Agendize Module Execute "+that.function.agendizeService+'.'+that.function.agendizeFunction);

		if(!callback || typeof callback == "undefined"){
			callback = options;
			options = null;
		}

		if(that.function.requiredParams)
			var error = checkInputs(that.function.name,options,that.function.requiredParams);

		if(error){
			if(callback){
				callback(error)
				return;
			}
			else
				throw error;
		}

		var _credentials = {}

		for(var i in credentials){
			_credentials[i]=credentials[i];
		}
		
		if(isReseller){
			if(options && options.sso_token){
				_credentials.token = options.sso_token;

				delete options.sso_token;
			}
		}else{
			if(!options || !options.hasOwnProperty('access_token')){
				var error = new errors.BadRequest('Agendize Module - Missing access_token to do the request');
				if(callback)
					callback(error);
				else
					throw error;

			}else{
				_credentials = {
					access_token:options.access_token
				}
				delete options.access_token;
			}

			if(options && options.hasOwnProperty('apiKey')){
				_credentials = {
					apiKey:options.apiKey
				}
				
				delete options.apiKey;
			}
		}

		if(options && options.hasOwnProperty('hostname')){
			_credentials.hostname = options.hostname;
			delete options.hostname;
		}

		if(options && Object.keys(options).length == 0){
			options=null;
		}

		if(options){
			logger.log(logger.LEVEL_DEBUG,"Execute function with credentials: "+JSON.stringify(_credentials)+" and with options "+JSON.stringify(options));
			services[that.function.agendizeService][that.function.agendizeFunction](options,_credentials,callback);				
		}else{
			logger.log(logger.LEVEL_DEBUG,"Execute function with credentials: "+JSON.stringify(_credentials)+" but no options")
			services[that.function.agendizeService][that.function.agendizeFunction](_credentials,callback);				
		}
	}
}


function agendize(moduleEntry){

	logger.log(logger.LEVEL_INFO,'Initialization!');
	logger.log(logger.LEVEL_DEBUG,'Init starting with  options: '+JSON.stringify(moduleEntry));

	var isReseller;

	if(moduleEntry && moduleEntry.hasOwnProperty('apiKey') && moduleEntry.hasOwnProperty('token')){
		isReseller = true;
	}else if(moduleEntry &&  moduleEntry.hasOwnProperty('client_id') && moduleEntry.hasOwnProperty('client_secret') && 
		moduleEntry.hasOwnProperty('callback_url')){
		isReseller = false;
	}else{
		logger.log(logger.LEVEL_ERROR,'Init failed. see documentation of the module at https://www.npmjs.com/package/agendize#initialization');
		throw(new Error("Agendize Module cannot be initialized"));
	}
	
	var credentials = moduleEntry;

	var Agendize = {};

	for(var i in availableFunctions){
		var fct = availableFunctions[i];
		fct.name = i;
	    	Agendize[i] = new _apiFunction(fct,credentials,isReseller);
	}

	if(!isReseller){

		Agendize.callback_url = credentials.callback_url;

		Agendize.oauth2_redirect_url = (function(){
			return services.oauth2.getRedirectURLFromClientIdAndCallbackURL(credentials.client_id,credentials.callback_url);
		})()
		
		Agendize.tokenRequest = function(data,callback){

		    	data.client_secret = credentials.client_secret;
		    	data.client_id = credentials.client_id;

		    	if(data.refresh_token){
				    data.grant_type='refresh_token'
		    	}else{
                    data.grant_type='authorization_code'
                    data.redirect_uri = credentials.callback_url;
		    	}
				
			services.oauth2.tokenRequest(data,callback);
		}
	}

	logger.log(logger.LEVEL_DEBUG,'Agendize module initialization terminating');

	return Agendize;
}

module.exports = agendize;
module.exports.errors = errors;
module.exports.createSSO = services.createSSO;

