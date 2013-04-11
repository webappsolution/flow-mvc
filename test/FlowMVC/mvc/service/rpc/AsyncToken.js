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
        token = Ext.create('FlowMVC.mvc.service.rpc.AsyncToken');
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

        it("should have a responder defined", function() {
            token.addResponder(responder);
            expect(token.responder).toNotBe(null);
            expect(token.responder.success).toEqual(successFunction);
        });

        it("success response should be hello", function() {
            token.addResponder(responder);
            token.applySuccess('hello');
            expect(successValue).toEqual('hello');
        });

        it("failure response should be hello", function() {
            token.addResponder(responder);
            token.applyFailure('hello');
            expect(successValue).toEqual('hello');
        });

    });
});