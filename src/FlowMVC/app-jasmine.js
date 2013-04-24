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

describe("During initialization and setup, the application...", function() {

    it("has loaded ExtJS 4", function() {
        expect(Ext).toBeDefined();
        expect(Ext.getVersion()).toBeTruthy();
        return expect(Ext.getVersion().major).toEqual(4);
    });

    it("has loaded Application with expected Application name", function() {
        expect(window.Application).toBeDefined();
        return expect(window.Application.name).toEqual("JasmineExample");
    });

//    it("has created DeftJS IoC items", function() {
//        expect(Deft.ioc.Injector.canResolve("companyStore")).toBeTruthy();
//        return expect(Deft.ioc.Injector.canResolve("some_$unknown$_alias")).toBeFalsy();
//    });

//    return it("can inject dependencies into a target object", function() {
//        var target;
//        target = {
//            companyStore: null,
//            someOtherProperty: null,
//            config: {}
//        };
//        Deft.ioc.Injector.inject("companyStore", target);
//        expect(target.companyStore).toBeTruthy();
//        return expect(target.someOtherProperty).toBeFalsy();
//    });
});