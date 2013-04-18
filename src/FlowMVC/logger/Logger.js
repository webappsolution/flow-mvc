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
 * The logger is a wrapper to the Log4JavaScript logger and serves 2 purposes:
 *
 * 1) It's configured with a standard Log4J (java) type configuration.
 * 2) It has a simple accessor method that wraps the logger as a factory so it's easily injected into client objects
 * with a reference to the client instance, allowing the console ouput to contain the client object name without
 * additional configuration.
 */

/*
 Jesse, can you create a logger that wraps the Ext Logger but outputs a format like:

 15:52:41:130 DEBUG [FlowMVC.mvc.event.AbstractEvent] - AbstractEvent.Constructor: type = flowMVCEvent

 thinking the following:
 1) easy way to use like log4j with timestamp syntax
 2) easy config that pulls in class it's using as part of the log msg -- can probably just reuse the stuff I have our Logger.getLogge() method now.
 3) ability to add json vars to tokens; eg

 logger.debug("execute: first = {0}, last = {1}", [first, last]);

 OR

 logger.debug("execute: first = {first}, last = {last}", { "first":first, "last":last });
 */
Ext.define("FlowMVC.logger.Logger", {

	statics: {

		LOG:    "LOG",
		DEBUG:  "DEBUG",
		INFO:   "INFO",
		WARN:   "WARN",
		ERROR:  "ERROR",
		FATAL:  "FATAL",

		/**
		 * {Boolean} isEnabled Global flag indicating if logging is enabled.
		 */
		isEnabled: true,

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

			if ( (context == null) || (context == "undefined") || (context == "")) {
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
	 * Creates a print-friendly timestamp in the form of 16:11:45:956 for logging purposes.
	 *
	 * @return {String} A timestamp in the form of 16:11:45:956.
	 */
	getTimestamp: function() {

		var date            = new Date();
		var hours           = date.getHours();
		var minutes         = date.getMinutes();
		var seconds         = date.getSeconds();
		var milliseconds    = date.getMilliseconds();

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
	 * Determines the log level and logs to the console accordingly. Can take tokenized log messages and substitute
	 * values passed into the logging method.
	 *
	 * @param {String} level The logging level.
	 * @param {Array} args An array of logging arguments. The first argument is typically the message and the following
	 * can be used in log message token substitution.
	 */
	internalLog: function(level, args) {

		var msg = this.getPrintFriendlyLogStatement(level, args[0]);
		var len = args.length;

		// replace any tokens in the msg
		if ( (typeof args != "array") && (args.length > 1) ) {
			for (var i = 0; i < len; i++)
			{
				msg = msg.replace(new RegExp("\\{"+i+"\\}", "g"), args[i+1]);
			}
		}

		// do not log anything if logging is not enabled
		if(!FlowMVC.logger.Logger.isEnabled) {
			return;
		}

		// determine the log level and log to the console accordingly
		switch (level) {
			case FlowMVC.logger.Logger.INFO:
				try {
					console.info(msg);
				} catch (e) {
				}
				break;
			case FlowMVC.logger.Logger.WARN:
				try {
					console.warn(msg);
				} catch (e) {
				}
				break;
			case FlowMVC.logger.Logger.ERROR:
			case FlowMVC.logger.Logger.FATAL:
				try {
					console.error(msg);
				} catch (e) {
				}
				break;

			case FlowMVC.logger.Logger.LOG:
			case FlowMVC.logger.Logger.DEBUG:
			default:
				try {
					console.debug(msg);
				} catch (e) {
				}
				break;
		}

	},

	/**
	 * Provides logging with a level of "log".
	 */
	log: function() {
		this.internalLog(FlowMVC.logger.Logger.LOG, arguments);
	},

	/**
	 * Provides logging with a level of "debug".
	 */
	debug: function() {
		this.internalLog(FlowMVC.logger.Logger.DEBUG, arguments);
	},

	/**
	 * Provides logging with a level of "info".
	 */
	info: function() {
		this.internalLog(FlowMVC.logger.Logger.INFO, arguments);
	},

	/**
	 * Provides logging with a level of "warn".
	 */
	warn: function() {
		this.internalLog(FlowMVC.logger.Logger.WARN, arguments);
	},

	/**
	 * Provides logging with a level of "error".
	 */
	error: function() {
		this.internalLog(FlowMVC.logger.Logger.ERROR, arguments);
	},

	/**
	 * Provides logging with a level of "fatal".
	 */
	fatal: function() {
		this.internalLog(FlowMVC.logger.Logger.FATAL, arguments);
	}

});
