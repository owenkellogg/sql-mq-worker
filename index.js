/*
  This class is to be a generate poller
  that pops items out of a SQL database
  given a certain query predicate.
*/

function Poller(opts){
  this._Class = opts.Class;
  this._predicate = opts.predicate;
  this._timeout = opts.timeout || 1000;
  this._job = opts.job || function(instance, callback) {
    callback();
  };
}

Poller.prototype = Object.create(Object.prototype);
Poller.prototype.constructor = Poller;

Poller.prototype =  {
  start: function(){
    this._workNextInstance();
  },
  _workNextInstance: function() {
    var self = this;
    self._getInstance(function(error, instance){
      if (error || !instance) {
        return self._loop(self._timeout);
      }
      self._job(instance, self._loop.bind(self));
    }.bind(self));
  },
  _getInstance:  function(callback) {
    var self = this;
    self._Class.find(self._predicate).complete(callback);
  },
  _loop: function(timeout) {
    var self = this;
    if (timeout) {
      setTimeout(self._workNextInstance.bind(self), timeout);
    } else {
      setImmediate(self._workNextInstance.bind(self));
    }
  }
}

module.exports = Poller;

