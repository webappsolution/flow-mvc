/*!
FlowMVC 0.1.0

Copyright (c) 2013 [Web App Solution, Inc.](http://webappsolution.com)
Open source under the [GNU General Public License](http://www.gnu.org/licenses).
*/

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
 * of bells and whistles; simply put, this logger offers console logging as the only target, no filtering by context
 * or leg-level, and a fixed output that's not configurable. There are many other logging libraries that support this
 * type of advanced logging support: log4javascript http://log4javascript.org/, log4js-ext https://code.google.com/p/log4js-ext/
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

			if(!Ext.isString(context)) {
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
	 * Creates a print-friendly context in the form of
	 * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = {a}, password = {b}
	 * for logging purposes, where {a} and {b} are tokenized parameters passed into the logging method.
	 *
	 * @return {String} A context in the form of 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController]
	 * - login: username = {a}, password = {b}.
	 */
	getPrintFriendlyLogStatement: function(level, msg) {
		return this.getTimestamp() + " " + level + "\t" + "[" + this.context + "]" + " - " + msg;
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

		// get the console print friendly message
		var msg = this.getPrintFriendlyLogStatement(level, args[0]);

		// determine if the message has parametrized tokens
		if(args && (args.length >= 2)) {
			msg = this.replaceTokens(args, msg);
		}

		// determine the log level and log to the console accordingly
		// TODO: Might want to consider using Ext.Logger() or something that handles console logging with IE
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
 * Contains utilities to create unique IDs.
 */
Ext.define("FlowMVC.util.UIDUtil", {

    statics: {

        /**
         * Create and return a "version 4" RFC-4122 UUID string.
         *
         * randomUUID.js - Version 1.0
         *
         * Copyright 2008, Robert Kieffer
         *
         * This software is made available under the terms of the Open Software License
         * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
         *
         * The latest version of this file can be found at:
         * http://www.broofa.com/Tools/randomUUID.js
         *
         * For more information, or to comment on this, please go to:
         * http://www.broofa.com/blog/?p=151
         *
         * @return {String} A unique ID in the form of C4A56B5B-AC4B-46FB-AE7D-BAF45154A95E.
         */
        randomUUID: function() {
            var s = [], itoh = '0123456789ABCDEF';

            // Make array of random hex digits. The UUID only has 32 digits in it, but we
            // allocate an extra items to make room for the '-'s we'll be inserting.
            for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

            // Conform to RFC-4122, section 4.4
            s[14] = 4;  // Set 4 high bits of time_high field to version
            s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

            // Convert to hex chars
            for (var j = 0; j <36; j++) s[j] = itoh[s[j]];

            // Insert '-'s
            s[8] = s[13] = s[18] = s[23] = '-';

            return s.join('');
        }
    }
});

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
 * The main purpose of this class is to provide loosely coupled object communication by wrapping
 * the application-level event bus using simple, helper methods for adding, removing, and dispatching events:
 *
 * addGlobalEventListener(type, handler, scope)
 * dispatchGlobalEvent(event, args)
 * removeGlobalEventListener()
 */
Ext.define("FlowMVC.mvc.event.EventDispatcher", {
    extend: "Ext.util.Observable",

	statics: {

		/**
		 * The logger for the object.
		 */
		logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.event.EventDispatcher")
	},

    /**
     * Allows for inter-controller communication by dispatching events on the application-level event bus.
     *
     * Wrapper method for <code>this.getApplication().fireEvent(eventName, args);</code>
     *
     * ## Example
     *
     * var evt = Ext.create("CafeTownsend.event.AuthenticationEvent", CafeTownsend.event.AuthenticationEvent.LOGIN, username, password);
     * this.dispatchGlobalEvent(evt);
     *
     * @param {FlowMVC.mvc.event.AbstractEvent/Object/String} event The event object to fire containing
     * a property called 'type' or a string representing the event name or type.
     * @param {Object...} args Variable number of parameters are passed to handlers. Optional and not usually used if
     * dispatching an event that subclasses FlowMVC.mvc.event.AbstractEvent.
     * @return {Boolean} Returns `false` if any of the handlers return `false`, otherwise it returns `true`.
     */
    dispatchGlobalEvent: function(event, args) {

        if(event.type != null) {
            type = event.type;
            args = event;
        } else {
            type = event;
        }

        FlowMVC.mvc.event.EventDispatcher.logger.debug("dispatchGlobalEvent: " + type);
        return this.fireEvent(type, args);
    },

    /**
     * Creates an event handler for a given event dispatched on the application-level event bus. Facilitates
     * inter-controller communication.
     *
     * ## Example
     *
     * this.addGlobalEventListener(CafeTownsend.event.AuthenticationEvent.LOGIN, this.onLogin, this);
     *
     * @param {String/String[]/Object} type The name or type of the event to listen for. May also be an object who's property names are
     * event names. If the event being dispatched extends FlowMVC.mvc.event.AbstractEvent, the types for the event
     * should be defined as static properties of the event itself.
     * @param {Function} handler The name or type of the event to listen for. May also be an object who's property names are
     * event names.
     * @param {Object} scope This one is important so the handler fires in the correct scope.
     */
    addGlobalEventListener: function(type, handler, scope) {
        FlowMVC.mvc.event.EventDispatcher.logger.debug("addGlobalEventListener: " + type);

        this.addListener(type, handler, scope);

        // both of these work as well
//      this.addListener(type, handler, scope);
//      this.on(eventName);
    },

    /**
     * Removes an event handler for a given event dispatched on the application-level event bus.
     *
     * ## Example
     *
     * this.removeGlobalEventListener(CafeTownsend.event.AuthenticationEvent.LOGIN, this.onLogin, this);
     *
     * @param {String/String[]/Object} type The name or type of the event to listen for. May also be an object who's property names are
     * event names. If the event being dispatched extends FlowMVC.mvc.event.AbstractEvent, the types for the event
     * should be defined as static properties of the event itself.
     * @param {Function} handler The name or type of the event to listen for. May also be an object who's property names are
     * event names.
     * @param {Object} scope This one is important so the handler fires in the correct scope.
     */
    removeGlobalEventListener: function(type, handler, scope) {
        FlowMVC.mvc.event.EventDispatcher.logger.debug("removeGlobalEventListener");

        this.removeListener(type, handler, scope)
    }

});

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
 * The base event used for all application-level event bus messaging; the type property defines the event name
 * or type that drives the event dispatching.
 */
Ext.define("FlowMVC.mvc.event.AbstractEvent", {

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.event.AbstractEvent"),

        /**
         * {String} ERROR_TYPE_MUST_BE_VALID_STRING An error string indicating that the constructor type parameter
         * cannot be be null or an empty string.
         */
        ERROR_TYPE_MUST_BE_VALID_STRING: "The constructor parameter 'type' cannot be null or an empty string."
    },

    /**
     * {String} type The event type or string name of the event; this is the token client objects subscribe to
     * when listening for application-level events.
     */
    type: "",

    /**
     * {Object} data A generic data property for any event.
     */
    data: null,

    /**
     * Constructor.
     *
     * sets the event type for the event; type must be a non-empty string.
     *
     * @param {String} type The event type or string name of the event; this is the token client objects subscribe to
     * when listening for application-level events.
     */
    constructor: function(type) {
        if( (type == null) || (type == "") || (typeof type !== "string") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.event.AbstractEvent.ERROR_TYPE_MUST_BE_VALID_STRING
            });
        }
        FlowMVC.mvc.event.AbstractEvent.logger.debug("AbstractEvent.Constructor: type = {type}", { type:type });
        this.type = type;
    }
});/*
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
 * Contains a reference to a {FlowMVC.mvc.service.rpc.Responder}, an object making an asynchronous service call. The
 * AsyncToken then appliers the success and failure callback methods to the service by inspecting and using the
 * methods defined in the Responder object.
 */
Ext.define("FlowMVC.mvc.service.rpc.AsyncToken", {

    requires: [
        "FlowMVC.util.UIDUtil"
    ],

	statics: {

		/**
		 * The logger for the object.
		 */
		logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.rpc.AsyncToken")
	},

    /**
     * {String} id The unique ID of the token.
     */
    id: null,

    /**
     * {FlowMVC.mvc.service.rpc.Responder/Object} responder The object that contains success and failure methods
     * used for asynchronous service callbacks.
     */
    responder: null,

    /**
     * The constructor creates a AsyncToken object with a success and failure method reference, as well as
     * scope reference to the object that creates it.
     */
    constructor: function()
    {
	    FlowMVC.mvc.service.rpc.AsyncToken.logger.debug("constructor");
        this.id = FlowMVC.util.UIDUtil.randomUUID();
    },

    /**
     * Adds a responder to this token.
     *
     * @param {FlowMVC.mvc.service.rpc.Responder} responder The object that contains success and failure methods
     * used for asynchronous service callbacks.
     */
    addResponder: function(responder) {
	    FlowMVC.mvc.service.rpc.AsyncToken.logger.debug("addResponder");
        this.responder = responder;
    },

    /**
     * Applies the successful callback of the asynchronous action on the responder's defined success method passing
     * it the response parameter from the action.
     *
     * @param {Object} response The data object returned from the success of the asynchronous action.
     */
    applySuccess: function(response) {
	    FlowMVC.mvc.service.rpc.AsyncToken.logger.debug("applySuccess");

	    if(this.responder) {
		    this.applyCallback(this.responder.success, this.responder.scope, response);
	    }
    },

    /**
     * Applies the failure callback of the asynchronous action on the responder's defined failure method passing
     * it the response parameter from the action.
     *
     * @param {Object} response The data object returned from the failure of the asynchronous action.
     */
    applyFailure: function(response) {
	    FlowMVC.mvc.service.rpc.AsyncToken.logger.debug("applyFailure");

	    if(this.responder) {
		    this.applyCallback(this.responder.failure, this.responder.scope, response);
	    }

    },

	/**
	 * Applies the callback of the asynchronous action on the responder's defined callback method passing
	 * it the response parameter from the action.
	 *
	 * @param callback {Function} The callback function to execute.
	 * @param scope {Object} The scope to execute the callback within.
	 * @param response {Object} The scope to execute the callback within.
	 */
	applyCallback: function(callback, scope, response) {
		FlowMVC.mvc.service.rpc.AsyncToken.logger.debug("applyCallback");

		if(callback && scope) {
			callback.call(scope, response);
		}
	}

});

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
 * Contains references to the success and failure methods of an object making a service call.
 * It also contains a reference to the object using the Responder (which has the success and failure methods).
 */
Ext.define("FlowMVC.mvc.service.rpc.Responder", {

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.rpc.Responder"),

        /**
         * {String} ERROR_SUCCESS_MUST_BE_VALID_FUNCTION An error string indicating that the constructor success parameter
         * cannot be be null or an not a function.
         */
        ERROR_SUCCESS_MUST_BE_VALID_FUNCTION: "The constructor parameter 'success' cannot be null or not a function.",
        /**
         * {String} ERROR_FAILURE_MUST_BE_VALID_FUNCTION An error string indicating that the constructor failure parameter
         * cannot be be null or an not a function.
         */
        ERROR_FAILURE_MUST_BE_VALID_FUNCTION: "The constructor parameter 'failure' cannot be null or not a function.",
        /**
         * {String} ERROR_SCOPE_MUST_BE_NON_NULL An error string indicating that the constructor scope parameter
         * cannot be be null.
         */
        ERROR_SCOPE_MUST_BE_VALID_OBJECT: "The constructor parameter 'scope' cannot be null or not an object"
    },

	/**
	 * {Function} success Reference to a method that handles a successful service.
	 */
	success:    null,

	/**
	 * Function} failure Reference to a method that handles a failed service.
	 */
	failure:    null,

	/**
	 * {Object} scope Reference to the object that has the success and failure handler methods.
	 */
	scope:      null,

    /**
     * The constructor creates a Responder object with a success and failure method reference, as well as
     * scope reference to the object that creates it.
     *
     * @param {Function} success Reference to a method that handles a successful service.
     * @param {Function} failure Reference to a method that handles a failed service.
     * @param {Object} scope Reference to the object that has the success and failure handler methods.
     */
    constructor: function(success, failure, scope)
    {
        if( (success == null) || (typeof(success) !== "function") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_SUCCESS_MUST_BE_VALID_FUNCTION
            });
        }
        if( (failure == null) || (typeof(failure) !== "function") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_FAILURE_MUST_BE_VALID_FUNCTION
            });
        }
        if( (success == null) || (typeof(scope) !== "object") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_SCOPE_MUST_BE_VALID_OBJECT
            });
        }
	    FlowMVC.mvc.service.rpc.Responder.logger.debug("constructor");

        this.success = success;
        this.failure = failure;
        this.scope = scope;
    }

});

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
 * Controllers act as the front door to services; they handle application-level events and execute the appropriate
 * service. When a service succeeds or fails, it is the controller's responsibility to update model and store data
 * (application state) and dispatch events alerting the rest of the application to the state of a service call.
 *
 * The abstract controller class provides base functionality for all application controllers. The main purpose
 * of this class is to offer helper methods for service execution via the methods {@link FlowMVC.mvc.controller.AbstractController#executeServiceCall},
 * executeServiceCallWithAsyncToken(), and executeServiceCallWithPromises(). The pattern to execute a service call was
 * borrowed from the Swiz [ServiceHelper.executeServiceCall()](http://swizframework.jira.com/wiki/display/SWIZ/Service+Layer)
 * implementation as it cleanly calls the service and adds custom success and failure handlers in one line:
 *
 * ## Example
 *
 * this.executeServiceCall(service, service.authenticate, [username, password], this.loginSuccess, this.loginFailure, this);
 * 
 * Finally, controllers can be used to handle application-level processes and logic as they are in fact application
 * aware and often "control" the flow and orchestration of the application.
 */
Ext.define("FlowMVC.mvc.controller.AbstractController", {
    extend: "Ext.app.Controller",

	requires: [
		"FlowMVC.mvc.event.EventDispatcher"
	],

//	inject: [
//		"eventBus"
//	],
	inject: {

		/**
		 * {FlowMVC.mvc.event.EventDispatcher} eventBus Reference to the application-level event bus.
		 */
		eventBus: "eventBus"
	},

    statics: {

        /**
         * {Ext.app.Application} ROOT_APPLICATION The Application instance this Controller is attached to.
         */
        ROOT_APPLICATION: null,

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.controller.AbstractController")
    },

    config: {

        /**
         * @cfg {String} sessionToken The session token for the Application. This should be a single string without
         * spaces or periods because it is used as the Application's global namespace.
         * @accessor
         */
        sessionToken: null
    },

    /**
     * Sets up simple accessor method shortcuts for the global event bus.
     */
    init: function() {
        FlowMVC.mvc.controller.AbstractController.logger.debug("init");

	    this.setupGlobalEventListeners();
    },

    /**
     * Marker method. Concrete subclasses can implement to setup listeners to the global event bus with
     * confidence that it exists. This is called during the initialization phase of the controller to ensure
     * the reference to the application exists when adding event listeners to it.
     */
    setupGlobalEventListeners: function() {
        FlowMVC.mvc.controller.AbstractController.logger.debug("setupGlobalEventListeners");
    },

    /**
     * Simplifies the process of executing a service call that requires custom asynchronous success and failure
     * handlers.
     *
     * This method determines if the service uses AsyncTokens or Promises so the API used to execute service calls is
     * the same; it's really just a wrapper to the concrete methods that execute service calls with AsyncTokens or
     * Promises.
     *
     * Note that the service call isn't passed in as a function that actually executes the service; it's passed
     * in via a reference to the service object, the actual service method, and the service method's parameters.
     * This is done to prevent the service call from being executed before the responder is being set on it.
     *
     * ## Example
     *
     * var service = this.getAuthenticationService();
     * this.executeServiceCall(service, service.authenticate, [username, password], this.loginSuccess, this.loginFailure, this);
     *
     * @param {Object} service Reference to the actual service.
     * @param {Function} method Reference to the method on the service object that executes the service call.
     * @param {Array} args Array of parameters used in the service call's method.
     * @param {Function} success Callback method for a successful service.
     * @param {Function} failure Callback method for a failed service.
     * @param {Object} scope The object that contains the success and failure callback methods.
     */
    executeServiceCall: function(service, method, args, success, failure, scope) {
        FlowMVC.mvc.controller.AbstractController.logger.group("FlowMVC.mvc.controller.AbstractController.executeServiceCall");

        var token;

        if(service.getUsePromise()) {
            FlowMVC.mvc.controller.AbstractController.logger.info("executeServiceCall: Using Promises");
            token = this.executeServiceCallWithPromises(service, method, args, success, failure, scope);
        } else {
            FlowMVC.mvc.controller.AbstractController.logger.info("executeServiceCall: Using AsyncToken");
            token = this.executeServiceCallWithAsyncToken(service, method, args, success, failure, scope);
        }

        return token;
    },

	/**
	 * Executes a service call that uses AsyncTokens.
	 *
	 * Note that the service call isn't passed in as a function that actually executes the service; it's passed
	 * in via a reference to the service object, the actual service method, and the service method's parameters.
	 * This is done to prevent the service call from being executed before the responder is being set on it.
	 *
	 * ## Example
	 *
	 * var service = this.getAuthenticationService();
	 * this.executeServiceCallWithAsyncToken(service, service.authenticate, [username, password], this.loginSuccess, this.loginFailure, this);
	 *
	 * @param {Object} service Reference to the actual service.
	 * @param {Function} method Reference to the method on the service object that executes the service call.
	 * @param {Array} args Array of parameters used in the service call's method.
	 * @param {Function} success Callback method for a successful service.
	 * @param {Function} failure Callback method for a failed service.
	 * @param {Object} scope The object that contains the success and failure callback methods.
	 */
    executeServiceCallWithAsyncToken: function(service, method, args, success, failure, scope) {
        FlowMVC.mvc.controller.AbstractController.logger.debug("executeServiceCallWithAsyncToken");

        var responder = Ext.create("FlowMVC.mvc.service.rpc.Responder", success, failure, scope);
        var token = method.apply(service, args);
        token.addResponder(responder);

        return token;
    },

	/**
	 * Executes a service call that uses Promises.
	 *
	 * Note that the service call isn't passed in as a function that actually executes the service; it's passed
	 * in via a reference to the service object, the actual service method, and the service method's parameters.
	 * This is done to prevent the service call from being executed before the responder is being set on it.
	 *
	 * ## Example
	 *
	 * var service = this.getAuthenticationService();
	 * this.executeServiceCallWithAsyncToken(service, service.authenticate, [username, password], this.loginSuccess, this.loginFailure, this);
	 *
	 * @param {Object} service Reference to the actual service.
	 * @param {Function} method Reference to the method on the service object that executes the service call.
	 * @param {Array} args Array of parameters used in the service call's method.
	 * @param {Function} success Callback method for a successful service.
	 * @param {Function} failure Callback method for a failed service.
	 * @param {Object} scope The object that contains the success and failure callback methods.
	 */
    executeServiceCallWithPromises: function(service, method, args, success, failure, scope) {
        FlowMVC.mvc.controller.AbstractController.logger.debug("executeServiceCallWithPromises");

        return method.apply(service, args).then({
            success: success,
            failure: failure,
            scope: scope
        }).always(function() {
		    // TODO: Consider adding in an additional method callback for this
            // Do something whether call succeeded or failed
            FlowMVC.mvc.controller.AbstractController.logger.debug("executeServiceCall: always do after promise");
        });
    },

    /**
     * Simple helper method that is used to get a reference to a service class from it's fully qualified String
     * counterpart.
     *
     * @param {String/Object} className Either a string or an object with a value property containing the fully
     * qualified String name of a service class.
     * @return {Object/null} An instance of the service class or null.
     */
    getService: function(className) {
        className = (className && className.value) ? className.value : className;

        FlowMVC.mvc.controller.AbstractController.logger.debug("getService: using: ", className);
        var clazz = Ext.ClassManager.get(className);
        return new clazz();
    },

    /**
     * @deprecated
     *
     * Sencha ExtJS and Touch access the reference to the application in the controller differently; in ExtJS, it's
     * this.application because it's not setup in the config object where getters/setters are automatically generated
     * whereas in Touch, it's this.getApplication(). This method aims to abstract that difference.
     *[
     * @return Ext.app.Application} The Application instance this Controller is attached to. This is
     * automatically provided when using the MVC architecture so should rarely need to be set directly.
     */
    getMVCApplication: function() {
        if(FlowMVC.mvc.controller.AbstractController.ROOT_APPLICATION == null) {

            // this is if you're using ExtJS
//            if (Ext.getVersion("extjs") && Ext.getVersion("core").isLessThan("4.2.0")) {
            if (Ext.getVersion("extjs")) {
                FlowMVC.mvc.controller.AbstractController.logger.warn("AbstractController.getMVCApplication: using 'this.application' because ExtJS 4.1 and below doesn't use a getter for the root application.");
                FlowMVC.mvc.controller.AbstractController.ROOT_APPLICATION = this.application;

            // this is if you're using Touch
//            } else if(Ext.getVersion('touch')) {
            } else {
                FlowMVC.mvc.controller.AbstractController.logger.info("AbstractController.getMVCApplication: using 'this.getApplication() because we're in Touch 2.x+'");
                FlowMVC.mvc.controller.AbstractController.ROOT_APPLICATION = this.getApplication();
            }
        }

        return FlowMVC.mvc.controller.AbstractController.ROOT_APPLICATION;
    }

});

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
 * Mediators fulfil the passive view pattern and are entirely responsible for a single view and it's sub-components;
 * it is within a mediator that we handle view logic, events and user interactions, and data marshaling. It is expected
 * that mediators will need to be partly or entirely created from scratch for each platform. It may also be possible to
 * create base mediators for some desktop and mobile views for additional reusability, leaving the specifics to the
 * concrete, platform implementations.
 *
 * Mediators are also aware of the application-level event bus and can thus partake in dispatching and listening to it's
 * events. In order to facilitate a separation of concerns between an object that manages a view (mediators) and an
 * object that's responsible for executing services and working with model data (controllers), the mediators simply
 * broadcast events that controllers handle in order to execute services
 *
 * Simply put, while application aware, mediators numero uno role is to manage it's specific view buddy.
 */
Ext.define("FlowMVC.mvc.mediator.AbstractMediator", {
    extend: "Deft.mvc.ViewController",

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.mediator.AbstractMediator")
    },

	inject: {

		/**
		 * {FlowMVC.mvc.event.EventDispatcher} eventBus Reference to the application-level event bus.
		 */
		eventBus: "eventBus"
	},

    /**
     * Sets up simple accessor method shortcuts for the global event bus.
     */
    init: function() {
        FlowMVC.mvc.mediator.AbstractMediator.logger.debug("init");

	    this.setupGlobalEventListeners();
    },

    /**
     * Simple utility method used to gain a reference to a view's sub-component by ID.
     *
     * @param {String} id The unique ID of the component to search for.
     * @param {Object} view The object to search for the component in.
     * @return {*} Reference to a component.
     */
    getComponentById: function(id, view) {
        return view.down("#" + id);
    },

    /**
     * Provides a simple slide left animation for our views.
     *
     * @return {Object} The transition object.
     */
    getSlideLeftTransition: function() {
        return { type: "slide", direction: "left" };
    },

    /**
     * Provides a simple slide right animation for our views.
     *
     * @return {Object} The transition object.
     */
    getSlideRightTransition: function() {
        return { type: "slide", direction: "right" };
    },

    /**
     * Wrapper method to adding an event handler to a selector.
     *
     * @param {String} selector The selector to add an event handler to.
     * @param {Function} eventType The event type to listen to and add an event handler method to.
     * @param {Function} handler The event handler method for the event.
     */
    addEventListenerBySelector: function(selector, eventType, handler) {
        FlowMVC.mvc.mediator.AbstractMediator.logger.debug("addEventListenerBySelector: selector = " + selector + " eventType = " + eventType);

        var eventHandler = {};
        eventHandler[eventType] = handler;

        var controlObject = {};
        controlObject[selector] = eventHandler;

        this.control(controlObject);
    },

    /**
     * Accessor for quickly locating a view by xtype. By default, it's expected that views are singletons and
     * there's only 1 unique instance of the view, but if there are more than the method returns an array of
     * all components matching the specified xtype.
     *
     * @param {String} xtype The xtype used to query for a view in the application.
     * @return {Object/Object[]} A single view or list of views matching the provided xtype.
     */
    getViewByXType: function(xtype, isSingeltonView) {
        FlowMVC.mvc.mediator.AbstractMediator.logger.debug("getViewByXType: xtype = ", xtype);

        var view = null;
        var viewsArray = Ext.ComponentQuery.query(xtype);

        // default to yes, this is a singleton view and only 1 instance exists in the application
        isSingeltonView = isSingeltonView || true;

        if(viewsArray) {
            view = isSingeltonView ? viewsArray[0] : viewsArray;
        }

        return view;
    },

    /**
     * Marker method. Concrete subclasses can implement to setup listeners to the global event bus with
     * confidence that it exists.
     */
    setupGlobalEventListeners: function() {
        FlowMVC.mvc.mediator.AbstractMediator.logger.debug("setupGlobalEventListeners");
    }

});

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
 * The base class for services. Provides some helper methods for calling the successful and failed callbacks
 * provided by the client object using this service.
 *
 * In order to use this object and ensure the callbacks work correctly, please follow these steps:
 *
 * Get a reference to your service and set the responder on it like:
 *
 * var service = this.getAuthenticationService(); // DeftJS injection
 *
 * or
 *
 * var service = Ext.create("CafeTownsend.service.AuthenticationService"); // traditional instance creation
 *
 * var responder = Ext.create("FlowMVC.mvc.service.rpc.Responder", this.logoutSuccess, this.logoutFailure, this);
 * service.setResponder(responder);
 *
 * or
 *
 * service.setResponder({
 *      success: me.loginSuccess,
 *      fault: me.loginFailure,
 *      scope: me
 * });
 *
 * Where "me" is usually this in the object using the service.
 */
Ext.define("FlowMVC.mvc.service.AbstractService", {

    requires: [
        "FlowMVC.mvc.service.rpc.Responder",
        "FlowMVC.mvc.service.rpc.AsyncToken"
    ],

    statics: {
        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.AbstractService"),

        /**
         * Error message for no responder defined.
         */
        NO_RESPONDER_DEFINED:
            "You must provide a responder object to the service that contains either a custom defined " +
            "success method that exists on the service's caller or a default 'success()' or 'failure()' callback." +
            "Set the responder on the object by doing:\n" +
            "var responder = Ext.create('FlowMVC.mvc.service.rpc.Responder', this.myCustomSuccess, this.myCustomFailure, this);\n" +
            "service.setResponder(responder);\n" +
            "or\n" +
            "service.setResponder({ success: this.myCustomSuccess, fault: this.myCustomFailure, scope: this});"
    },

    config: {

        /**
         * @cfg {Boolean} usePromise Flag indicating if the service should use promises.
         * @accessor
         */
        usePromise: false,

        /**
         * @cfg {FlowMVC.mvc.service.rpc.Responder} responder The responder object for this service contains
         * custom success and failure callback methods.
         * @accessor
         */
        responder: null
    },

    /**
     * Examines the responder set for the service and attempts to execute the specified callback
     * function and pass it the response.
     *
     * @param {Object} response The data packet from the service response.
     * @param {Function} responderMethod The string property name of the responder's 'success' or 'failure' property.
     * Allows for hash lookup of custom defined callback methods.
     */
    applyResponderMethod: function(response, responderMethod) {
        FlowMVC.mvc.service.AbstractService.logger.debug("applyResponderMethod: ", responderMethod);

        var callbackFunction = null;

        if(this.getResponder() && this.getResponder().scope)
        {
            var scope = this.getResponder().scope;

            if(this.getResponder()[responderMethod]) {
                FlowMVC.mvc.service.AbstractService.logger.debug("applyResponderMethod: using service caller's custom defined " + responderMethod + " callback");
                callbackFunction = this.getResponder()[responderMethod];
            } else if(typeof scope[responderMethod] === "function") {
                FlowMVC.mvc.service.AbstractService.logger.debug("applyResponderMethod: using service caller's default " + responderMethod + " callback");
                callbackFunction = scope[responderMethod];
            } else {
	            Ext.Error.raise({
		            msg: "["+ Ext.getDisplayName(arguments.callee) +"] " +
			            CafeTownsend.service.AbstractService.NO_RESPONDER_DEFINED
	            });
            }

            FlowMVC.mvc.service.AbstractService.logger.groupEnd();

            // execute the callback
            callbackFunction.call(scope, response);

            this.setResponder(null);

        } else {
	        Ext.Error.raise({
		        msg: "["+ Ext.getDisplayName(arguments.callee) +"] " +
			        CafeTownsend.service.AbstractService.NO_RESPONDER_DEFINED
	        });

        }
    },

    /**
     * Default handler for service's successful execution. Relies on the applyResponderMethod() to
     * actually call the service's client object's (object that used the service) success handler.
     *
     * @param response  The data packet response from the successful service call.
     */
    success: function(response, token) {
//        FlowMVC.mvc.service.AbstractService.logger.group("AbstractService.success", true);
        FlowMVC.mvc.service.AbstractService.logger.info("success");
        FlowMVC.mvc.service.AbstractService.logger.info(response);

        // if the service response isn't successful just kick this over to the fault handler
        if((response.success != null) && (response.success !== true)) {
            this.failure(response, token);
            return;
        }

        FlowMVC.mvc.service.AbstractService.logger.groupEnd();

        if(token && (token instanceof FlowMVC.mvc.service.rpc.AsyncToken)) {
            token.applySuccess(response);
        } else if(token && (token instanceof Deft.promise.Deferred)) {
            token.resolve(response);
        } else {
            this.applyResponderMethod(response, "success");
        }
    },

    /**
     * Default handler for service's failed execution. Relies on the applyResponderMethod() to
     * actually call the service's client object's (object that used the service) failure handler.
     *
     * @param response  The data packet response from the failed service call.
     */
    failure: function(response, token) {
        FlowMVC.mvc.service.AbstractService.logger.info("failure");
        FlowMVC.mvc.service.AbstractService.logger.groupEnd();

        if(token && (token instanceof FlowMVC.mvc.service.rpc.AsyncToken)) {
            token.applyFailure(response);
        } else if(token && (token instanceof Deft.promise.Deferred)) {
            deferred.reject("There was a service error.");
        } else {
            this.applyResponderMethod(response, "failure");
        }
    }
});

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
 * The base class for mock services adds a delay to the mock asynchronous network call in milliseconds.
 */
Ext.define("FlowMVC.mvc.service.mock.AbstractServiceMock", {
    extend: "FlowMVC.mvc.service.AbstractService",

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.mock.AbstractServiceMock"),

        /**
         * {Number} DELAY_IN_MILLISECONDS The default delay of 3 seconds for mock services.
         */
        DELAY_IN_MILLISECONDS: 3000
    },

    /**
     * Used by mock services to call a successful mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the successful service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedSuccess: function(response, delayInMilliSeconds) {
        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("delayedSuccess");

	    var token = this.getTokenOrPromise();
	    var me = this;

        // Using a delayed task in order to give the hide animation above
        // time to finish before executing the next steps.
        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.success(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

    /**
     * Used by mock services to call a failed mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the failed service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedFailure: function(response, delayInMilliSeconds) {
        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("delayedFailure");

	    var token = this.getTokenOrPromise();
	    var me = this;

        // Using a delayed task in order to give the hide animation above
        // time to finish before executing the next steps.
        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.failure(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

    /**
     * Accessor method that determines if this service uses promises or AsyncTokens.
     *
     * @returns {FlowMVC.mvc.service.rpc.AsyncToken/Deft.promise.Deferred} Reference to the AsyncToken or
     * Promise
     */
    getTokenOrPromise: function() {
        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("getTokenOrPromise");
        return (this.getUsePromise()) ?
            Ext.create("Deft.promise.Deferred") :
            Ext.create("FlowMVC.mvc.service.rpc.AsyncToken");
    },

    /**
     * Helper method used to get the number of milliseconds to delay the mock service callback.
     *
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     * @return {Number} The number of milliseconds to delay the mock service callback.
     */
    getDelayInMilliSeconds: function(delayInMilliSeconds) {
        delayInMilliSeconds = (delayInMilliSeconds == null)
            ? FlowMVC.mvc.service.mock.AbstractServiceMock.DELAY_IN_MILLISECONDS
            : delayInMilliSeconds;

        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("getDelayInMilliSeconds: " + delayInMilliSeconds);
        return delayInMilliSeconds;
    },

    /**
     * Helper method to create random numbers within a given range. Helpful for mocking data.
     *
     * @param {Number} min The minimum or low end of the range.
     * @param {Number} max The maximum or high end of the range.
     * @return {Number} The random generated number.
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

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
 * The abstract store classes provides additional base functionality to update records in the store and
 * force auto syncs without requiring the use of a proxy. Treats the store more like a collection.
 * 
 * This file is part of WASI Sencha Extensions.
 */
Ext.define("FlowMVC.mvc.store.AbstractStore", {
    extend: "Ext.data.Store",

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.store.AbstractStore"),

        /**
         * {String} ERROR_SET_DATA_PARAM_NOT_VALID An error string indicating that the setData() method's parameter
         * cannot be anything other than null or an array.
         */
        ERROR_SET_DATA_PARAM_NOT_VALID: "The setData() method's 'data' parameter must be an array or null.",

        /**
         * {String} ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID An error string indicating that the setSelectedRecord()
         * method's parameter cannot be anything other than null or an instance of the expected model for this store.
         */
        ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID: "The setSelectedRecord() method's 'record' parameter must null or " +
            "be an instance of the expected model for this store.",

	    /**
	     * {String} ERROR_SET_UPDATE_PARAM_NOT_VALID An error string indicating that the update()
	     * method's parameter must be not-null and an instance of the expected model for this store.
	     */
	    ERROR_SET_UPDATE_PARAM_NOT_VALID: "The update() method's 'record' parameter must be not null and " +
		    "be an instance of the expected model for this store."
    },

    /**
     * @event selectedRecordChange
     * Fired when a Model instance has been set as the selected record of Store. You should listen
     * for this event if you have to update a representation of the selected record in this store in your UI.
     * @param {Ext.data.Store} this The store.
     * @param {Ext.data.Model} record The Model instance that is set as the selected record.
     */

	/**
	 * @event updatedRecord
	 * Fired when a Model instance has been updated in the Store. You should listen
	 * for this event if you have to update a representation of the selected record in this store in your UI.
	 * @param {Ext.data.Store} this The store.
	 * @param {Ext.data.Model} record The Model instance that was updated.
	 */

    /**
     * @private {Object/Ext.data.Model} _selectedRecord the currently selected record for the store.
     */
    _selectedRecord: null,

    /**
     * Sets the selected record on the store and broadcasts an event with type "selectedRecordChange" with a reference
     * to the store and the selected record.
     *
     * @param {Ext.data.Model} record The record to set as selected on this store.
     */
    setSelectedRecord: function(record, autoAdd) {
        FlowMVC.mvc.store.AbstractStore.logger.debug("setSelectedRecord");

        // the record parameter must either be null an instance of the expected model for this store
        if ( !this.isModel(record) && (record != null) ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID
            });
        }

        // default autoAdd to true
        // TODO: create util to default values
        autoAdd = typeof autoAdd !== "undefined" ? autoAdd : true;

        // if the record isn't in the store and autoAdd is set to true, then add it
        if( record && autoAdd && (this.getById(record.id) == null) ) {
            this.add(record);
        }

        this._selectedRecord = record;
        this.fireEvent("selectedRecordChange", this, record);
    },

    /**
     * Accessor for this store's selected record.
     *
     * @return {Object/Ext.data.Model} The selected record for this store.
     */
    getSelectedRecord: function() {
        FlowMVC.mvc.store.AbstractStore.logger.debug("getSelectedRecord");

        return this._selectedRecord;
    },

    /**
     * Removes all records from the store and makes sure the selected record is null.
     */
    removeAll: function() {
        FlowMVC.mvc.store.AbstractStore.logger.debug("removeAll");

        this._selectedRecord = null;
        this.callParent(arguments);
    },

    /**
     * This method exists to create parity between the ExtJS and Touch SDKs, as ExtJS does not have a setData() method.
     *
     * @param {Object[]/Ext.data.Model[]} data
     * Array of Model instances or data objects to load locally. See "Inline data" above for details.
     */
    setData: function(data) {

        // the data parameter must either be null or an array
        if (!Ext.isArray(data) && (data != null)) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_DATA_PARAM_NOT_VALID
            });
        }

        // do some quick sencha framework checking as there's no setData() in ExtJS.
        if (Ext.getVersion("extjs")) {
            FlowMVC.mvc.store.AbstractStore.logger.info("setData: using 'store.removeAll() and store.add(data)' because ExtJS 4.1 doesn't support store.setData().");
            this.removeAll();
            if(data) {
                this.add(data);
            } else {
                this.removeAll();
            }
        } else {
            FlowMVC.mvc.store.AbstractStore.logger.info("setData");
            this.callParent(arguments);
        }
    },

    /**
     * Update a model object on the store by replacing it with a new model
     *
     * @param {Ext.data.Model} model The model to replace existing model in store.
     * @param {String} property The property to use as the id to find the model to be replaced.
     */
    update: function(model, property) {
        property = property ? property : "id";

	    // the record parameter must be non-null and an instance of the expected model for this store
	    if ( (model == null) || (this.isModel(model) == false) ) {
		    Ext.Error.raise({
			    msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_UPDATE_PARAM_NOT_VALID
		    });
	    }

        if (Ext.getVersion("extjs")) {
            var index = this.find(property, model.get(property));

            if(index < 0)
                return;

            this.insert(index, model);
            this.removeAt(index+1);
            FlowMVC.mvc.store.AbstractStore.logger.debug("update: updating ExtJS model with " + property);
	        this.fireEvent("updatedRecord", this, model);
	        return model;
        } else {
            var value = model.data[property];
            var record = this.findRecord(property, value);
            if(record) {
//                record.setData(model);
                record = model;
                // force the store to update correctly and broadcast refresh events
                // so views using this store update correctly
                record.dirty = true;
                this.sync();
                FlowMVC.mvc.store.AbstractStore.logger.debug("update: updating Touch model with " + property);
	            this.fireEvent("updatedRecord", this, record);
	            return model;
            }
        }

	    return null;
    },

	/**
	 * Determines if the model parameter is the expected model type for this store.
	 *
	 * @param {Object/Ext.data.Model} model The object being tested to determine if it's the expected model for
	 * this store.
	 * @return {Boolean} A flag indicating if the parameter is the expected model for this store.
	 */
	isModel: function(record) {

		// ExtJS and Touch get to the underlying model differently
		var modelClass = (Ext.getVersion("extjs")) ? this.model : this._model;
		var bool = (record instanceof modelClass);
		return (record instanceof modelClass);
	}

});