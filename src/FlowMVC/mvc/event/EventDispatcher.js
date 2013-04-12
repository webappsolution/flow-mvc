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
//        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.event.EventDispatcher"),

        /**
         * {String} ERROR_EVENT_NOT_PROPER_TYPE An error string indicating that the event must be of the type
         * FlowMVC.mvc.event.AbstractEvent
         */
        ERROR_EVENT_NOT_PROPER_TYPE: "The event must extend FlowMVC.mvc.event.AbstractEvent.",

        /**
         * {String} ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID An error string indicating that the setSelectedRecord()
         * method's parameter cannot be anything other than null or an instance of the expected model for this store.
         */
        ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID: "The setSelectedRecord() method's 'record' parameter must null or " +
            "be an instance of the expected model for this store."
    },

    inject: [
        "logger"
    ],

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
     * @param {FlowMVC.mvc.event.AbstractEvent} event The event object to fire containing
     * a property called 'type' or a string representing the event name or type.
     * @param {Object...} args Variable number of parameters are passed to handlers. Optional and not usually used if
     * dispatching an event that subclasses FlowMVC.mvc.event.AbstractEvent.
     * @return {Boolean} Returns `false` if any of the handlers return `false`, otherwise it returns `true`.
     */
    dispatchGlobalEvent: function(event, args) {

        // the event parameter must be non null and of type FlowMVC.mvc.event.AbstractEvent
//        if ( (event == null) || !(event instanceof FlowMVC.mvc.event.AbstractEvent) ) {
//            Ext.Error.raise({
//                msg: FlowMVC.mvc.event.EventDispatcher.ERROR_EVENT_NOT_PROPER_TYPE
//            });
//        }

        if(event.type != null) {
            type = event.type;
            args = event;
        } else {
            type = event;
        }

        this.logger.debug("dispatchGlobalEvent: " + type);
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
        this.logger.debug("addGlobalEventListener: " + type);

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
        this.logger.debug("removeGlobalEventListener");

        this.removeListener(type, handler, scope)
    }

});

