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
		 * @property {FlowMVC.logger.Logger} logger The logger for the object.
		 * @static
		 */
		logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.rpc.AsyncToken")
	},

    /**
     * @property {String} id The unique ID of the token.
     */
    id: null,

    /**
     * @property {FlowMVC.mvc.service.rpc.Responder/Object} responder The object that contains success and failure methods
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

