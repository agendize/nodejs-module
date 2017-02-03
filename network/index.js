var logger = require('winston');
var https = require('https');
var errors = require('../errors');

exports.doPostRequestFormDataType = function(data,host,path,callback){
		var postData=Object.keys(data).map(function(k) {
			return encodeURIComponent(k) + '=' + (data[k])
		}).join('&')

		logger.warn("httpsClient - doPostRequestFormDataType "+postData)
		
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
				if(res.statusCode!=200){
					callback(new errors.ExternalAPI("httpsClient.doPostRequestFormDataType: problem when doing request to host:"+host+" statusCode: "+res.statusCode+' and body: '+body))
				}
				else{
					callback(null,body);
				}
				logger.info("httpsClient.doPostRequestFormDataType finished")
			})
		});

		reqCall.on('error', (e) => {
			callback(e)
		});

		reqCall.write(postData);
		reqCall.end();
}



exports.doRequest = function(data,host,path,method,headers,callback,debug,acceptBadResponses){
	if(debug)
		logger.info("Agendize Network - doRequest() started with host:"+host+" path:"+path+" data:"+JSON.stringify(data)+" method:"+method);
	else
		logger.info("Agendize Network - doRequest() started");

	var isGET = method == 'GET';
	
	if(isGET){

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
	head["Content-Length"] = isGET?0:Buffer.byteLength(postData);

	var options = {
		path:path,
		hostname: host,
		method:method,
		headers: head
	};

	if(debug)
		logger.info("Init request with options: "+JSON.stringify(options))


	var req = https.request(options, (res) => {

		if(debug){
			logger.info(`STATUS: ${res.statusCode}`);
			logger.info(`HEADERS: ${JSON.stringify(res.headers)}`);
		}

		res.setEncoding('utf8');

		var body =[]; 

		res.on('data', (chunk) => {
			body.push(chunk);
			if(debug)
				logger.info("New chunk pushed")
		});

		res.on('end', () => {

			logger.info("get answer of agendize api with statusCode "+res.statusCode)

			if(res.statusCode!=200 && !acceptBadResponses){
				if(res)
					callback(new errors.AgendizeAPI("When requesting on path "+host+path+", api get response "+res.statusCode+" and body "+body))
				else
					callback(new errors.AgendizeAPI("Get bad statusCode from "+host+": "+res))

				return;
			}

			var result;

			if(!body || body==""){
				logger.warn("result of "+host+" request is empty body")
				callback(null,null)
				return;
			}

			result = JSON.parse(body.join(""));

			if(result.hasOwnProperty('error')&&!acceptBadResponses){
				logger.error("result of "+host+path+" request is an error "+JSON.stringify(result.error))
				callback(new errors.ExternalAPI(JSON.stringify(result.error)))
			}else if(result.hasOwnProperty('error')){
				logger.info("result of "+host+path+" request is an error "+JSON.stringify(result.error))
				callback(result.error)
				return;
			}
			else{
				callback(null,result)
			}

		})
	});

	req.on('error', (e) => {
		logger.error(e.message)
		callback(e)
	});

	logger.info("trying to "+method+postData?(" data : "+postData):""+" at uri "+options.path+" with headers "+JSON.stringify(options.headers));
	
	// write data to request body
	if(data && data!=''){
		if(debug)
			logger.info("Agendize Network Will Write "+postData);

		req.write(postData);
	}

	req.end();

}
