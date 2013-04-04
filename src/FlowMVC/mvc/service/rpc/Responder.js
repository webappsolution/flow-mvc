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
 * It also contains a reference to the object using the Responder (which has the success and failure methods).
 */
Ext.define("FlowMVC.mvc.service.rpc.Responder", {

    success:    null,
    failure:    null,
    scope:      null,

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
        this.success = success;
        this.failure = failure;
        this.scope = scope;
    }

});

