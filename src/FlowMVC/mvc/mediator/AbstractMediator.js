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
 * The mediator essentially fulfills the passive view pattern for a given view -- acts like a view controller,
 * but chose to use the suffix Mediator simply to distinguish it from application controllers that interact with
 * services and models.
 *
 * Handles view events, typically generated from user gestures, manipulates the view with animations, transitions,
 * and/or dynamically building components within the view, and works with the view's API (again with events)
 * but also by way of getters and setters in order to bind data to and from the view.
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
         * TODO
         */
        eventBus: "eventBus"
    },

    config: {

        /**
         * @cfg {FlowMVC.mvc.event.EventDispatcher} eventBus The application-level event bus. This is
         * injected
         * @accessor
         */
//        eventBus: null
    },

    /**
     * Sets up simple accessor method shortcuts for the global event bus.
     */
    init: function() {
        FlowMVC.mvc.mediator.AbstractMediator.logger.debug("init");

        try {
            this.setupGlobalEventListeners();
        } catch(err) {
            FlowMVC.mvc.mediator.AbstractMediator.logger.error("init: " +
                "\n\t " +
                "Can't get access to the application property in the Controller because its undefined. " +
                "\n\t " +
                "If a concrete controller class extends this, why is this.getApplication() undefined in " +
                "AbstractMediator.init() ???");
        }
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
     * @return {Object/Object[]} A single view or list of views matchig the provided xtype.
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

