process.env.AGENDIZE_MODULE_DEBUG_LEVEL = 2;
process.env.AGZ_API_HOST = "api.agendize.com"

var agendize = require('../../');

var serviceAgendize = new agendize({apiKey:"toto",token:"toto"})

// a simple signup only with the Email adress.
serviceAgendize.createAccount({
	account:{
		email:"email_of_the_account@domain.com"
	},
	payment_profile:0 //ask our support to know that information
},function(error,result){
	if(error instanceof agendize.errors.AgendizeAPI)
		console.log("AgendizeAPI response is "+error.getAgendizeCode());
	else if(error)
		console.log("Agendize Module sent an error "+error);
	else
		console.log("Agendize account is created, here is it: "+result)
});


// Or a signup with more options, pick the one you want!
serviceAgendize.createAccount({

	account:{
			email:"email_of_the_account_2@domain.com",
			password:"password"
		},
		staff:[
		{
			FirstName:"Angelina",
			LastName:"Julie",
			Email:"Angelinajulie@mycompany.com"
		}
		],
		company:{
			name:"My Company"
		},
		services:[{
			name:"Service 1",
			price:30,
			duration:60
		},
		{
			name:"Service 2",
			duration:120,
			price:45
		}],
		buttons:[
		{
			name:'Book an appointment'
		}]
		,
		clients:[
		{
			firstName:'Robert',
			lastName:'Raford',
			address:{
				street:'37-3 Main St, Flushing',
				zipCode:'11354',
				city:'New York',
				country:'United States'
			},
			emailAddresses:[
			{
				primary:true,
				email:'robertraford@example.com'
			}]
		}],
		appointments:[new Date()],
		paymentProfile:0 //ask our support to know this information
	}
	,function(error,result){
		if(error && error instanceof agendize.errors.AgendizeAPI)
			console.log("AgendizeAPI response is "+error.getAgendizeCode());
		else if(error)
			console.log("Agendize Module sent an error "+error);
		else
			console.log("Agendize account is created, here is it: "+result)

	}
);