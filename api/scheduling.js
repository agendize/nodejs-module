var logger = require('../logger');
var errors = require('../errors');
// var thirdPartyServices = require('../global/thirdPartyServices.js');
var httpsClient = require('../network');

var http = require('http');
var querystring = require('querystring');

this.createCompany = function(options,credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createCompany() started ")

	var company = options.company;

	if(!company.hasOwnProperty('name')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing name")
		callback(new errors.BadRequest('company creation error missing entry parameter : name'))
		return;
	}

	var data = company;

	data.workingHours = [
	{
		day: "monday",
		hours: [
		{
			start: "09:00",
			end: "17:00"
		}
		]
	},
	{
		day: "tuesday",
		hours: [
		{
			start: "09:00",
			end: "17:00"
		}
		]
	},
	{
		day: "wednesday",
		hours: [
		{
			start: "09:00",
			end: "17:00"
		}
		]
	},
	{
		day: "thursday",
		hours: [
		{
			start: "09:00",
			end: "17:00"
		}
		]
	},{
		day: "friday",
		hours: [
		{
			start: "09:00",
			end: "17:00"
		}
		]
	}
	];

	httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createCompany() finished")
		if(err)
			callback(err)
		else
			callback(null,result)
	});
}

this.createStaff = function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createStaff() started ")

	var staff = options.staff;
	var companyId = options.company_id

	if(staff.LastName)
		staff.lastName = staff.LastName
	if(staff.FirstName)
		staff.firstName = staff.FirstName;
	if(staff.Email)
		staff.email = staff.Email;
	if(staff.firstname)
		staff.firstName = staff.firstname;
	if(staff.lastname)
		staff.lastName = staff.lastname;

	var data = staff;

	httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/staff',data,credentials,function(err,result){

		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createStaff() finished")

		if(err){
			callback(err)
		}
		else{
			callback(null,result)
		}

	});
}


this.updateCompany = function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - updateCompany() started ")

	var company = options.company;
	var companyId = options.company_id

	var data = company;

	httpsClient.doAgendizeRequest('PUT','/api/2.0/scheduling/companies/'+companyId,data,credentials,function(err,result){

		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - updateCompany() finished")

		if(err){
			callback(err)
		}
		else{
			callback(null,result)
		}

	});
}


this.createService= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createService() started")

	var service = options.service;
	var companyId = options.company_id;

	if(!service.hasOwnProperty('name')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing service name")
		callback(new errors.BadRequest('service creation error missing entry parameter : service.name'))
		return;
	}

	if(!service.hasOwnProperty('duration')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing service duration")
		callback(new errors.BadRequest('service creation error missing entry parameter : service.duration'))
		return;
	}

	if(!service.hasOwnProperty('price')){
		service.price = 0.0;
	}

	var data = service;

	httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/services',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createService() finished")

		if(err)
			callback(err)
		else
			callback(null,result)

	});
}


this.createAppointment= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - createAppointment() started with options"+JSON.stringify(options));

	var appointment = options.appointment;
	var companyId = options.company_id;

	var data = appointment;

		httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/appointments',data,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - createAppointment() finished")
		callback(err,res)
	})

}

this.createResource= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - createResource() started with options"+JSON.stringify(options));

	var resource = options.resource;
	var companyId = options.company_id;

	var data = resource;

		httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/resources',data,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - createResource() finished")
		callback(err,res)
	})

}


this.createClient= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createClient() started")

	var client = options.client;

	if(client.lastname)
		client.lastName = client.lastname;
	
	if(client.firstname)
		client.firstName = client.firstname;

	if(!client.hasOwnProperty('lastName')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing client lastName")
		callback(new errors.BadRequest('client creation error missing entry parameter : client.lastName'))
		return;
	}

	var data = client;

	httpsClient.doAgendizeRequest('POST','/api/2.0/clients',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createClient() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}




this.createButton = function(options,credentials,callback){
	var button = options.button;
	var companyId = options.company_id

	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createButton STARTING with companyId "+companyId)

	var data = {
		name:button.name,
		companyId:companyId
	};

	httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/buttons',data,credentials,function(err,result){
		if(err)
			callback(err)
		else{
			logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createButton() finished")

			if(!result || !result.hasOwnProperty('id'))
				callback(new errors.AgendizeAPI('Agendize api returned a button resource without id'))
			else
				callback(null,result)

		}
	});
}


this.call = function(options,credentials,callback){

	var buttonId = options.button_id;
	var phoneNumber = options.number;

	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - call() started")

	var options = {
		hostname: credentials.hostname || process.env.AGZ_API_HOST,
		port: 80,
		path: '/api/1.0/action?media=call&id='+buttonId+'&key='+credentials.apiKey+'&phone='+encodeURIComponent(phoneNumber)+'&token='+credentials.token,
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(querystring.stringify({}))
		}
	};
	
	var reqCall = http.request(options, (res) => {

		res.setEncoding('utf8');
		var body =[]; 
		res.on('data', (chunk) => {
			logger.log(logger.LEVEL_DEBUG,"new chunk "+chunk)
			body.push(chunk);
		});
		res.on('end', () => {
			logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - call() finished")

			if(res.statusCode!=200){					
				var error = new errors.AgendizeAPI("Problem when calling Agendize API to do a click to call. statusCode "+res.statusCode,res.body,res.statusCode); 
				logger.log(logger.LEVEL_ERROR,error.message);

				if(callback)
					callback(error);
				else
					throw error;
			}
			else{
				logger.log(logger.LEVEL_DEBUG,"Click to call AGZ API succeeded")
				callback(null);
			}
		})
	})

	reqCall.on('error', (e) => {
		callback(e)
	});

	reqCall.end();
}

this.getCompanies = function(credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getCompanies() started")

	httpsClient.doAgendizeRequest('GET','/api/2.0/scheduling/companies',null,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getCompanies() finished")
		callback(err,res)
	})
}

this.getAccount = function(credentials,callback){

	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getAccountFromAgendize() started with credentials "+JSON.stringify(credentials))

	httpsClient.doAgendizeRequest('GET','/api/2.0/accounts',null,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getAccountFromAgendize() finished")
		callback(err,res)
	})
}


this.getClients = function(credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getClients() started")

		httpsClient.doAgendizeRequest('GET','/api/2.0/clients',null,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getClients() finished")
		callback(err,res)
	})

}

this.getStaffs = function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getStaffs() started")
	var companyId = options.company_id;
		httpsClient.doAgendizeRequest('GET','/api/2.0/scheduling/companies/'+companyId+'/staff',null,credentials,function(err,res){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getStaffs() finished")
		callback(err,res)
	})

}

this.createWebhook= function(options,credentials,callback){
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createWebhook() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('webhook')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook'))
		return;
	}

	if(!options.hasOwnProperty('company_id')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing companyId STRING")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : company_id'))
		return;
	}

	var webhook = options.webhook;

	if(!webhook.hasOwnProperty('address')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook address")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : webhook.address'))
		return;
	}

	var data = webhook;

	httpsClient.doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+options.company_id+'/appointments/watch',data,credentials,function(err,result){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createWebhook() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}

this.updateSettings= function(options,credentials,callback){
	
	logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - updateSettings() started with options "+JSON.stringify(options))

	if(!options.hasOwnProperty('settings')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing webhook resource")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : items'))
		return;
	}

	if(!options.hasOwnProperty('company_id')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing companyId STRING")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : company_id'))
		return;
	}

	var settings = options.settings;
	
	if(!settings.hasOwnProperty('items')){
		logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing settings items")
		callback(new errors.BadRequest('webhook creation error missing entry parameter : settings.items'))
		return;
	}

	var data = settings;

	httpsClient.doAgendizeRequest('PUT','/api/2.0/scheduling/companies/'+options.company_id+'/settings',data,credentials,function(err,result){
		
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - updateSettings() finished")

		if(err)
			callback(err)
		else
			callback(null,result)
	});
}

module.exports = this;


