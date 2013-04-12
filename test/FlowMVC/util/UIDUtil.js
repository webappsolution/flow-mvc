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