var fs = require('fs');
var path = require('path');
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
  var index = fs.createReadStream(path.join(__dirname, '..', 'public', 'index.html'));
  index.pipe(res);
};

Twittery.prototype._onSocketConnect = function (spark) {
  if (!this.stream) {
    this.stream = this.level.liveStream();
  }
  this.stream.pipe(spark);

};

Twittery.prototype._onSocketDisconnect = function (spark) {
  //
  // If its a single stream we only want to kill it if there are no listeners
  //

};
