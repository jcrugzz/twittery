var events = require('events');
var util = require('util');
var Transform = require('stream').Transform;
var twitstream = require('twitstream');
var timestamp = require('monotonic-timestamp');
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
  twits.on('error', this.emit.bind(this, 'error'));

  var ws = this.level.writeStream();

  ws.on('error', this.emit.bind(this, 'error'));

  twits
    .pipe(this.transform())
    .pipe(ws);

  process.nextTick(callback);
};

//
// This should be its own module but meh for now
// This gives the twitter stream proper keys to be read sequentially
//
Twinsert.prototype.transform = function () {
  var transform = new Transform({ objectMode: true });

  transform._transform = function (chunk, encoding, done) {
    var time = timestamp();
    chunk = {
      key: time,
      value: chunk
    };
    transform.push(chunk);
    done();
  };

  return transform;
};

