Ext.define("FlowMVC.mvc.event.TestEventListener", {

    dispatcher: null,

    handleresponse: function(evt) {
        console.log(evt.type);
    },

    listenFor: function(evt) {
        this.dispatcher.addGlobalEventListener(evt.type, this.handleresponse, this);
    }

});
