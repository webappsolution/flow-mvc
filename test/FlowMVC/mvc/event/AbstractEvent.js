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