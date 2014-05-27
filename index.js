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

  getInstance:  function(callback) {
    this._Class.find(this._predicate).complete(function(err, instance) {
      if (err) {
        callback(err); 
      } else if (instance) {
        callback(null, instance);
      } else {
        callback('no instance found');
      }
   });
  },
  
  workNextInstance: function(callback) {
    this.getInstance(function(err, instance){
      if (err) {
        setTimeout(function() {
          callback(callback);
        }, this.timeout); return;
      }
      this._job(instance, function(err, workedInstance){
        if (err){
          setTimeout(function() {
            callback(callback);
          }, this.timeout); return;
        } else {
          callback(callback);
        }
      }.bind(this));
    }.bind(this));
  },

  start: function(){
    this.workNextInstance(this.workNextInstance.bind(this));
  }

}

module.exports = Poller;

