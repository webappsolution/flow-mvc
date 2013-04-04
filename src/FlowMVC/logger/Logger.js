/*
 Copyright (c) 2013 [Sencha Extensions Contributors](mailto:admin@webappsolution.com)

 WASI Sencha Extensions is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 WASI Sencha Extensions is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with WASI Sencha Extensions.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The logger is a wrapper to the Log4JavaScript logger and serves 2 purposes:
 *
 * 1) It's configured with a standard Log4J (java) type configuration.
 * 2) It has a simple accessor method that wraps the logger as a factory so it's easily injected into client objects
 * with a reference to the client instance, allowing the console ouput to contain the client object name without
 * additional configuration.
 */
Ext.define("FlowMVC.logger.Logger", {

    statics: {

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
        },

        /**
         * Creates a log4JavaScript logger that outputs the following format:
         *
         * 16:11:45:956 DEBUG [CafeTownsend.controller.AuthenticationController] - login: username = a, password = a
         *
         * @param {String} name The string name used for the logger. This is often the class name of the object the
         * logger is used in.
         * @returns {*} A log4JavaScript logger.
         */
        getLogger: function(name) {
            var tempLogger;
            var browserAppender;
            var patternLayout;

            if(typeof name != "string") {
                name = Ext.ClassManager.getName(name);
            }

            tempLogger = log4javascript.getLogger(name);
            tempLogger.setLevel(log4javascript.Level.ALL);

            browserAppender = new log4javascript.BrowserConsoleAppender();
            patternLayout = new log4javascript.PatternLayout("%d{HH:mm:ss:SSS} %-5p [%c] - %m");
            browserAppender.setLayout(patternLayout);
            tempLogger.addAppender(browserAppender);

            //        tempLogger.error("WASI =================================");

            return tempLogger;
        }
    }
});

