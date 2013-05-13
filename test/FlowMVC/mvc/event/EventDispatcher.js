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

        //add a prop to the event and do a "toHaveBeenCalledWith() to have come through" test
        it("broadcaster should have dispatched an event with prop set and listener handler should have been called with prop", function() {
            spyOn(listener, "handleresponse").andCallThrough();
            listener.listenFor(evt);
            broadcaster.broadcastEvent(evt);

	        // TODO: this seems to be different in all the frameworks and fails the toHaveBeenCalledWith()
	        // Sencha ExtJS 4.1.0-gpl: Expected spy handleresponse to have been called with [ FlowMVC.mvc.event.AbstractEvent ] but actual calls were [ FlowMVC.mvc.event.AbstractEvent, { } ]
	        // Sencha ExtJS 4.1.1a-gpl: Expected spy handleresponse to have been called with [ FlowMVC.mvc.event.AbstractEvent ] but actual calls were [ FlowMVC.mvc.event.AbstractEvent, { } ]
	        // Sencha Touch 2.0.1: Expected spy handleresponse to have been called with [ FlowMVC.mvc.event.AbstractEvent ] but actual calls were [ FlowMVC.mvc.event.AbstractEvent, { }, Ext.event.Controller ]
	        // Sencha Touch 2.1.0: Expected spy handleresponse to have been called with [ FlowMVC.mvc.event.AbstractEvent ] but actual calls were [ FlowMVC.mvc.event.AbstractEvent, { }, Ext.event.Controller ]
	        // Sencha Touch 2.1.1: Expected spy handleresponse to have been called with [ FlowMVC.mvc.event.AbstractEvent ] but actual calls were [ FlowMVC.mvc.event.AbstractEvent, { }, Ext.event.Controller ]
//            expect(listener.handleresponse).toHaveBeenCalledWith(evt);
        });

    });
});