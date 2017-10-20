var resellerAPI = require('../api').reseller;
var schedulingServices = require('./scheduling.js');
var errors = require('../errors');
var logger = require('../logger'); 

this.checkIfAccountExist = resellerAPI.checkIfAccountExist;
this.desactiveAccount = resellerAPI.desactiveAccount;
this.activeAccount = resellerAPI.activeAccount;
this.changePlan = resellerAPI.changePlan;
this.getAccounts = resellerAPI.getAccounts;
this.removeAccount = resellerAPI.removeAccount;
this.updateAccount = resellerAPI.updateAccount;

this.createAccount = function(options,credentials,callback){
  var signup = options;

  logger.log(logger.LEVEL_DEBUG,"Agendize Reseller Services, createAccount starting with credentials "+JSON.stringify(credentials));
  
  var agz_signup = {};

  agz_signup.errors = {
    staffs : [],
    services : [],
    buttons:[],
    clients:[],
    appointments:[]
  };  

  resellerAPI.createAccount(signup,credentials,function(error,result){
    if(error)
      callback(error)    
    else{

      if(result.hasOwnProperty('ssoToken'))
      {
        agz_signup.account = result;

        credentials.token = agz_signup.account.ssoToken;

        if(!signup.company){
          logger.log(logger.LEVEL_DEBUG,"Agendize reseller services ended the signup")
          callback(null,agz_signup);
          return;
        }

        if(signup.company.resourceMode){
            
            finishCompanyCreationForResource(signup,credentials,agz_signup,callback);

            return;

        }

        schedulingServices.createCompany(signup,credentials,function(error,result){
          
          if(error){
            agz_signup.errors.company = error;
            callback(null,agz_signup);
          }

          else{

            if(result.hasOwnProperty('id')){

              agz_signup.company = result;

              if(!signup.staff || signup.staff == 'undefined' || signup.staff.length == []){
               signup.staff = [{
                email:signup.account.email,
                firstname:signup.account.firstname?signup.account.firstname:'Staff',
                lastname:signup.account.lastname?signup.account.lastname:signup.account.email,
                role:'none'
              }]
            
            }

            schedulingServices.createStaffs(
              {
                staffs:signup.staff,
                company_id:agz_signup.company.id
              },
              credentials,function(error,result){

            agz_signup.staffs = [];

            for(var i=0; i<result.length; i++){
              if(result[i] && !result[i].error)
                agz_signup.staffs.push(result[i]);
              else
                agz_signup.errors.staffs.push(result[i])
            }

            schedulingServices.createServices(
              {
                services:signup.services,
                company_id:agz_signup.company.id,
                staffs:agz_signup.staffs
              },
              credentials,
              function(error,resultServices){

              agz_signup.services = [];

              for(var i=0; i<resultServices.length; i++){
                if(resultServices[i].error)
                  agz_signup.errors.services.push(resultServices[i])
                else
                  agz_signup.services.push(resultServices[i])
              }

               if(signup.clients && signup.clients.length>0){

                    schedulingServices.createClients(
                    {
                      clients:signup.clients
                    },
                    credentials,
                    function(errorClients,resultClients){

                      agz_signup.clients = [];

                      for(var i=0; i<resultClients.length; i++){

                        if(resultClients[i].error)
                          agz_signup.errors.clients.push(resultClients[i])
                        else
                          agz_signup.clients.push(resultClients[i])
                      }

                    if(signup.buttons && signup.buttons.length > 0){

                      schedulingServices.createButtons(
                        {
                          buttons:signup.buttons,
                          company_id:agz_signup.company.id
                        },
                        credentials,function(errorButtons,resultButtons){

                        agz_signup.buttons = [];

                        for(var i=0; i<resultButtons.length; i++){
                          if(resultButtons[i].error)
                            agz_signup.errors.buttons.push(resultButtons[i])
                          else
                            agz_signup.buttons.push(resultButtons[i])
                        }

                      if(signup.appointments && signup.appointments.length >0){

                        if(!agz_signup.clients || agz_signup.clients.length<1){
                          logger.log(logger.LEVEL_WARN,"Try to create an appointment but no clients")
                          callback(null,agz_signup);
                          return;
                        }else if(!agz_signup.services || agz_signup.services.length<1){
                          logger.log(logger.LEVEL_WARN,"Try to create an appointment but no services")
                          callback(null,agz_signup);
                          return;
                        }else if(!agz_signup.staffs || agz_signup.staffs.length<1){
                          logger.log(logger.LEVEL_WARN,"Try to create an appointment but no staff")
                          callback(null,agz_signup);
                          return;
                        }

                        var jsonAppointments = [];

                        for(var i=0;i<signup.appointments.length;i++){
                          jsonAppointments.push({
                            date:signup.appointments[i],
                            client_id:agz_signup.clients[0].id,
                            service_id:agz_signup.services[0].id,
                            staff_id:agz_signup.staffs[0].id
                          });
                        }

                        schedulingServices.createAppointments(
                        {
                          appointments:jsonAppointments,
                          company_id:agz_signup.company.id
                        },
                        credentials,function(error,resultAppointments){

                          agz_signup.appointments = [];

                          for(var i=0; i<resultAppointments.length; i++){
                            if(!resultAppointments[i] || resultAppointments[i].error)
                              agz_signup.errors.buttons.push(resultAppointments[i])
                            else
                              agz_signup.appointments.push(resultAppointments[i])
                          }

                          callback(null,agz_signup);

                        })

                      }else
                      callback(null,agz_signup);

                    })

                  }else
                  callback(null,agz_signup);

                })

              }else
              callback(null,agz_signup);

            })
          })
}else
callback(new Error("Missing id in result of company creation"))
}
})
} 
else
  callback(new Error("Missing ssoToken in result of account creation"))
}
})
}


function finishCompanyCreationForResource(signup,credentials,agz_signup,callback){

  signup.company.scheduledItems = 'resource';

   schedulingServices.createCompany(signup,credentials,function(error,result){
          
      if(error){
        agz_signup.errors.company = error;
        callback(null,agz_signup);
        return;
      }

      if(!result.hasOwnProperty('id')){
        agz_signup.errors.company = new Error('Error creating the company object on Agendize');
        callback(null,agz_signup);
        return;
      }
      
      agz_signup.company = result;

      if(!signup.resources){
          callback(null,agz_signup);
          return;
      }

      schedulingServices.createResources(
        {
          resources:signup.resources,
          company_id:agz_signup.company.id
        },
        credentials,function(error,result){

          if(error){

             agz_signup.errors.resources = error;
             callback(null,agz_signup);
             return;
          }

        agz_signup.resources = [];

        for(var i=0; i<result.length; i++){
          if(result[i] && !result[i].error)
            agz_signup.resources.push(result[i]);
          else
            agz_signup.errors.resources.push(result[i])
        }

        callback(null,agz_signup);

      });


    });

}

module.exports = this
