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
Ext.define("FlowMVC.mvc.event.TestEventListener", {
    extend: "FlowMVC.mvc.event.EventDispatcher",

    handleresponse: function(value) {
        console.log('here')
    },

    constructor: function(scope) {
        this.scope = scope;
        this.addGlobalEventListener('dispatchedEvent', this.handleresponse, this);
    }



});
