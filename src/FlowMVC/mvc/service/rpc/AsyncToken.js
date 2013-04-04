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
 * Contains references to the success and failure methods of an object making a service call.
 * It also contains a reference to the object using the AsyncToken (which has the success and failure methods).
 */
Ext.define("FlowMVC.mvc.service.rpc.AsyncToken", {

    /**
     * TODO
     */
    id: null,

    /**
     * TODO
     */
    responder: null,

    /**
     * The constructor creates a AsyncToken object with a success and failure method reference, as well as
     * scope reference to the object that creates it.
     */
    constructor: function()
    {
        this.id = this.randomUUID();
    },

    /**
     * TODO
     *
     * @param {FlowMVC.mvc.service.rpc.Responder} responder
     */
    addResponder: function(responder) {
        this.responder = responder;
    },

    /**
     * TODO
     *
     * @param {Object} response
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
     * TODO
     *
     * @param {Object} response
     */
    applyFailure: function(response) {

        var callbackFunction;
        var scope;

        callbackFunction = this.responder.failure;
        scope = this.responder.scope;

        if(callbackFunction) {
            callbackFunction.call(scope, response);
        }
    },

    /**
     * Examines the responder set for the service and attempts to execute the specified callback
     * function and pass it the response.
     *
     * @param {Object} response          The data packet from the service response.
     * @param responderMethod   The string property name of the responder's 'success' or 'failure' property.
     *                          Allows for hash lookup of custom defined callback methods.
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
//                throw new FlowMVC.mvc.service.rpc.ResponderError(FlowMVC.mvc.service.rpc.ResponderError.NO_RESPONDER_DEFINED);
                throw new Error(
                    "["+ Ext.getDisplayName(arguments.callee) +"] " +
                        CafeTownsend.service.AbstractService.NO_RESPONDER_DEFINED
                );
            }

            FlowMVC.mvc.service.AbstractService.logger.groupEnd();

            // execute the callback
            callbackFunction.call(scope, response);

            this.setResponder(null);

        } else {
//            throw new FlowMVC.mvc.service.rpc.ResponderError(FlowMVC.mvc.service.rpc.ResponderError.NO_RESPONDER_DEFINED);
            throw new Error(
                "["+ Ext.getDisplayName(arguments.callee) +"] " +
                    CafeTownsend.service.AbstractService.NO_RESPONDER_DEFINED
            );

        }
    },

    /**
     * Create and return a "version 4" RFC-4122 UUID string.
     *
     * randomUUID.js - Version 1.0
     *
     * Copyright 2008, Robert Kieffer
     *
     * This software is made available under the terms of the Open Software License
     * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
     *
     * The latest version of this file can be found at:
     * http://www.broofa.com/Tools/randomUUID.js
     *
     * For more information, or to comment on this, please go to:
     * http://www.broofa.com/blog/?p=151
     *
     * @private
     */
    randomUUID: function() {
        var s = [], itoh = '0123456789ABCDEF';

        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

        // Conform to RFC-4122, section 4.4
        s[14] = 4;  // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (var j = 0; j <36; j++) s[j] = itoh[s[j]];

        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    }

});

