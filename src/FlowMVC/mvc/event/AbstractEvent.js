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
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.event.AbstractEvent"),

        /**
         * @property {String} ERROR_TYPE_MUST_BE_VALID_STRING An error string indicating that the constructor type parameter
         * cannot be be null or an empty string.
         * @static
         */
        ERROR_TYPE_MUST_BE_VALID_STRING: "The constructor parameter 'type' cannot be null or an empty string."
    },

    /**
     * @property {String} type The event type or string name of the event; this is the token client objects subscribe to
     * when listening for application-level events.
     */
    type: "",

    /**
     * @property {Object} data A generic data property for any event.
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
});