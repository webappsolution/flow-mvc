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
 * The authentication event contains username and password information to login the user.
 * Contains event types for login and logout.
 *
 * TODO: BMR: 02/20/2013: Need to make this work. Not being used right now.
 * TODO: BMR: 02/22/13: Consider moving this to a WASI package so it's not part of this project.
 */
Ext.define("FlowMVC.mvc.service.rpc.ResponderError", {

    extend: "Error",

    statics: {
        NO_RESPONDER_DEFINED:
                "You must provide a responder object to the service that contains either a custom defined " +
                "success method that exists on the service's caller or a default 'success()' callback.\n" +
                "Set the responder on the object by doing:\n" +
                "var responder = Ext.create('FlowMVC.mvc.service.rpc.Responder', this.logoutSuccess, this.logoutFailure, this);\n" +
                "service.setResponder(responder);" +
                "or\n" +
                "service.setResponder({ success: me.mySuccess, fault: me.myFailure, scope: me});"
    },

    constructor: function(msg)
    {
        msg =
            "["+ Ext.getDisplayName(arguments.callee) +"] " +
            msg;

        this.callParent(msg);


    }
});