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
 * The base event used for all application-level event bus messaging; the type property defines the event name
 * or type that drives the event dispatching.
 */
Ext.define("FlowMVC.mvc.event.AbstractEvent", {

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.event.AbstractEvent")
    },

    /**
     * The event type or string name of the event.
     */
    type: "",

    /**
     * A generic data property for any event.
     */
    data: null,

    /**
     * Constructor.
     *
     * @param {String} type The event type or string name of the event; this is the token client objects subscribe to
     * when listening for application-level events.
     */
    constructor: function(type) {
        if( (type == null) || (type == "") ) {
            throw new Error("the parameter 'type' cannot be null or an empty string.");
        }
        FlowMVC.mvc.event.AbstractEvent.logger.debug("AbstractEvent.Constructor: type = ", type);
        this.type = type;
    }
});