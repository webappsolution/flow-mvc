Ext.define("FlowMVC.mvc.event.TestEventListener", {
    extend: "FlowMVC.mvc.event.EventDispatcher",

    handleresponse: function(value) {
        console.log('here')
    },

    constructor: function(scope) {
        this.scope = scope;
        this.addGlobalEventListener('dispatchedEvent', this.handleresponse, this);
    }



});
