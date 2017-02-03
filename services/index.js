module.exports.scheduling = require('./scheduling.js');
module.exports.reseller = require('./reseller.js');
module.exports.oauth2 = require('./oauth2.js');

var crypto = require('crypto');

module.exports.createSSO = function(ssoToken,email){
   var ts = new Date().getTime();
  var secret = ssoToken;
  var message = email+''+ts+''+600000;
  const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
  return "https://app.agendize.com/sso/1.0/sso?email="+encodeURIComponent(email)+"&ts="+ts+"&mac="+hash
}

module.exports.setAPIHostname = function(hostname){
	scheduling.setAPIHostname(hostname);
	reseller.setAPIHostname(hostname);
	oauth2.setAPIHostname(hostname);
}


// function AgendizeServices(options){

//   var this_module = this;

//   this.checkIfAccountExist = resellerServices.checkIfAccountExist;
//   this.createAccount = resellerServices.createAccount;
//   this.desactiveAccount = resellerServices.desactiveAccount;
//   this.changePlan = resellerServices.changePlan;

//   this.createCompany = schedulingServices.createCompany;
//   this.createStaff = schedulingServices.createStaff;
//   this.createService = schedulingServices.createService;
//   this.removeAccount = resellerServices.removeAccount;
//   this.getAccount = schedulingServices.getAccount;
//   this.getClients = schedulingServices.getClients;
//   this.getStaffs = schedulingServices.getStaffs;
//   this.createAppointment = schedulingServices.createAppointment;

//   this.call = schedulingServices.call;

//   this.tokenRequest = this.agendizeResellerOAuth2.tokenRequest;

//   this.getSSOUrlFromAgendizeUser = function(agendizeUser){
//     logger.warn(JSON.stringify(agendizeUser));
//     return createSSO(agendizeUser.sso_token,agendizeUser.email);
//   }

// }

// module.exports = AgendizeServices;


