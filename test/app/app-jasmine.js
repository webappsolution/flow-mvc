Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    autoCreateViewport: false,
    name: "JasmineExample",
    launch: function() {
        return window.Application = this;
    }
});

Ext.onReady(function() {
    Deft.Injector.configure({
//        companyStore: "JasmineExample.store.CompanyStore"
    });
    return execJasmine();
});