process.env.AGENDIZE_MODULE_DEBUG_LEVEL = 3;

var agendize = require('../../../agendize-module');

var serviceAgendize = new agendize({apiKey:"toto",token:"toto"})

serviceAgendize.call(
	{
		button_id:"1234567",
		number:"+15145521259"
	},
	function(error,result){
		if(error && error instanceof agendize.errors.AgendizeAPI)
			// operation failed: do something with the error
			console.log("AgendizeAPI response is "+error.getAgendizeCode());
		else
			// operation succeeded
			console.log("Agendize will soon do the call")
	}
);