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
 * The logger provides a simple wrapper to the console but with some added benefits like checking for console
 * availability and parametrized variable substitution in logging messages using array notation or JSON objects:
 *
 * The output for the logger looks like:
 *
 * HH:MM:SS:SSS LEVEL [context or className] - message
 *
 * Variable substitution with tokens is achieved with:
 *
 * logger.debug("execute: first = {0}, last = {1}", [first, last]);
 *
 * OR
 *
 * logger.debug("execute: name = {name}, last = {foo.bar}", { first:"john doe", foo: { bar:"foo-bar" } });
 *
 * The logger does not currently allow you to edit the formatted output or filter by log level or category.
 */
Ext.define("FlowMVC.logger.Logger", {

	statics: {

		/**
		 * {Boolean} isEnabled Global flag indicating if logging is enabled.
		 */
		isEnabled: true,

		/**
		 * {String} LEVEL_LOG A constant. Indicates the "log" logging level.
		 */
		LEVEL_LOG: "LOG",

		/**
		 * {String} LEVEL_DEBUG A constant. Indicates the "debug" logging level.
		 */
		LEVEL_DEBUG: "DEBUG",

		/**
		 * {String} LEVEL_INFO A constant. Indicates the "info" logging level.
		 */
		LEVEL_INFO: "INFO",

		/**
		 * {String} LEVEL_WARN A constant. Indicates the "warn" logging level.
		 */
		LEVEL_WARN: "WARN",

		/**
		 * {String} LEVEL_ERROR A constant. Indicates the "error" logging level.
		 */
		LEVEL_ERROR: "ERROR",

		/**
		 * {String} LEVEL_FATAL A constant. Indicates the "fatal" logging level.
		 */
		LEVEL_FATAL: "FATAL",

		/**
		 * Creates a logger that outputs the following format:
		 *
		 * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = a, password = a
		 *
		 * @param {String} context The string name used for the logger. This is often the class name of the object the
		 * logger is used in.
		 * @returns {FlowMVC.logger.Logger} A FlowMVC logger.
		 */
		getLogger: function(context) {
			var logger;

			if (typeof context != "string") {
				context = Ext.getClassName(context);
			}

			if ((context == null) || (context == "undefined") || (context == "")) {
				context = "Unknown Context";
			}

			return Ext.create("FlowMVC.logger.Logger", context);
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
		 * @returns {{fn: Function, singleton: boolean}}
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
	 * {String} context String name to be used when logging; typically this is the client object's fully-qualified name.
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
	 * Creates a print-friendly context in the form of [{context}] for logging purposes.
	 *
	 * @return {String} A context in the form of [{context}].
	 */
	getContext: function() {
		return "[" + this.context + "]";
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
		return this.getTimestamp() + " " + level + "\t" + this.getContext() + " - " + msg;
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

		var msg = this.getPrintFriendlyLogStatement(level, args[0]);

		if(args && (args.length >= 2)) {

			var tokenValues = args[1];

			// do substitution of tokens with the passed in array of values
			if (Ext.isArray(tokenValues)) {
				var len = tokenValues.length;
				for (var i = 0; i < len; i++) {
					msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), tokenValues[i]);
				}

			// do substitution of tokens using the passef in JSON object
			} else if (Ext.isObject(tokenValues)) {
				var tokens = msg.match(/\{(.*?)\}/g);
				if(Ext.isArray(tokens)) {
					var token;
					var properties;
					var value;
					var len = tokens.length;

					for (var j = 0; j < len; j++) {

						// TODO: Stop being lazy and use some regex
						token = tokens[j].replace("{", "");
						token = token.replace("}", "");
						properties = token.split(".");

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
		}

		// determine the log level and log to the console accordingly
		// TODO: Might want to consider using Ext.Logger() or something that fixes console logging with IE
		switch (level) {
			case FlowMVC.logger.Logger.LEVEL_INFO:
				try {
					if(window.console && console.info && Ext.isFunction(console.info)) {
						console.info(msg);
					}
				} catch (e) {
				}
				break;

			case FlowMVC.logger.Logger.LEVEL_WARN:
				try {
					if(window.console && console.warn && Ext.isFunction(console.warn)) {
						console.warn(msg);
					}
				} catch (e) {
				}
				break;

			case FlowMVC.logger.Logger.LEVEL_ERROR:
			case FlowMVC.logger.Logger.LEVEL_FATAL:
				try {
					if(window.console && console.error && Ext.isFunction(console.error)) {
						console.error(msg);
					}
				} catch (e) {
				}
				break;

			case FlowMVC.logger.Logger.LEVEL_LOG:
			case FlowMVC.logger.Logger.LEVEL_DEBUG:
			default:
				try {
					if(window.console && console.debug && Ext.isFunction(console.debug)) {
						console.debug(msg);
					}
				} catch (e) {
				}
				break;
		}

	}

});
