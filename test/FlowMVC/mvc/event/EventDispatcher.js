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
describe("FlowMVC.mvc.event.EventDispatcher", function() {

    // reusable scoped variable
    var token = null;
    var responder = null;
    var scopeObject = {};
    var successValue = null;
    var failureValue = null;

    var dispatcher = null;
    var wrongEventType = {};
    wrongEventType.type = 'tim';
    var listener = null;

    function listenerFunction(value){
        successValue = value;
    };


    // setup
    beforeEach(function() {
        target = {
            logger: null,
            someOtherProperty: null,
            config: {}
        };
        Deft.Injector.configure({

            ////////////////////////////////////////////
            // LOGGER
            ////////////////////////////////////////////
            logger:                 FlowMVC.logger.Logger.getInjectableLogger()
        });

//        Deft.ioc.Injector.inject( "logger", target );

        dispatcher = Ext.create('FlowMVC.mvc.event.EventDispatcher');
//        responder = Ext.create("FlowMVC.mvc.service.rpc.Responder", successFunction, failureFunction, this);
    });

    // teardown
    afterEach(function() {
        dispatcher = null;
    });

    describe("constructor", function() {


        it("dispatcher should exist", function() {
//            dispatcher.dispatchGlobalEvent(wrongEventType);
            expect(dispatcher).toNotBe(null);
        });

        it("dispatcher logger should be injected", function() {
            expect(dispatcher.getLogger).toNotBe(null);
        });

        it("dispatchGlobalEvent should have dispatched an event", function() {
            spyOn(dispatcher, 'fireEvent');
            dispatcher.dispatchGlobalEvent(wrongEventType);
            expect(dispatcher.fireEvent).toHaveBeenCalled();
        });

//        it("dispatched Global event should be received via listenerFunction", function() {
//            var listener = Ext.create('FlowMVC.mvc.event.TestEventListener', this);
////            listener.init();
//            spyOn(listener, 'handleresponse');
//            dispatcher.dispatchGlobalEvent('dispatchedEvent');
//            expect(listener.handleresponse).toHaveBeenCalled();
//        });

//        it("should have a responder defined", function() {
//            token.addResponder(responder);
//            expect(token.responder).toNotBe(null);
//            expect(token.responder.success).toEqual(successFunction);
//        });
//
//        it("success response should be hello", function() {
//            token.addResponder(responder);
//            token.applySuccess('hello');
//            expect(successValue).toEqual('hello');
//        });
//
//        it("failure response should be hello", function() {
//            token.addResponder(responder);
//            token.applyFailure('hello');
//            expect(successValue).toEqual('hello');
//        });

    });
});