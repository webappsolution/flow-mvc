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
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.AbstractService"),

        /**
         * @property {String} NO_RESPONDER_DEFINED Error message for no responder defined.
         * @static
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

	    return token;
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
	        token.reject("There was a service error.");
        } else {
            this.applyResponderMethod(response, "failure");
        }
    },

	/**
	 * Accessor method that determines if this service uses promises or AsyncTokens.
	 *
	 * @returns {FlowMVC.mvc.service.rpc.AsyncToken/Deft.promise.Deferred} Reference to the AsyncToken or
	 * Promise
	 */
	getTokenOrPromise: function() {
		FlowMVC.mvc.service.AbstractService.logger.debug("getTokenOrPromise");
		return (this.getUsePromise()) ?
			Ext.create("Deft.promise.Deferred") :
			Ext.create("FlowMVC.mvc.service.rpc.AsyncToken");
	}
});

