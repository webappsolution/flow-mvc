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
 * Contains references to the success and failure methods of an object making a service call.
 * It also contains a reference to the object using the Responder (which has the success and failure methods).
 */
Ext.define("FlowMVC.mvc.service.rpc.Responder", {

	/**
	 * {Function} success Reference to a method that handles a successful service.
	 */
    success:    null,

	/**
	 * Function} failure Reference to a method that handles a failed service.
	 */
    failure:    null,

	/**
	 * {Object} scope Reference to the object that has the success and failure handler methods.
	 */
    scope:      null,

    statics: {

        /**
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.rpc.Responder"),

        /**
         * {String} ERROR_SUCCESS_MUST_BE_VALID_FUNCTION An error string indicating that the constructor success parameter
         * cannot be be null or an not a function.
         */
        ERROR_SUCCESS_MUST_BE_VALID_FUNCTION: "The constructor parameter 'success' cannot be null or not a function.",
        /**
         * {String} ERROR_FAILURE_MUST_BE_VALID_FUNCTION An error string indicating that the constructor failure parameter
         * cannot be be null or an not a function.
         */
        ERROR_FAILURE_MUST_BE_VALID_FUNCTION: "The constructor parameter 'failure' cannot be null or not a function.",
        /**
         * {String} ERROR_SCOPE_MUST_BE_NON_NULL An error string indicating that the constructor scope parameter
         * cannot be be null.
         */
        ERROR_SCOPE_MUST_BE_VALID_OBJECT: "The constructor parameter 'scope' cannot be null or not an object"

    },

    /**
     * The constructor creates a Responder object with a success and failure method reference, as well as
     * scope reference to the object that creates it.
     *
     * @param {Function} success Reference to a method that handles a successful service.
     * @param {Function} failure Reference to a method that handles a failed service.
     * @param {Object} scope Reference to the object that has the success and failure handler methods.
     */
    constructor: function(success, failure, scope)
    {
        if( (success == null) || (typeof(success) !== "function") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_SUCCESS_MUST_BE_VALID_FUNCTION
            });
        }
        if( (failure == null) || (typeof(failure) !== "function") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_FAILURE_MUST_BE_VALID_FUNCTION
            });
        }
        if( (success == null) || (typeof(scope) !== "object") ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.service.rpc.Responder.ERROR_SCOPE_MUST_BE_VALID_OBJECT
            });
        }
	    FlowMVC.mvc.service.rpc.Responder.logger.debug("constructor");

        this.success = success;
        this.failure = failure;
        this.scope = scope;
    }

});

