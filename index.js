var logger = require('winston');
var services = require('./services');
var errors = require('./errors');

// Functions available for reseller accounts
var resellerFunctions = {
	'createAccount':{
		agendizeService:'reseller',
		agendizeFunction:'createAccount',
		requiredParams:['account','payment_profile']
	},
	'checkIfAccountExist':{
		agendizeFunction:'checkIfAccountExist',
		agendizeService:'reseller',
		requiredParams:['email']
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
	}
}

// Functions available for both Reseller and Applications types usage
var commonFunctions = {
	'createAppointment':{
		agendizeService:'scheduling',
		agendizeFunction:'createAppointment',
		requiredParams:['company_id','staff_id','client_id','service_id','date']
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
	}

}

// function that return an error if the input does not contain all the required fields
function checkInputs(functionName,input,requiredFields){
	for(var i in requiredFields){
		if(!input.hasOwnProperty(requiredFields[i])){
			return new errors.BadRequest('Agendize Module - Missing Param '+requiredFields[i]+' in input function '+functionName)
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

		logger.warn("Agendize Module Execute "+that.function.agendizeService+'.'+that.function.agendizeFunction);

		if(that.requiredParams)
			var error = checkInputs(that.function.name,options,that.function.requiredParams);

		if(error){
			callback(error)
			return;
		}

		var _credentials = credentials;
		
		if(isReseller){
			if(options && options.sso_token){
				_credentials.token = options.sso_token;

				if(Object.keys(options).length == 1)
					options=null;
				else
					delete options.sso_token;
			}
		}else{

			if(!options || !options.hasOwnProperty('access_token')){
				callback(new errors.BadRequest('Agendize Module - Missing access_token to do the request'));
				return;
			}else{
				_credentials = {
					access_token:options.access_token
				}
				if(Object.keys(options).length == 1)
					options=null;
				else
					delete options.access_token;
			}
		}


		if(options)
			services[that.function.agendizeService][that.function.agendizeFunction](options,_credentials,callback);				
		else
			services[that.function.agendizeService][that.function.agendizeFunction](_credentials,callback);				
	}
}



function agendize(moduleEntry){

	logger.warn('Agendize initialized with options: '+JSON.stringify(moduleEntry));

	var isReseller;

	if(moduleEntry.hasOwnProperty('apiKey') && moduleEntry.hasOwnProperty('token')){
		isReseller = true;
	}else if(moduleEntry.hasOwnProperty('client_id') && moduleEntry.hasOwnProperty('client_secret') && 
		moduleEntry.hasOwnProperty('callback_url')){
		isReseller = false;
	}else{
		throw(new Error("Agendize Module cannot be initialized"));
	}
	
	var credentials = moduleEntry;

	var Agendize = {};

	Agendize.createSSO = services.createSSO;

	for(var i in commonFunctions){
		var fct = commonFunctions[i];
		fct.name = i;
	    	Agendize[i] = new _apiFunction(fct,credentials,isReseller);
	}

	if(isReseller){

		for(var i in resellerFunctions){
			var fct = resellerFunctions[i];
			fct.name = i;
		    	Agendize[i] = new _apiFunction(fct,credentials,isReseller);
		}

	}else{

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

	return Agendize;
}

module.exports = agendize;

