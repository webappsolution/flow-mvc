describe("FlowMVC.util.UIDUtil", function() {

    var uid;
    var MOCK_UID = "589BE63D-F503-4EA6-B9AA-71D6D863D25F";

    beforeEach(function() {
        uid = FlowMVC.util.UIDUtil.randomUUID();
    });

    afterEach(function() {
        uid = null;
    });

    describe("the generated UID", function() {

        it("should not be null", function() {
            expect(uid).not.toBe(null);
        });

        it("should not be a string", function() {
            expect(typeof uid).toBe("string");
        });

        it("should not be an empty string", function() {
            expect(uid).not.toBe("");
        });

        it("should have a length of " + MOCK_UID.length, function() {
            expect(uid.length).toBe(MOCK_UID.length);
        });
    });
});