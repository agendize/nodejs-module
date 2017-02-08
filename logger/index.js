var winston = require('winston'); 

var logger = new winston.Logger({
    level: 'debug',
     transports: [
      new (winston.transports.Console)()
      ]
});


var LoggerObj = function(num,str){
	this.num = num;
	this.str = str;
}

module.exports.log = function log(level,message){
	var moduleLevel = process.env.AGENDIZE_MODULE_DEBUG_LEVEL;
	if(level.num >= moduleLevel)
		logger[level.str]("Agendize ("+level.str+"): "+message);
}

module.exports.LEVEL_DEBUG = new LoggerObj(0,'debug')
module.exports.LEVEL_INFO = new LoggerObj(1,'info')
module.exports.LEVEL_WARN = new LoggerObj(2,'warn')
module.exports.LEVEL_ERROR = new LoggerObj(3,'error')