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
describe("FlowMVC.mvc.service.rpc.AsyncToken", function() {

    // reusable scoped variable
    var token = null;

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


        it("should have an id defined", function() {
            token = Ext.create('FlowMVC.mvc.service.rpc.AsyncToken');
            expect(typeof token.id).toEqual("string");
        });



//        it("should throw an error if the success is null", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", null, failureFunction, scopeObject); }
//            ).toThrow(new Error(FlowMVC.mvc.service.rpc.AsyncToken.ERROR_SUCCESS_MUST_BE_VALID_FUNCTION));
//        });
//
//        it("should throw an error if the failure is not a function", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", successFunction, 100, scopeObject); }
//            ).toThrow(new Error(FlowMVC.mvc.service.rpc.AsyncToken.ERROR_FAILURE_MUST_BE_VALID_FUNCTION));
//        });
//        it("should throw an error if the failure is null", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", successFunction, null, scopeObject); }
//            ).toThrow(new Error(FlowMVC.mvc.service.rpc.AsyncToken.ERROR_FAILURE_MUST_BE_VALID_FUNCTION));
//        });
//
//        it("should throw an error if the scope is not an object", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", successFunction, failureFunction, 100); }
//            ).toThrow(new Error(FlowMVC.mvc.service.rpc.AsyncToken.ERROR_SCOPE_MUST_BE_VALID_OBJECT));
//        });
//        it("should throw an error if the scope is null", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", successFunction, failureFunction); }
//            ).toThrow(new Error(FlowMVC.mvc.service.rpc.AsyncToken.ERROR_SCOPE_MUST_BE_VALID_OBJECT));
//        });
//
//
//        it("should throw no error", function() {
//            expect(
//                function(){ Ext.create("FlowMVC.mvc.service.rpc.AsyncToken", successFunction, failureFunction, scopeObject); }
//            ).not.toThrow();
//        });

    });
});