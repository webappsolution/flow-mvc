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
 * It also contains a reference to the object using the AsyncToken (which has the success and failure methods).
 */
Ext.define("FlowMVC.mvc.service.rpc.AsyncToken", {

    requires: [
        "FlowMVC.util.UIDUtil"
    ],

    /**
     * {String} id The unique ID of the token.
     */
    id: null,

    /**
     * {FlowMVC.mvc.service.rpc.Responder/Object} responder The object that contains success and failure methods
     * used for asynchronous service callbacks.
     */
    responder: null,

    /**
     * The constructor creates a AsyncToken object with a success and failure method reference, as well as
     * scope reference to the object that creates it.
     */
    constructor: function()
    {
        this.id = FlowMVC.util.UIDUtil.randomUUID();
    },

    /**
     * Adds a responder to this token.
     *
     * @param {FlowMVC.mvc.service.rpc.Responder} responder The object that contains success and failure methods
     * used for asynchronous service callbacks.
     */
    addResponder: function(responder) {
        this.responder = responder;
    },

    /**
     * Applies the successful callback of the asynchronous action on the responder's defined success method passing
     * it the response parameter from the action.
     *
     * @param {Object} response The data object returned from the success of the asynchronous action.
     */
    applySuccess: function(response) {

        var callbackFunction;
        var scope;

        callbackFunction = this.responder.success;
        scope = this.responder.scope;

        if(callbackFunction) {
            callbackFunction.call(scope, response);
        }
    },

    /**
     * Applies the failure callback of the asynchronous action on the responder's defined failure method passing
     * it the response parameter from the action.
     *
     * @param {Object} response The data object returned from the failure of the asynchronous action.
     */
    applyFailure: function(response) {

        var callbackFunction;
        var scope;

        callbackFunction = this.responder.failure;
        scope = this.responder.scope;

        if(callbackFunction) {
            callbackFunction.call(scope, response);
        }
    }

});

