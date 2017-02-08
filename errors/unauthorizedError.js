'use strict';

module.exports = function UnauthorizedError(message, extra) {
	var er = new Error;
  Error.captureStackTrace(er, er.constructor);
  er.name = this.constructor.name;
  er.message = message;
  er.extra = extra?extra:null;
  er.code = 403;

};

require('util').inherits(module.exports, Error);