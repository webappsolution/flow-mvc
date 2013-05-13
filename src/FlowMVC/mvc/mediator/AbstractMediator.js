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
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.mediator.AbstractMediator")
    },

	inject: {

		/**
		 * @property {FlowMVC.mvc.event.EventDispatcher} eventBus Reference to the application-level event bus.
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

