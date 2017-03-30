var logger = require('../logger');
var https = require('https');
var errors = require('../errors');


const AGZ_API_HOST = process.env.AGZ_API_HOST;
// const AGZ_API_HOST = 'az2.agendize.com'

module.exports.doAgendizeRequest = function(method,path,data,credentials,callback,acceptBadCode){

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
		callback(new errors.BadRequest("Network manager - doAgendizeRequest: Missing credentials to do Agendize Request"))
	}

	doRequest(data,AGZ_API_HOST,path,method,headers,callback,acceptBadCode)

}


exports.doPostRequestFormDataType = function(data,host,path,callback){
		var postData=Object.keys(data).map(function(k) {
			return encodeURIComponent(k) + '=' + (data[k])
		}).join('&')

		logger.log(logger.LEVEL_DEBUG,"httpsClient - doPostRequestFormDataType "+postData)
		
		var options = {
			hostname:host,
			port: 443,
			path: path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData)
			}
		};

		var reqCall = https.request(options, (res) => {
			
			res.setEncoding('utf8');

			var body =[]; 

			res.on('data', (chunk) => {
				body.push(chunk);
			});
			res.on('end', () => {
				logger.log(logger.LEVEL_DEBUG,"httpsClient.doPostRequestFormDataType finished")

				if(res.statusCode!=200){
					callback(new errors.AgendizeAPI("httpsClient.doPostRequestFormDataType: problem when doing request to host:"+host+" statusCode: "+res.statusCode+' and body: '+body,body,res.statusCode))
				}
				else{
					callback(null,body);
				}
			})
		});

		reqCall.on('error', (e) => {
			callback(e)
		});

		reqCall.write(postData);
		reqCall.end();
}



function doRequest(data,host,path,method,headers,callback,acceptBadResponses){
	logger.log(logger.LEVEL_DEBUG,"Agendize Network - doRequest() started");
	logger.log(logger.LEVEL_DEBUG,"Agendize Network - doRequest() started with host:"+host+" path:"+path+" data:"+JSON.stringify(data)+" method:"+method);

	var hasDataInURL = method == 'GET' || method == 'DELETE';
	
	if(hasDataInURL){

		if(data){
			path+='?'+Object.keys(data).map(function(k) {
				return k + '=' + data[k]
			}).join('&')
		}

		data = null;

	}else{

		var postData = "";

		if(data){
			postData = JSON.stringify(data);
		}

	}

	var head = {}
	if(headers)
		head = headers;

	head["Content-Type"] = "application/json";
	head["Content-Length"] = hasDataInURL?0:Buffer.byteLength(postData);

	var options = {
		path:path,
		hostname: host,
		method:method,
		headers: head,
		port: 443,
	};

	logger.log(logger.LEVEL_DEBUG,"Init request with options: "+JSON.stringify(options))

	var req = https.request(options, (res) => {

		logger.log(logger.LEVEL_DEBUG,"Get answer from server")
		logger.log(logger.LEVEL_DEBUG,`STATUS: ${res.statusCode}`);
		logger.log(logger.LEVEL_DEBUG,`HEADERS: ${JSON.stringify(res.headers)}`);
		
		res.setEncoding('utf8');

		var body =[]; 

		res.on('data', (chunk) => {
			body.push(chunk);
			logger.log(logger.LEVEL_DEBUG,"New chunk pushed")
		});

		res.on('end', () => {

			logger.log(logger.LEVEL_DEBUG,"Network: get answer of agendize api with statusCode "+res.statusCode)

			if(res.statusCode!=200 && !acceptBadResponses){
				logger.log(logger.LEVEL_WARN,"Network: Agendize API responded not 200.")
				callback(new errors.AgendizeAPI("When requesting on path "+host+path+", api get response "+res.statusCode+" and body "+body,body,res.statusCode))
				return;
			}

			var result;

			if(!body || body==""){
				logger.log(logger.LEVEL_WARN,"result of "+host+" request is empty body")
				callback(null,null)
				return;
			}

			result = JSON.parse(body.join(""));

			if(result.hasOwnProperty('error')&&!acceptBadResponses){
				logger.log(logger.LEVEL_DEBUG,"result of "+host+path+" request is an error "+JSON.stringify(result.error))
				callback(new errors.AgendizeAPI(JSON.stringify(result.error),result,res.statusCode))
			}else if(result.hasOwnProperty('error')){
				logger.log(logger.LEVEL_DEBUG,"result of "+host+path+" request is an error "+JSON.stringify(result.error))
				callback(result.error)
				return;
			}
			else{
				callback(null,result)
			}

		})
	});

	req.on('error', (e) => {
		logger.log(logger.LEVEL_ERROR,e.message)
		callback(e)
	});

	logger.log(logger.LEVEL_DEBUG,"Method:"+method)
	if(postData){
		logger.log(logger.LEVEL_DEBUG,"data : "+postData)
	}
	logger.log(logger.LEVEL_DEBUG,"uri: "+options.path)
	logger.log(logger.LEVEL_DEBUG,"headers "+JSON.stringify(options.headers));
	
	// write data to request body
	if(data && data!=''){
		logger.log(logger.LEVEL_DEBUG,"Writte data on https request: "+postData);
		req.write(postData);
	}else{
		logger.log(logger.LEVEL_DEBUG,"No data written to the https request");
	}
	req.end();

}

exports.doRequest = doRequest;
