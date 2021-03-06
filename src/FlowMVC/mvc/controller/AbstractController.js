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
 *      @exampleTODO preview
 *      this.executeServiceCall(service, service.authenticate, [username, password], this.loginSuccess, this.loginFailure, this);
 * 
 * Finally, controllers can be used to handle application-level processes and logic as they are in fact application
 * aware and often "control" the flow and orchestration of the application.
 */
Ext.define("FlowMVC.mvc.controller.AbstractController", {
    extend: "Ext.app.Controller",

	requires: [
		"FlowMVC.mvc.event.EventDispatcher"
	],

	inject: {

		/**
		 * @property {FlowMVC.mvc.event.EventDispatcher} eventBus Reference to the application-level event bus.
		 */
		eventBus: "eventBus"
	},

    statics: {

	    /**
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
	    logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.controller.AbstractController"),

        /**
         * @property {Ext.app.Application} ROOT_APPLICATION The Application instance this Controller is attached to.
         * @static
         */
        ROOT_APPLICATION: null
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

