var errors = require('../errors');
var logger = require('../logger'); 

var schedulingAPI = require('../api').scheduling;

this.createCompany = schedulingAPI.createCompany;
this.createStaff = schedulingAPI.createStaff;
this.createService = schedulingAPI.createService;
this.getClients = schedulingAPI.getClients;
this.getStaffs = schedulingAPI.getStaffs;
this.createAppointment = schedulingAPI.createAppointment;
this.call = schedulingAPI.call;
this.getAccount = schedulingAPI.getAccount;
this.createWebhook = schedulingAPI.createWebhook;
this.updateSettings = schedulingAPI.updateSettings;

var that = this;

var Appointment = function(clientId,serviceId,staffId,date){
  
  function ISODateString(d){

    function pad(n){return n<10 ? '0'+n : n}

    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
  }

return {
    client:{
      id:clientId
    },
    service:{
      id:serviceId
    },
    staff:{
      id:staffId
    },
    start:{
      dateTime:ISODateString(date)
    }
  }

}

this.Appointment = Appointment;

this.createAppointment = function(options,credentials,callback){
  logger.log(logger.LEVEL_WARN,"should have create appoitnment from Ids." +JSON.stringify(options))

//companyId,staffId,clientId,serviceId,date
  if(options && options.appointment && options.appointment.client){
    schedulingAPI.createAppointment(options,credentials,callback);
  }else{
    var companyId = options.company_id;
    var clientId = options.appointment.client_id;
    var serviceId = options.appointment.service_id;
    var staffId = options.appointment.staff_id;
    var date = options.appointment.date;

    var appointment = new Appointment(clientId,serviceId,staffId,date)

    logger.log(logger.LEVEL_WARN,"should have create appoitnment from Ids." +JSON.stringify(appointment))
   
    schedulingAPI.createAppointment(
    {
      appointment:appointment,
      company_id:companyId
    },
    credentials,
    callback);
  }

}

this.createStaffs= function(options,credentials,callback){
var staffs = options.staffs;
var companyId = options.company_id;

var agzStaff = [];
var agzError = null;

function doCreationStaff(i){

schedulingAPI.createStaff({
  staff:staffs[i],
  company_id:companyId
},credentials,function(error,result){
  if(error){

    agzStaff.push({
      staff:staffs[i],
      error:error
    })

    if(!agzError)
      agzError = new Error('One or more staff has not been created');

  }else{
    agzStaff.push(result)
  }

  if(i==staffs.length-1){
    callback(agzError,agzStaff)
  }else{
    doCreationStaff(i+1);
  }
})
}

if(staffs.length>0)
doCreationStaff(0);
else
callback(null,{})

}


  this.createClients = function(options,credentials,callback){
    var clients = options.clients;

    var agzClients= [];
    var agzError = null;

    function doCreationClient(i){

      schedulingAPI.createClient(
        {
        client:clients[i]
        },
        credentials,
        function(error,result){
        if(error){

          agzClients.push({
            client:clients[i],
            error:error
          })

          if(!agzError)
            agzError = new Error('One or more staff has not been created');

        }else{
          agzClients.push(result)
        }

        if(i==clients.length-1){
          callback(agzError,agzClients)
        }else{
          doCreationClient(i+1);
        }
      })
    }

    if(clients.length>0)
      doCreationClient(0);
    else
      callback(null,{})

  }

  this.createAppointments = function(options,credentials,callback){
    var appointments = options.appointments;
    var companyId = options.company_id;

    var agzAppointments= [];
    var agzError = null;

    function doCreationAppointment(i){

      that.createAppointment(
        {
          appointment:appointments[i],
          company_id:companyId
        },
        credentials,
        function(error,result){
        if(error){

          agzAppointments.push({
            client:appointments[i],
            error:error
          })

          if(!agzError)
            agzError = new Error('One or more appointments has not been created');

        }else{
          agzAppointments.push(result)
        }

        if(i==appointments.length-1){
          callback(agzError,agzAppointments)
        }else{
          doCreationAppointment(i+1);
        }
      })
    }

    if(appointments.length>0)
      doCreationAppointment(0);
    else
      callback(null,{})

  }


  this.createButtons = function(options,credentials,callback){
    var buttons = options.buttons;
    var companyId = options.company_id;

    logger.log(logger.LEVEL_DEBUG,"AgendizeServices createButtons STARTING")

    var agzButtons = [];
    var agzError = null;

    function doCreationButton(i){

      schedulingAPI.createButton(
        {
          button:buttons[i],
          company_id:companyId
        },
        credentials,
        function(error,result){
        if(error){

          agzButtons.push({
            button:buttons[i],
            error:error
          })

          if(!agzError)
            agzError = new Error('One or more button has not been created');

        }else{
          agzButtons.push(result)
        }

        if(i==buttons.length-1){
          callback(agzError,agzButtons)
        }else{
          doCreationButton(i+1);
        }
      })
    }

    if(buttons.length>0)
      doCreationButton(0);
    else
      callback(null,{})
  }

// this function allow the creation of multiple services calling tthe agendize api
// Agendize api functions are asyncroneous but we transform the process to syncronous
// to avoid the agendize servers to be overloaded
this.createServices = function(options,credentials,callback){
 
 var services = options.services;
 var staffs = options.staffs;
 var companyId = options.company_id;

  var agzServices = [];
  var agzError = null;

  logger.log(logger.LEVEL_DEBUG,"Agendize services - createServices() Started" )

  function doCreationService(i){

    services[i].staff = staffs;

    schedulingAPI.createService(
      {
        service:services[i],
        company_id:companyId
      },
      credentials,function(error,result){
      if(error){

        agzServices.push({
          service:services[i],
          error:error
        })

        if(!agzError)
          agzError = new Error('One or more service has not been created');

      }else{
        agzServices.push(result)
      }

      if(i==services.length-1){
        callback(agzError,agzServices)
      }else{
        doCreationService(i+1);
      }
    })
  }

  if(services.length>0)
   doCreationService(0);
 else
  callback(null,{})
}

/*
// 
//
*/
this.getCompanies = function(credentials,callback){

  logger.log(logger.LEVEL_DEBUG,"AgendizeAPI - getCompanies() started with credentials")

  schedulingAPI.getCompanies(credentials,function(err,responseObj){
    if(err)
      callback(err)
    else
      callback(null,responseObj.items)          
  })
}

module.exports = this;

