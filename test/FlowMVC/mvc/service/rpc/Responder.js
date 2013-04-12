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