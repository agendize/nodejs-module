'use strict';

module.exports = function AgendizeAPIError(message, extra,agzCode) {
  Error.captureStackTrace(this, AgendizeAPIError);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra?extra:null;
  this.code = 501;
  this.agendizeResponseCode=agzCode

  this.getAgendizeCode = function(){
  	return agzCode;
  }
  return this;
};

require('util').inherits(module.exports, Error);