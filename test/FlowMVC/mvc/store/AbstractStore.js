describe("FlowMVC.mvc.store.AbstractStore", function() {

    // reusable scoped variable
    var store = null;

    // setup
    beforeEach(function() {
        store = Ext.create("FlowMVC.mvc.store.AbstractStore");
    });

    // teardown
    afterEach(function() {
        store = null;
    });

    describe("setData() method", function() {

        it("should be a function", function() {
            expect(typeof store.setData).toEqual("function");
        });

        it("should have 13 items", function() {
            var data = [
                { id: 0,    firstName: "Tommy",   lastName: "Maintz",   phoneNumber: "508-566-6666" },
                { id: 1,    firstName: "Rob",     lastName: "Dougan",   phoneNumber: "508-566-6666" },
                { id: 2,    firstName: "Ed",      lastName: "Spencer",  phoneNumber: "508-566-6666" },
                { id: 3,    firstName: "Jamie",   lastName: "Avins",    phoneNumber: "508-566-6666" },
                { id: 4,    firstName: "Aaron",   lastName: "Conran",   phoneNumber: "508-566-6666" },
                { id: 5,    firstName: "Dave",    lastName: "Kaneda",   phoneNumber: "508-566-6666" },
                { id: 6,    firstName: "Jacky",   lastName: "Nguyen",   phoneNumber: "508-566-6666" },
                { id: 7,    firstName: "Abraham", lastName: "Elias",    phoneNumber: "508-566-6666" },
                { id: 8,    firstName: "Jay",     lastName: "Robinson", phoneNumber: "508-566-6666" },
                { id: 9,    firstName: "Nigel",   lastName: "White",    phoneNumber: "508-566-6666" },
                { id: 10,   firstName: "Don",     lastName: "Griffin",  phoneNumber: "508-566-6666" },
                { id: 11,   firstName: "Nico",    lastName: "Ferrero",  phoneNumber: "508-566-6666" },
                { id: 12,   firstName: "Jason",   lastName: "Johnston", phoneNumber: "508-566-6666" }
            ];
            store.setData(data);

            expect(store.data.length).toEqual(data.length);
        });

        it("should have 0 items", function() {
            store.setData(null);

            expect(store.data.length).toEqual(0);
        });
    });

    describe("setSelectedRecord() method", function() {

        it("should be a function", function() {
            expect(typeof store.setSelectedRecord).toEqual("function");
        });

        it("should have a selected record", function() {

            var model = {
                id: 1,
                firstName: "Rob",
                lastName: "Dougan",
                phoneNumber: "508-566-6666"
            };

            spyOn(store, "fireEvent");
            store.setSelectedRecord(model);

            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, model);
            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, store.getSelectedRecord());
        });

    });
});