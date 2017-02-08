Agendize NPM Module
==============================

This is a node.js module to interact with Agendize APIs. Agendize API documentation is available here: http://developers.agendize.com/. 
This module handles both partner authentication and application oAuth2 authentication modes.

## Summary
* <a href="https://www.npmjs.com/package/prerequisites">Prerequisites</a>
* <a href="https://www.npmjs.com/package/agendize#installation">Installation</a>
* <a href="https://www.npmjs.com/package/agendize#initialization">Initialization</a>
* <a href="https://www.npmjs.com/package/agendize#how-it-works">How it works</a>
* <a href="https://www.npmjs.com/package/agendize#authentication">Authentication</a>
* <a href="https://www.npmjs.com/package/agendize#available-functions">Available Functions</a>
    * <a href="https://www.npmjs.com/package/agendize#reseller-api">Reseller API</a>
        * <a href="https://www.npmjs.com/package/agendize#create-accounts">Create accounts</a>
        * <a href="https://www.npmjs.com/package/agendize#check-if-an-email-is-already-used">Check if an email is already used</a>
        * <a href="https://www.npmjs.com/package/agendize#desactive-an-account">Desactive an account</a>
        * <a href="https://www.npmjs.com/package/agendize#change-the-plan-of-an-account">Change the plan of an account</a>
    * <a href="https://www.npmjs.com/package/agendize#account-api">Account API</a>
        * <a href="https://www.npmjs.com/package/agendize#get-account-information">Get account information</a>
    * <a href="https://www.npmjs.com/package/agendize#online-scheduling-api">Online scheduling API</a>
        * <a href="https://www.npmjs.com/package/agendize#get-companies">Get Companies</a>
        * <a href="https://www.npmjs.com/package/agendize#get-clients">Get Clients</a>
        * <a href="https://www.npmjs.com/package/agendize#get-staffs">Get Staffs</a>
        * <a href="https://www.npmjs.com/package/agendize#create-appointment">Create appointment</a>
            * <a href="https://www.npmjs.com/package/agendize#create-appointment-with-ids">Create appointment with ids</a>
            * <a href="https://www.npmjs.com/package/agendize#create-appointment-with-ids">Create appointment with appointment</a>
* <a href="https://www.npmjs.com/package/agendize#run-the-examples">Run the examples</a>


## Prerequisites
* Have an Agendize Account
* Requesting your API key to our wonderful Support team

    *if you are a pa rtner distributing Agendize accounts, you also need to request a SSO Token to our support team.

* Finally understand how Agendize objects are working together. What is an Account? a Company, Service, Staff, Client or Appointment. 


##Installation
`npm install -g agendize`

##Initialization
### Your Agendize application manages multiple accounts
As mentioned in the developer documentation, authentication will be handled by ssoToken and apiKey.
```
var Agendize = require('agendize');
var options = {
	apiKey:'abc1xxxxxxxxxxxxxx9jkl',
	token:'mno1xxxxxxxxxxxxxx9vwz'
}
var agendizeApi = new Agendize(options)
```
###Your Agendize application manages multiple accounts
Authentication will be done following the oAuth2 processus. According to the documentation you will need a client ID, a client Secret and a Callback URL.

```
var Agendize = require('agendize');
var options = {
	client_id:'abc1xxxxxxxxxxxxxx9jkl',
	client_secret:'mno1xxxxxxxxxxxxxx9vwz',
	callback_url:'https://your.application.com/your/callback/path'
}
var agendizeApi = new Agendize(options)
```
##How it works
Most of the functions available will have the form:
```
agendizeAPI.doSomethingWith(options,callback);
```
* options is the input of the function and is discribed into each function description.

* callback object is an asynchronously called function with error and result objects.

``` 
agendizeApi.doSomethingWith(options,function(error,result){
	if(error){
		//do something with the error
	}else{
		//do something with the result
	}
})

```  

**result** object will contain the resulted created objects depending on the options parameter. See Agendize developers documentation for each resource body. 

**error** object 

##Authentication
* If you are managing multiple accounts.
Then access the reseller API following the bellow documentation.
When accessing the Account or Scheduling APIs, insert the property `sso_token` inside the `options` object with the value of the account's `sso_token` you want to manage.

* However if you work with oAuth2, insert the property `access_token` inside the `options` object with the value of the user's `access_token` you want to manage the account of.

##Available Functions
 
###Reseller API
You can manage multiple accounts under a partner Agendize account.

#### Create accounts
`agendizeApi.createAccount(options,callback)` 
with required option:
```
options = {
	account:{
		email:'email_of_the_account@email.com'
	}
}
```
options can be:

```

options:{
		account:{
			email:String,
			password:String
		},
		staff:[
		{
			FirstName:String,
			LastName:String,
			Email:String
		}
		],
		company:{
			name:String
		},
		services:[{
			name:String,
			price:Int,
			duration:Int
		},
		{
			name:String,
			price:Int,
			duration:Int
		}],
		buttons:[
		{
			name:String
		}]
		,
		clients:[
		{
			firstName:String,
			lastName:String,
			address:{
				street:String,
				zipCode:String,
				city:String,
				country:String
			},
			emailAddresses:[
			{
				primary:Boolean,
				email:String
			}]
		}],
		appointments:[Date,Date],
		paymentProfile:{
			nativePlan:Boolean,
			id:Int
		}
	}
}

```

Note that according to Agendize objects management:
* buttons creation need company
* appointments creation need staff, service and client.

#### Check if an email is already used
```
agendizeApi.checkIfAccountExist(options,function(error,result){

})
```
with required `option`:
```
options = {
	email:'email_of_the_account@email.com'
}

```
`result` is set to `true`, or `false`, depending on if the email is known, or not, by Agendize.

#### Desactive an account
```
agendizeApi.desactiveAccount(options,function(error){

})
```
with required `ption`:
```
options = {
	account_id:Int
}
```

#### Change the plan of an account
```
agendizeApi.changePlan(options,function(error,result){

})
```
with required `option`:
```
options = {
	account_id:Int,
	destination_plan:Int
}

```
`result` is the updated account resource.

###Account API

####Get account information
```
agendizeApi.getAccount(options,function(error,result){

})
```
with required `option`:
* If you are working with oAuth2:
```
options = {
	access_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize account resource of the `access_token` user owner.

However if you are a reseller and managing multiple accounts:
```
options = {
	sso_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize account resource of the `sso_token` user owner.

###Online Scheduling API
####Get Companies
```
agendizeApi.getCompanies(options,function(error,result){

})
```
with required `option`:
* If you are working with oAuth2:
```
options = {
	access_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize company resource list of the `access_token`'s user's account.

However if you are a reseller and managing multiple accounts:
```
options = {
	sso_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize company resource list of the sso_token user owner.

####Get Clients
```
agendizeApi.getClients(options,function(error,result){

})
```
with required `option`:
* If you are working with oAuth2:
```
options = {
	access_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize client resource list of the `access_token`'s user's account.

However if you are a reseller and managing multiple accounts:
```
options = {
	sso_token:"abcdefg12345678qabcdefgh"
}

```
`result` will be the Agendize client resource list of the sso_token user owner.

####Get Staffs
```
agendizeApi.getClients(options,function(error,result){

})
```
with required `option`:
* If you are working with oAuth2:
```
options = {
	access_token:"abcdefg12345678qabcdefgh",
	company_id:"1234567"
}

```
`result` will be the Agendize staff resource list of the `access_token`'s user's account related to the company id indicated.

However if you are a reseller and managing multiple accounts:
```
options = {
	sso_token:"abcdefg12345678qabcdefgh"
	company_id:"1234567"
}

```
`result` will be the Agendize client resource list of the sso_token user owner related to the company id indicated.

#### Create appointment

##### Create appointment with ids
```
agendizeApi.createAppointment(options,function(error,result){

})
```

`options` required attributes:
```
options = {
	sso_token:String,
	company_id:String,
	staff_id:String,
	client_id:String,
	service_id:String,
	date:Date
}

```
`result` will be the created appointment resource;

##### Create appointment with appointment

```
agendizeApi.createAppointmentWithAppointment(options,function(error,result){

})
```

`options` required attributes:
```
options = {
	sso_token:"abcdefg12345678qabcdefgh"
	appointment:{

	}
}

```
`result` will be the created appointment resource;

### Click to call API
#### Make a click-to-call call 
You need to have a click to call button on the Agendize account.
```
agendizeApi.call(options,function(error,result){

})
```

`options` required attributes:
```
options = {
	button_id:"123456789",
	number:"+1555555555"
}
```
#Run the examples
You will need to have an Agendize developer account to use the examples then follow the bellow steps:
##Go to the example project folder for instance `cd examples/click-to-call`
##Install the needed npm modules with the command: `npm install`
##Set the credentials of the agendize module in the index.js file
###if you manage multiple accounts
```
var serviceAgendize = new agendize(
	{
		apiKey:"qwert123qwety123",
		token:"abcdefgh123456789"
	}
)
```

or
###if you are building an oauth2 app:
```
var serviceAgendize = new agendize(
	{
		client_id:"qwert123qwety123",
		client_secret:"abcdefgh123456789",
		callback_url:"https://your-application-callback-url.com"
	}
)
```

##GStart the application with `node index.js`
