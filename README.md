# Agendize NPM Module

## Summary
* [Overview](#markdown-header-overview)
* [Features](#markdown-header-Features)
  * [Authentication](#markdown-header-Features)
  * [Reseller API](#markdown-header-Reseller)
  * [Account API](#markdown-header-Account)
  * [Online Scheduling API](#markdown-header-Online)

##Overview
This is a node.js module to interact with Agendize APIs. Agendize API documentation is available here: http://developers.agendize.com/. 

##Features
### Authentication
This module handles both partner authentication and application oAuth2 authentication modes.
 
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
