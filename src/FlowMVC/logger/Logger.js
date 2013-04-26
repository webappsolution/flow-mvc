/*
 Copyright (c) 2013 [Web App Solution, Inc.](mailto:admin@webappsolution.com)

 FlowMVC is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 FlowMVC is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with FlowMVC.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This is a simple, one-class logger that attempts to do the bare minimum required for logging without a ton
 * of bells and whistles; simply put, this logger offers console logging as the only target, filtering by context
 * and leg-level, and a fixed output that's non-configurable. There are many other logging libraries that support this
 * type of advanced logging support: [log4javascript](http://log4javascript.org/), [log4js-ext](https://code.google.com/p/log4js-ext/)
 * and so on.
 *
 * The logger provides a simple wrapper to the console but with some added benefits like checking for console
 * availability and parametrized variable substitution in logging messages using array or JSON notation as
 * the second parameter to the log statement. The output for the logger looks like:
 *
 * HH:MM:SS:SSS LEVEL [context or className] - message
 *
 * A fully backed example log message might look like:
 *
 * 22:07:44:968 DEBUG	[FlowMVC.mvc.event.AbstractEvent] - AbstractEvent.Constructor: type = flowMVCEvent
 *
 * Variable substitution with tokens is achieved with arrays:
 *
 * logger.debug("execute: first = {0}, last = {1}", [first, last]);
 *
 * OR with JSON:
 *
 * logger.debug("execute: name = {name}, last = {foo.bar}", { first:"john doe", foo: { bar:"foo-bar" } });
 */
Ext.define("FlowMVC.logger.Logger", {

	statics: {

		/**
		 * @property {Boolean} isEnabled Global flag indicating if logging is enabled.
		 * @static
		 */
		isEnabled: true,

		/**
		 * @property {Object} filters An associative array or hash of all the logging filters.
		 * @static
		 */
		filters: null,

		/**
		 * @property {Boolean} isEnabled Global flag indicating if logging is enabled.
		 * @static
		 */
		level: 0,

		/**
		 * @property {String} LEVEL_LOG A constant. Indicates the "log" logging level.
		 * @static
		 */
		LEVEL_ALL: 0,

		/**
		 * @property {String} LEVEL_LOG A constant. Indicates the "log" logging level.
		 * @static
		 */
		LEVEL_LOG: 2,

		/**
		 * @property {String} LEVEL_DEBUG A constant. Indicates the "debug" logging level.
		 * @static
		 */
		LEVEL_DEBUG: 4,

		/**
		 * @property {String} LEVEL_INFO A constant. Indicates the "info" logging level.
		 * @static
		 */
		LEVEL_INFO: 6,

		/**
		 * @property {String} LEVEL_WARN A constant. Indicates the "warn" logging level.
		 * @static
		 */
		LEVEL_WARN: 8,

		/**
		 * @property {String} LEVEL_ERROR A constant. Indicates the "error" logging level.
		 * @static
		 */
		LEVEL_ERROR: 10,

		/**
		 * @property {String} LEVEL_FATAL A constant. Indicates the "fatal" logging level.
		 * @static
		 */
		LEVEL_FATAL: 1000,

		/**
		 * Creates a logger that outputs the following format:
		 *
		 * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = a, password = a
		 *
		 * @param {String} context The string name used for the logger. This is often the class name of the object the
		 * logger is used in.
		 * @returns {FlowMVC.logger.Logger} A FlowMVC logger.
		 * @static
		 */
		getLogger: function(context) {
			if(!Ext.isString(context)) {
				context = Ext.getClassName(context);
			}

			if ((context == null) || (context == "undefined") || (context == "")) {
				context = "Unknown Context";
			}

			return Ext.create("FlowMVC.logger.Logger", context);
		},

		/**
		 * Adds an acceptable filter to the list of log statements that are acceptable.
		 *
		 * @param {String} filter The filter to add.
		 * @static
		 */
		addFilter: function(filter) {
			if(FlowMVC.logger.Logger.filters == null) {
				FlowMVC.logger.Logger.filters = {};
			}
			FlowMVC.logger.Logger.filters[filter] = filter;
		},

		/**
		 * Removes a filter from the list of log statements that are acceptable.
		 *
		 * @param {String} filter The filter to remove.
		 * @static
		 */
		removeFilter: function(filter) {
			if(FlowMVC.logger.Logger.filters != null) {
				delete FlowMVC.logger.Logger.filters[filter];
			}
		},

		/**
		 * Sets the log level. Only allows logging to the console >= the current level set.
		 *
		 * @param {Number} level The log level.
		 * @static
		 */
		setLevel: function(level) {
			FlowMVC.logger.Logger.level = level;
		},

		/**
		 * Returns an object of the logger as a factory so it can be injected into client objects. The factory is used
		 * so we can use the reference to the instance of the object it's injected into, thus allowing log messages
		 * to take the following format:
		 *
		 * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = a, password = a
		 *
		 * The use of the singleton property of the returned object ensures that the logger is unique and created
		 * for each injection, again allowing the logger to gain a reference to the instance it's injected into.
		 *
		 * @returns {{fn: Function, singleton: Boolean}}
		 * @static
		 */
		getInjectableLogger: function() {

			return {
				// The factory function will be passed a single argument:
				// The object instance that the new object will be injected into
				// NOTE: the factory function for DeftJS must be named "fn"
				fn: function(instance) {
					return FlowMVC.logger.Logger.getLogger(instance);
				},
				singleton: false
			}
		}
	},

	/**
	 * @property {String} context String name to be used when logging; typically this is the client object's
	 * fully-qualified name.
	 */
	context: null,

	/**
	 * Constructor.
	 *
	 * @param {String} context The context is a string indicator used when logging with this logger;
	 * often times this is the class name of the client object using this logger.
	 */
	constructor: function(context) {
		this.context = context;
	},

	/**
	 * Provides logging with a level of "log".
	 */
	log: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_LOG, arguments);
	},

	/**
	 * Provides logging with a level of "debug".
	 */
	debug: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_DEBUG, arguments);
	},

	/**
	 * Provides logging with a level of "info".
	 */
	info: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_INFO, arguments);
	},

	/**
	 * Provides logging with a level of "warn".
	 */
	warn: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_WARN, arguments);
	},

	/**
	 * Provides logging with a level of "error".
	 */
	error: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_ERROR, arguments);
	},

	/**
	 * Provides logging with a level of "fatal".
	 */
	fatal: function() {
		this.internalLog(FlowMVC.logger.Logger.LEVEL_FATAL, arguments);
	},

	/**
	 * Provides log grouping.
	 */
	group: function() {
		try {
			if(window.console && console.group && Ext.isFunction(console.group)) {
				console.group(msg);
			}
		} catch (e) {
		}
	},

	/**
	 * Ends log grouping.
	 */
	groupEnd: function() {
		try {
			if(window.console && console.groupEnd && Ext.isFunction(console.groupEnd)) {
				console.groupEnd(msg);
			}
		} catch (e) {
		}
	},

	/**
	 * Creates a print-friendly timestamp in the form of 16:11:45:956 for logging purposes.
	 *
	 * @return {String} A timestamp in the form of 16:11:45:956.
	 */
	getTimestamp: function() {

		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var milliseconds = date.getMilliseconds();

		if (hours < 10) {
			hours = "0" + hours;
		}

		if (minutes < 10) {
			minutes = "0" + minutes;
		}

		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		if (milliseconds < 10) {
			milliseconds = "00" + milliseconds;
		} else if (milliseconds < 100) {
			milliseconds = "0" + milliseconds;
		}

		return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
	},

	/**
	 * A simple method that returns the log level as a printable string.
	 *
	 * @param {Number} level The log level.
	 * @returns {String} The printable log level message.
	 */
	getPrintableLogMessage: function(level) {
		switch(level)
		{
			case FlowMVC.logger.Logger.LEVEL_DEBUG:
				return "[DEBUG]";

			case FlowMVC.logger.Logger.LEVEL_INFO:
				return "[INFO] ";

			case FlowMVC.logger.Logger.LEVEL_WARN:
				return "[WARN] ";

			case FlowMVC.logger.Logger.LEVEL_ERROR:
				return "[ERROR]";

			case FlowMVC.logger.Logger.LEVEL_FATAL:
				return "[FATAL]";

			case FlowMVC.logger.Logger.LEVEL_LOG:
			default:
				return "[LOG]  ";
		}
	},

	/**
	 * Creates a print-friendly context in the form of
	 * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = {a}, password = {b}
	 * for logging purposes, where {a} and {b} are tokenized parameters passed into the logging method.
	 *
	 * @return {String} A context in the form of 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController]
	 * - login: username = {a}, password = {b}.
	 */
	getPrintFriendlyLogStatement: function(level, msg) {
		msg = (msg == "undefined") || (msg == null) ? "" : msg;
		return this.getTimestamp() + " " + this.getPrintableLogMessage(level) + " " + this.context + " - " + msg;
	},

	/**
	 * Determines if the token value object (second parameter in the original log function) is an array or object
	 * and attempts to perform token substitution based on the valuers in the array or JSON object. Tokens in the
	 * message either looks like {0}, {1}, ... {n} for array substitution or {user.username}, {firstName} for
	 * JSON substitution.
	 *
	 * @return {String} The final message with tokens replaced with values.
	 */
	replaceTokens: function(args, msg) {
		var tokenValues = args[1];

		// do substitution of tokens with the passed in array of values
		if (Ext.isArray(tokenValues)) {
			var len = tokenValues.length;
			for (var i = 0; i < len; i++) {
				msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), tokenValues[i]);
			}

		// do substitution of tokens using the passed in JSON object
		} else if (Ext.isObject(tokenValues)) {
			var tokens = msg.match(/\{(.*?)\}/g);
			if(Ext.isArray(tokens)) {

				var value = "";
				var len = tokens.length;

				// loop through all the tokens and repalace them with values from the JSON object
				for (var j = 0; j < len; j++) {

					// replace the brackets for "{user.username}" becomes "user.username"
					var token = tokens[j].replace(/\{(.*?)\}/g,"$1");
					// create an array of all the tokens
					var properties = token.split(".");

					// nested function to dig down into a JSON object and grab the actual value of the nested property
					// allows for the retrieval of a json object like foo.bar.count.
					getNestedValue = function(tokenValues, properties) {

						var property = "";
						var len = properties.length;
						for (var j = 0; j < len; j++) {
							property = properties[j];
							tokenValues = tokenValues[property];
						}
						return tokenValues;
					}

					try {
						value = getNestedValue(tokenValues, properties);
					} catch(e) {
						value = "";
					};

					msg = msg.replace(new RegExp(tokens[j]), value);
				}
			}
		}

		return msg;
	},

	/**
	 * Determines if the log message contains a context that matches one of the acceptable log filters.
	 *
	 * @param {String} msg The entire log message to search for a matching filter.
	 * @returns {Boolean} A flag indicating if the message contains an acceptable log filter.
	 */
	isFilterEnabled: function(msg) {
		var filterRef = FlowMVC.logger.Logger.filters;
		if(filterRef == null) {
			filterRef = {};
			filterRef["*"] = "*";
		}
		if(filterRef["*"] != null) {
			return true;
		}

		for(var filter in filterRef) {
			var lastChar = filter.charAt(filter.length-1);
			if(lastChar == "*") {
				filter = filter.slice(0, -1);
			}
			if(msg.indexOf(filter) != -1) {
				return true;
			}
		}

		return false;
	},

	/**
	 * @private Determines the log level and logs to the console accordingly. Can take tokenized log messages and substitute
	 * values passed into the logging method.
	 *
	 * @param {String} level The logging level.
	 * @param {Array} args An array of logging arguments. The first argument is typically the message and the following
	 * can be used in log message token substitution.
	 */
	internalLog: function(level, args) {

		// do not log anything if logging is not enabled
		if (!FlowMVC.logger.Logger.isEnabled) {
			return;
		}

		// determine if the level requested is greater or equal to the current log level
		if(level < FlowMVC.logger.Logger.level) {
			return;
		}

		// get the console print friendly message
		var msg = this.getPrintFriendlyLogStatement(level, args[0]);

		// filter out the acceptable logging statements so it only shows contexts that exist in the filter list
		if(!this.isFilterEnabled(msg)) {
			return;
		}

		// determine if the message has parametrized tokens
		if(args && (args.length >= 2)) {
			msg = this.replaceTokens(args, msg);
		}

		// determine the log level and log to the console accordingly
		switch (level) {
			case FlowMVC.logger.Logger.LEVEL_INFO:
				this.logToConsole("info", msg);
				break;

			case FlowMVC.logger.Logger.LEVEL_WARN:
				this.logToConsole("warn", msg);
				break;

			case FlowMVC.logger.Logger.LEVEL_ERROR:
			case FlowMVC.logger.Logger.LEVEL_FATAL:
				this.logToConsole("error", msg);
				break;

			case FlowMVC.logger.Logger.LEVEL_LOG:
			case FlowMVC.logger.Logger.LEVEL_DEBUG:
			default:
				this.logToConsole("debug", msg);
				break;
		}

	},

	/**
	 * @private Internal method that determines if the console logging method is available -- if so, print to the console.
	 *
	 * @param {Function} method The request console logging method.
	 * @param {String} msg The message to log to the console.
	 */
	logToConsole: function(method, msg) {
		try {
			if(this.isConsoleMethodAvailable(method)) {
				console[method](msg);
			}
		} catch (e) {
		}
	},

	/**
	 * @private Determines if the requested console logging method is available, since it is not with IE.
	 *
	 * @param {Function} method The request console logging method.
	 * @returns {Boolean} Indicates if the console logging method is available.
	 */
	isConsoleMethodAvailable: function(method) {
		return window.console && console[method] && Ext.isFunction(console[method]);
	}

});
