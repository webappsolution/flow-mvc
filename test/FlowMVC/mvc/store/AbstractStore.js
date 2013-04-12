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
describe("FlowMVC.mvc.store.AbstractStore", function() {

    // reusable scoped variable
    var store = null;
    var mockModel = null;
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

    // setup
    beforeEach(function() {
        store = Ext.create("FlowMVC.mvc.store.TestStore");
        mockModel = Ext.create("FlowMVC.mvc.model.TestModel", {
            id: 0,
            firstName: "Tommy",
            lastName: "Maintz",
            phoneNumber: "508-566-6666"
        });
    });

    // teardown
    afterEach(function() {
        store = null;
        mockModel = null;
    });

    describe("setData() method", function() {


        var item = data[data.length-1];

        it("should be a function", function() {
            expect(typeof store.setData).toEqual("function");
        });

        it("should have " + data.length + " items", function() {
            store.setData(data);
            expect(store.data.length).toEqual(data.length);
        });

        it("should have an item with an id of " + item.id, function() {
            store.setData(data);
            var model = store.getById(item.id);
            expect(model.get("id")).toEqual(item.id);
        });

        it("should have 0 items", function() {
            store.setData(null);
            expect(store.data.length).toEqual(0);
        });

        it("should throw an error if the parameter is not an array and not null", function() {
            store.setData(notArrayData);
            var notArrayData = {
                id: 0,
                firstName: "John Doe"
            };
            expect(
                function(){ store.setData(notArrayData); }
            ).toThrow(new Error(FlowMVC.mvc.store.AbstractStore.ERROR_SET_DATA_PARAM_NOT_VALID));
        });
    });

    describe("setSelectedRecord() method", function() {

        it("should be a function", function() {
            expect(typeof store.setSelectedRecord).toEqual("function");
        });

        it("should throw an error if the parameter is not a not null OR an instance of the store's model", function() {

            var badModel = {
                id: 0,
                firstName: "Tommy",
                lastName: "Maintz",
                phoneNumber: "508-566-6666"
            };

            expect(
                function(){ store.setSelectedRecord(badModel); }
            ).toThrow(new Error(FlowMVC.mvc.store.AbstractStore.ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID));
            expect(store.getSelectedRecord()).toBeNull();
        });

        it("should have a selected record equal to the model set on it", function() {

            store.setSelectedRecord(mockModel);
            expect(store.getSelectedRecord()).toEqual(mockModel);
        });

        it("should have a selected record added to to the store if not already in the store and autoAdd = true", function() {

            store.setSelectedRecord(mockModel);
            expect(store.data.length).toEqual(1);
            var model = store.getById(mockModel.get("id"));
            expect(model).toEqual(mockModel);
        });

        it("should have raised an event for a selected record with the selected record in it", function() {

            spyOn(store, "fireEvent");
            store.setSelectedRecord(mockModel);

            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, mockModel);
            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, store.getSelectedRecord());
        });

	    it("should have raised an event for a selected record and handled by a listener function of another object", function() {

		    var listener = {
			    onSelectedRecordChange: function(store, record) {
				    console.error("onSelectedRecordChange");
			    }
		    };

		    store.addListener("selectedRecordChange", listener.onSelectedRecordChange)
		    spyOn(listener, "onSelectedRecordChange").andCallThrough();
		    store.setSelectedRecord(mockModel);
		    expect(listener.onSelectedRecordChange).toHaveBeenCalled();
//		    expect(listener.onSelectedRecordChange).toHaveBeenCalledWith(store, mockModel);
	    });

    });

    describe("removeAll() method", function() {

        // setup
        beforeEach(function() {
            store.setData(data);
        });

        // teardown
        afterEach(function() {
            store.setData(null);
        });

        it("should be a function", function() {
            expect(typeof store.removeAll).toEqual("function");
        });

        it("should remove all items", function() {
            expect(store.data.length).toEqual(data.length);
            store.removeAll();
            expect(store.data.length).toEqual(0);
        });

        it("should have null for a selected record", function() {
            store.removeAll();
            expect(store.getSelectedRecord()).toBeNull();
        });
    });
});