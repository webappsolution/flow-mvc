describe("FlowMVC.mvc.service.rpc.Responder", function() {

    // reusable scoped variable
    function successFunction(){
        "success";
    }

    function failureFunction(){
        "failure"
    }

    var scopeObject = {};

    // setup
    beforeEach(function() {

    });

    // teardown
    afterEach(function() {

    });

    describe("constructor", function() {


        it("should throw an error if the success is not a function", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", 100, failureFunction, scopeObject); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_SUCCESS_MUST_BE_VALID_FUNCTION));
        });
        it("should throw an error if the success is null", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", null, failureFunction, scopeObject); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_SUCCESS_MUST_BE_VALID_FUNCTION));
        });

        it("should throw an error if the failure is not a function", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, 100, scopeObject); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_FAILURE_MUST_BE_VALID_FUNCTION));
        });
        it("should throw an error if the failure is null", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, null, scopeObject); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_FAILURE_MUST_BE_VALID_FUNCTION));
        });

        it("should throw an error if the scope is not an object", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, failureFunction, 100); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_SCOPE_MUST_BE_VALID_OBJECT));
        });
        it("should throw an error if the scope is null", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, failureFunction); }
            ).toThrow(new Error(FlowMVC.mvc.service.rpc.Responder.ERROR_SCOPE_MUST_BE_VALID_OBJECT));
        });


        it("should throw no error", function() {
            expect(
                function(){ Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, failureFunction, scopeObject); }
            ).not.toThrow();
        });

    });
});