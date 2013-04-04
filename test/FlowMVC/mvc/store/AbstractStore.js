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

        it("should be a function", function() {
            expect(typeof store.setData).toEqual("function");
        });

        it("should have 13 items", function() {
            var data = [
                { foo: 0,    bar: "Tommy"   },
                { foo: 1,    bar: "Rob"     },
                { foo: 2,    bar: "Ed"      },
                { foo: 3,    bar: "Jamie"   },
                { foo: 4,    bar: "Aaron"   },
                { foo: 5,    bar: "Dave"    },
                { foo: 6,    bar: "Jacky"   },
                { foo: 7,    bar: "Abraham" },
                { foo: 8,    bar: "Jay"     },
                { foo: 9,    bar: "Nigel"   },
                { foo: 10,   bar: "Don"     },
                { foo: 11,   bar: "Nico"    },
                { foo: 12,   bar: "Jason"   }
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
                bar: "Rob"
            };

            spyOn(store, "fireEvent");
            store.setSelectedRecord(model);

            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, model);
            expect(store.fireEvent).toHaveBeenCalledWith("selectedRecordChange", store, store.getSelectedRecord());
        });

    });
});