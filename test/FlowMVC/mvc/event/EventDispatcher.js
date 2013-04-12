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
describe("FlowMVC.mvc.event.EventDispatcher", function() {

    var dispatcher = null;
    var wrongEventType = {};
    wrongEventType.type = "tim";
    var listener = null;
    var broadcaster = null;
    var evt = null;

    function listenerFunction(value){
        successValue = value;
    };


    // setup
    beforeEach(function() {

        dispatcher = Ext.create("FlowMVC.mvc.event.EventDispatcher");
        evt = Ext.create("FlowMVC.mvc.event.AbstractEvent", "tim");
        listener = Ext.create("FlowMVC.mvc.event.TestEventListener");
        broadcaster = Ext.create("FlowMVC.mvc.event.TestEventBroadcaster");
        listener.dispatcher = dispatcher;
        broadcaster.dispatcher = dispatcher;
    });

    // teardown
    afterEach(function() {
        dispatcher = null;
        evt = null;
        listener = null;
        broadcaster = null;
    });

    describe("constructor", function() {

        it("dispatcher should exist", function() {
            expect(dispatcher).toNotBe(null);
        });

        it("event should exist", function() {
            expect(evt).toNotBe(null);
        });

        it("listener should exist", function() {
            expect(listener).toNotBe(null);
        });

        it("broadcaster should exist", function() {
            expect(broadcaster).toNotBe(null);
        });

        it("dispatchGlobalEvent should have dispatched an event", function() {
            spyOn(dispatcher, "fireEvent");
            dispatcher.dispatchGlobalEvent(wrongEventType);
            expect(dispatcher.fireEvent).toHaveBeenCalled();
        });

        it("broadcaster should have dispatched an event and listener handler should have been called", function() {
            spyOn(listener, "handleresponse").andCallThrough();
            listener.listenFor(evt);
            broadcaster.broadcastEvent(evt);
            expect(listener.handleresponse).toHaveBeenCalled();
        });

        //add a prop to the event and do a "expectshit to have come through" test
        it("broadcaster should have dispatched an event with prop set and listener handler should have been called with prop", function() {
            spyOn(listener, "handleresponse").andCallThrough();
            listener.listenFor(evt);
            broadcaster.broadcastEvent(evt);
            expect(listener.handleresponse).toHaveBeenCalledWith(evt, {});
        });

    });
});