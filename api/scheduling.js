var logger = require('../logger');
var errors = require('../errors');
// var thirdPartyServices = require('../global/thirdPartyServices.js');
var httpsClient = require('../network');

var http = require('http');
var querystring = require('querystring');



const AGZ_API_HOST = process.env.AGZ_API_HOST;
// const AGZ_API_HOST = 'az2.agendize.com'

	function doAgendizeRequest(method,path,data,credentials,callback){

		var headers = {};

		if(credentials.hasOwnProperty('apiKey') && credentials.hasOwnProperty('token')){
			headers = {
				token:credentials.token,
				apiKey:credentials.apiKey
			}
		}else if(credentials.hasOwnProperty('access_token')){
			
			headers = {
				'Authorization':'Bearer '+credentials.access_token
			}

		}else{
			callback(new errors.BadRequest("Missing credentials to do Agendize API Request"))
		}

		httpsClient.doRequest(data,AGZ_API_HOST,path,method,headers,callback)

	}	


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

		doAgendizeRequest('POST','/api/2.0/scheduling/companies',data,credentials,function(err,result){

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

		data.role = "scheduler"

		doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/staff',data,credentials,function(err,result){

			logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createStaff() finished")

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

		doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/services',data,credentials,function(err,result){
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

 		doAgendizeRequest('POST','/api/2.0/scheduling/companies/'+companyId+'/appointments',data,credentials,function(err,res){
			logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - createAppointment() finished")
			callback(err,res)
		})

	}


	this.createClient= function(options,credentials,callback){
		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - createClient() started")

		var client = options.client;

		if(!client.hasOwnProperty('lastName')){
			logger.log(logger.LEVEL_WARN,"crashed cause bad input: missing client lastName")
			callback(new errors.BadRequest('service creation error missing entry parameter : client.lastName'))
			return;
		}

		var data = client;

		doAgendizeRequest('POST','/api/2.0/clients',data,credentials,function(err,result){
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

		doAgendizeRequest('POST','/api/2.0/scheduling/buttons',data,credentials,function(err,result){
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
			hostname: 'api.agendize.com',
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

		doAgendizeRequest('GET','/api/2.0/scheduling/companies',null,credentials,function(err,res){
			logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getCompanies() finished")
			callback(err,res)
		})
	}

	this.getAccount = function(credentials,callback){

		logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getAccountFromAgendize() started with credentials "+JSON.stringify(credentials))

		doAgendizeRequest('GET','/api/2.0/accounts',null,credentials,function(err,res){
			logger.log(logger.LEVEL_DEBUG,"AgendizeSchedulingAPI - getAccountFromAgendize() finished")
			callback(err,res)
		})

	}


  this.getClients = function(credentials,callback){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getClients() started")

  		doAgendizeRequest('GET','/api/2.0/clients',null,credentials,function(err,res){
			logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getClients() finished")
			callback(err,res)
		})

  }

  this.getStaffs = function(options,credentials,callback){
		logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getStaffs() started")
		var companyId = options.company_id;
  		doAgendizeRequest('GET','/api/2.0/scheduling/companies/'+companyId+'/staff',null,credentials,function(err,res){
			logger.log(logger.LEVEL_DEBUG,"AgendizeBusinessAPI - getStaffs() finished")
			callback(err,res)
		})

  }



module.exports = this;


