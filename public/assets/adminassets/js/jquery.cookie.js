// jquery.cookie.js

(function() {
	'use strict';
  
	function loadScript(src, callback) {
	  var s = document.createElement('script');
	  s.src = src;
	  s.onload = callback;
	  s.onerror = function() {
		console.error('Failed to load script:', src);
	  };
	  document.head.appendChild(s);
	}
  
	function init() {
	  (function (factory) {
		if (typeof define === 'function' && define.amd) {
		  // AMD
		  define(['jquery'], factory);
		} else if (typeof exports === 'object') {
		  // CommonJS
		  factory(require('jquery'));
		} else {
		  // Browser globals
		  factory(jQuery);
		}
	  }(function ($) {
  
		var pluses = /\+/g;
  
		function encode(s) {
		  return config.raw ? s : encodeURIComponent(s);
		}
  
		function decode(s) {
		  return config.raw ? s : decodeURIComponent(s);
		}
  
		function stringifyCookieValue(value) {
		  return encode(config.json ? JSON.stringify(value) : String(value));
		}
  
		function parseCookieValue(s) {
		  if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		  }
		  try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		  } catch(e) {}
		}
  
		function read(s, converter) {
		  var value = config.raw ? s : parseCookieValue(s);
		  return $.isFunction(converter) ? converter(value) : value;
		}
  
		var config = $.cookie = function (key, value, options) {
		  if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
  
			if (typeof options.expires === 'number') {
			  var days = options.expires, t = options.expires = new Date();
			  t.setTime(+t + days * 864e+5);
			}
  
			return (document.cookie = [
			  encode(key), '=', stringifyCookieValue(value),
			  options.expires ? '; expires=' + options.expires.toUTCString() : '',
			  options.path    ? '; path=' + options.path : '',
			  options.domain  ? '; domain=' + options.domain : '',
			  options.secure  ? '; secure' : ''
			].join(''));
		  }
  
		  var result = key ? undefined : {};
		  var cookies = document.cookie ? document.cookie.split('; ') : [];
  
		  for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
  
			if (key && key === name) {
			  result = read(cookie, value);
			  break;
			}
  
			if (!key && (cookie = read(cookie)) !== undefined) {
			  result[name] = cookie;
			}
		  }
  
		  return result;
		};
  
		config.defaults = {};
  
		$.removeCookie = function (key, options) {
		  if ($.cookie(key) === undefined) {
			return false;
		  }
		  $.cookie(key, '', $.extend({}, options, { expires: -1 }));
		  return !$.cookie(key);
		};
  
	  }));
	}
  
	// Check if jQuery is loaded
	if (typeof jQuery !== 'undefined') {
	  init();
	} else {
	  // Correct public URL (for Next.js or normal static hosting)
	  loadScript('/assets/adminassets/js/jquery-3.6.0.min.js', init);
	}
  
  })();
  