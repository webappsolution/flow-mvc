Ext.define("FlowMVC.mvc.event.TestEventBroadcaster", {

    dispatcher: null,

    broadcastEvent: function(evt) {
        this.dispatcher.dispatchGlobalEvent(evt);
    }

});
