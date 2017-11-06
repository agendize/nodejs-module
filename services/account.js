var errors = require('../errors');
var logger = require('../logger'); 

var api = require('../api').account;

this.deleteWebhook = api.deleteWebhook;
this.createWebhookForCalls = api.createWebhookForCalls;
this.createWebhookForForms = api.createWebhookForForms;
this.createWebhookForChat = api.createWebhookForChat
this.getPermissions = api.getPermissions
this.createWebhookForAppointments = api.createWebhookForAppointments;

module.exports = this;