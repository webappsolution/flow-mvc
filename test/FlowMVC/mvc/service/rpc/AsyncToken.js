describe("FlowMVC.mvc.service.rpc.AsyncToken", function() {

    // reusable scoped variable
    var token = null;
    var responder = null;
    var scopeObject = {};
    var successValue = null;
    var failureValue = null;

    function successFunction(value){
        successValue = value;
    }

    function failureFunction(value){
        failureValue = value;
    }

    // setup
    beforeEach(function() {
        token = Ext.create("FlowMVC.mvc.service.rpc.AsyncToken");
        responder = Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, failureFunction, this);
    });

    // teardown
    afterEach(function() {
        token = null;
        responder = null;
    });

    describe("constructor", function() {

        it("should have an id defined", function() {
            expect(typeof token.id).toEqual("string");
        });

	    it("should have a non-null string id", function() {
		    expect(token.id).toBeTruthy();
	    });

	    it("should not have a responder defined", function() {
		    token.addResponder(null);
		    expect(token.responder).toBe(null);
	    });

	    it("should not have a success value because the responder is null", function() {
		    token.addResponder(null);
		    token.applySuccess("hello");
		    expect(successValue).toEqual(null);
	    });

	    it("should not have a failure value because the responder is null", function() {
		    token.addResponder(null);
		    token.applyFailure("hello");
		    expect(failureValue).toEqual(null);
	    });

        it("should have a responder defined", function() {
            token.addResponder(responder);
            expect(token.responder).toNotBe(null);
            expect(token.responder.success).toEqual(successFunction);
	        expect(token.responder.failure).toEqual(failureFunction);
	        expect(token.responder.scope).toEqual(this);
        });

        it("success response should be hello", function() {
            token.addResponder(responder);
            token.applySuccess("hello");
            expect(successValue).toEqual("hello");
        });

        it("failure response should be hello", function() {
            token.addResponder(responder);
            token.applyFailure("hello");
            expect(successValue).toEqual("hello");
        });

    });
});