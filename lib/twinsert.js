var events = require('events');
var util = require('util');
var twitstream = require('twitstream');
var levelAgile = require('level-agile');

module.exports = Twinsert;

util.inherits(Twinsert, events.EventEmitter);

function Twinsert (options) {
  if (!(this instanceof Twinsert)) {
    return new Twinsert(options);
  }
  events.EventEmitter.call(this);

  options = options || {};
  if (!options || !options.twitter) {
    throw new Error('Twitter options must be configured');
  }

  this.twitAuth = options.twitter;

  this.dbOpts = options.db || { host: '127.0.0.1', port: 4444 };
  this.level = levelAgile(this.dbOpts);
  this.level.on('error', this.emit.bind(this, 'error'));

}

Twinsert.prototype.track = function (terms, callback) {
  if (!Array.isArray(terms)) {
    terms = [terms];
  }

  var twits = twitstream({
    auth: this.twitAuth,
    track: terms
  });

  var ws = this.level.writeStream();

  ws.on('error', this.emit.bind(this, 'error'));
  twits.on('data', function (data) {
    console.dir(data);
  });
  //twits.pipe(ws);
  process.nextTick(callback);
};
