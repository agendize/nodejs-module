'use strict';

module.exports = function AgendizeAPIError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra?extra:null;
  this.code = 501;
};

require('util').inherits(module.exports, Error);