Ext.define("FlowMVC.mvc.store.TestStore", {
    extend: "FlowMVC.mvc.store.AbstractStore",

    // if you don't wrap this in a config the model property doesn't get set properly.
    config: {

        model: "FlowMVC.mvc.model.TestModel",

        isAutoUpdate: true
    }
});