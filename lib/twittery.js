var events = require('events');
var http = require('http');
var util = require('util');
var Primus = require('primus');
var levelAgile = require('level-agile');

module.exports = Twittery;

util.inherits(Twittery, events.EventEmitter);

function Twittery (options) {
  if (!(this instanceof Twittery)) {
    return new Twittery(options);
  }
  events.EventEmitter.call(this);

  options = options || {};

  this.dbOpts = options.db || { host: '127.0.0.1', port: 4444 };
  this.level = levelAgile(this.dbOpts);
  this.level.on('error', this.emit.bind(this, 'error'));

  this.server = http.createServer(this._requestHandler.bind(this));
  this.primus = new Primus(this.server);

  this.primus.on('connection', this._onSocketConnect.bind(this));
  this.primus.on('disconnection', this._onSocketDisconnect.bind(this));

}

Twittery.prototype.listen = function (port, callback) {
  this.server.listen(port, callback);
};

Twittery.prototype._requestHandler = function (req, res) {
  res.writeHead(500);
  res.end('Not Implemented\n');
};

Twittery.prototype._onSocketConnect = function (spark) {
  var stream = this.level.readStream();

  stream.pipe(spark);

};

Twittery.prototype._onSocketDisconnect = function (spark) {

};