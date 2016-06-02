'use strict';

/**
 * Module dependencies.
 */

var alias = require('@segment/alias');
var integration = require('@segment/analytics.js-integration');

/**
 * Expose `Lytics` integration.
 */

var Lytics = module.exports = integration('Lytics')
  .global('jstag')
  .option('cid', '')
  .option('stream', 'default')
  .option('cookie', 'seerid')
  .option('delay', 2000)
  .option('sessionTimeout', 1800)
  .option('url', '//c.lytics.io')
  .tag('<script src="https://c.lytics.io/api/tag/{{ cid }}/lio.js">');

/**
 * Options aliases.
 */

var aliases = {
  sessionTimeout: 'sessecs'
};

/**
 * Initialize.
 *
 * http://admin.lytics.io/doc#jstag
 *
 * @api public
 */

Lytics.prototype.initialize = function() {
  var options = alias(this.options, aliases);
  /* eslint-disable */
  window.jstag = function() {var t = {_q: [], _c: options, ts: (new Date).getTime() }, e = !1, i = (window, document), n = "/static/io", s = ".min.js", r = Array.prototype.slice, a = "//c.lytics.io", c = "//c.lytics.io", o = "io"; return t.init = function(e) {return c = e.url || c, s = e.min === !1 ? ".js" : s, o = e.tag || o, t._c = e, this }, t.load = function() {var t, r = i.getElementsByTagName("script")[0]; return e = !0, i.getElementById(n) ? this : (t = i.createElement("script"), n = a + "/static/" + o + s, t.id = n, t.src = n, r.parentNode.insertBefore(t, r), this) }, t.bind = function(t) {e || this.load(), this._q.push([t, r.call(arguments, 1)]) }, t.ready = function() {e || this.load(), this._q.push(["ready", r.call(arguments)]) }, t.send = function() {return e || this.load(), this._q.push(["ready", "send", r.call(arguments)]), this }, t }();
  /* eslint-enable */
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

Lytics.prototype.loaded = function() {
  return !!(window.jstag && window.jstag.bind);
};

/**
 * Page.
 *
 * @api public
 * @param {Page} page
 */

Lytics.prototype.page = function(page) {
  window.jstag.send(this.options.stream, page.properties({
    name: '_e'
  }));
};

/**
 * Idenfity.
 *
 * @api public
 * @param {Identify} identify
 */

Lytics.prototype.identify = function(identify) {
  window.jstag.send(this.options.stream, identify.traits({
    id: 'user_id'
  }));
};

/**
 * Track.
 *
 * @api public
 * @param {Track} track
 */

Lytics.prototype.track = function(track) {
  var props = track.properties();
  props._e = track.event();
  window.jstag.send(this.options.stream, props);
};
