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
### You want to distribute and manage accounts under a partner Agendize edition.
`
var Agendize = require('agendize');
var options = {
	apiKey:'abc123def456ghi789jkl',
	token:'mno123pqr456stu789vwz'
}
var agendize_reseller_api = new Agendize(options)
`

##Available Functions
 
###Reseller API
You can manage multiple accounts under a partner Agendize account.

* Create accounts
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
