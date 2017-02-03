'use strict';

module.exports = function InternalError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra?extra:null;
  this.code = 500;
};

require('util').inherits(module.exports, Error);