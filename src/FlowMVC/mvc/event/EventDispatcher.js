/**
 * The main purpose of this class is to provide loosely coupled object communication by wrapping
 * the application-level event bus using simple, helper methods for adding, removing, and dispatching events.
 */
Ext.define("FlowMVC.mvc.event.EventDispatcher", {
    extend: "Ext.util.Observable",

	statics: {

		/**
		 * @property {FlowMVC.logger.Logger} logger The logger for the object.
		 * @static
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
     *      @exampleTODO preview
     *      var evt = Ext.create("CafeTownsend.event.AuthenticationEvent", CafeTownsend.event.AuthenticationEvent.LOGIN, username, password);
     *      this.dispatchGlobalEvent(evt);
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
     *      @exampleTODO preview
     *      this.addGlobalEventListener(CafeTownsend.event.AuthenticationEvent.LOGIN, this.onLogin, this);
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
     *      @exampleTODO preview
     *      this.removeGlobalEventListener(CafeTownsend.event.AuthenticationEvent.LOGIN, this.onLogin, this);
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

