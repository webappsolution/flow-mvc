/*
 Copyright (c) 2013 [Web App Solution, Inc.](mailto:admin@webappsolution.com)

 CafeTownsend Sencha Touch DeftJS PoC is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 CafeTownsend Sencha Touch DeftJS PoC is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with CafeTownsend Sencha Touch DeftJS PoC.  If not, see <http://www.gnu.org/licenses/>.
 */
describe("FlowMVC.mvc.store.AbstractStore", function() {

    // reusable scoped variable
    var store = null;

    // setup
    beforeEach(function() {
        store = Ext.create("FlowMVC.mvc.store.TestStore");
    });

    // teardown
    afterEach(function() {
        store = null;
    });

    describe("setData() method", function() {

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

        it("should have a selected record", function() {

            var model = Ext.create("FlowMVC.mvc.model.TestModel", {
                id: 0,
                firstName: "Tommy",
                lastName: "Maintz",
                phoneNumber: "508-566-6666"
            });

            store.setSelectedRecord(model);
            expect(store.getSelectedRecord()).toEqual(model);
        });

//        it("should have raised an event for a selected record", function() {
//
//            var model = {
//                id: 1,
//                bar: "Rob"
//            };
//
//            spyOn(store, "fireEvent");
//            store.setSelectedRecord(model);
//
//            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, model);
//            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, store.getSelectedRecord());
//        });

    });
});