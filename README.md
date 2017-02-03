Agendize NPM Module
==============================

This is a node.js module to interact with Agendize APIs. Agendize API documentation is available here: http://developers.agendize.com/. 
This module handles both partner authentication and application oAuth2 authentication modes.

## Summary
* [Installation](#markdown-header-installation)
* [Initialization](#markdown-header-initialization)
* [Available Functions](#markdown-header-available)
    * [Reseller API](#markdown-header-reseller)
    * [Account API](#markdown-header-account)
    * [Online Scheduling API](#markdown-header-online)

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

##Available Functions
 
###Reseller API
You can manage multiple accounts under a partner Agendize account.

#### Create accounts
function:
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
and callback a asynchronously called function with error and result objects.
`agendizeApi.createAccount(options,function(error,result){
	if(error){
		//do something with the error
	}else{
		//do something with the result
	}
})` 


Note that according to Agendize objects management:
* buttons creation need company
* appointments creation need staff, service and client.

* Check if an email is already used
* Desactive an account
* Change the plan of an account

###Account API
* Get account information

###Online Scheduling API
* Get Companies of an account
* Get Clients of an account
* Get Staffs of a company
* Create appointment

### Click to call API
* Make a click-to-call call 

## Prerequisites
* Have an Agendize Account
* Requesting your API key to our wonderful Support team

- if you are a partner distributing Agendize accounts, you also need to request a SSO Token to our support team.

* Finally understand how Agendize objects are working together. What is an Account? a Company, Service, Staff, Client or Appointment. 
