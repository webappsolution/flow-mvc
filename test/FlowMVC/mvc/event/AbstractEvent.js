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
describe("FlowMVC.mvc.event.AbstractEvent", function() {

    // reusable scoped variable
    var event = null;
    var FLOW_MVC_EVENT_TYPE = "flowMVCEvent";

    // setup
    beforeEach(function() {
//        event = Ext.create("FlowMVC.mvc.event.AbstractEvent", FLOW_MVC_EVENT_TYPE);
    });

    // teardown
    afterEach(function() {
        event = null;
    });

    describe("constructor", function() {

        it("should have an event type defined", function() {
            event = Ext.create("FlowMVC.mvc.event.AbstractEvent", FLOW_MVC_EVENT_TYPE);
            expect(typeof event.type).toEqual("string");
            expect(event.type).toEqual(FLOW_MVC_EVENT_TYPE);
        });

        it("should throw an error if the type is not a string", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.event.AbstractEvent", 100); }
            ).toThrow(new Error(FlowMVC.mvc.event.AbstractEvent.ERROR_TYPE_MUST_BE_VALID_STRING));
        });

        it("should throw an error if the type is an empty string", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.event.AbstractEvent", ""); }
            ).toThrow(new Error(FlowMVC.mvc.event.AbstractEvent.ERROR_TYPE_MUST_BE_VALID_STRING));
        });

        it("should throw an error if the type is null", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.event.AbstractEvent", null); }
            ).toThrow(new Error(FlowMVC.mvc.event.AbstractEvent.ERROR_TYPE_MUST_BE_VALID_STRING));
        });

        it("should throw an error if the type is defaulted to null", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.event.AbstractEvent"); }
            ).toThrow(new Error(FlowMVC.mvc.event.AbstractEvent.ERROR_TYPE_MUST_BE_VALID_STRING));
        });
    });
});