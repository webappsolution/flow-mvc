/**
 * The base class for mock services adds a delay to the mock asynchronous network call in milliseconds.
 */
Ext.define("FlowMVC.mvc.service.mock.AbstractServiceMock", {
    extend: "FlowMVC.mvc.service.AbstractService",

    statics: {

	    /**
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.service.mock.AbstractServiceMock"),

        /**
         * @property {Number} DELAY_IN_MILLISECONDS The default delay of 3 seconds for mock services.
         * @static
         */
        DELAY_IN_MILLISECONDS: 3000
    },

    /**
     * Used by mock services to call a successful mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the successful service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedSuccess: function(response, delayInMilliSeconds) {
        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("delayedSuccess");

	    var token = this.getTokenOrPromise();
	    var me = this;

        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.success(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

    /**
     * Used by mock services to call a failed mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the failed service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedFailure: function(response, delayInMilliSeconds) {
        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("delayedFailure");

	    var token = this.getTokenOrPromise();
	    var me = this;

        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.failure(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

//    /**
//     * Accessor method that determines if this service uses promises or AsyncTokens.
//     *
//     * @returns {FlowMVC.mvc.service.rpc.AsyncToken/Deft.promise.Deferred} Reference to the AsyncToken or
//     * Promise
//     */
//    getTokenOrPromise: function() {
//        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("getTokenOrPromise");
//        return (this.getUsePromise()) ?
//            Ext.create("Deft.promise.Deferred") :
//            Ext.create("FlowMVC.mvc.service.rpc.AsyncToken");
//    },

    /**
     * Helper method used to get the number of milliseconds to delay the mock service callback.
     *
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     * @return {Number} The number of milliseconds to delay the mock service callback.
     */
    getDelayInMilliSeconds: function(delayInMilliSeconds) {
        delayInMilliSeconds = (delayInMilliSeconds == null)
            ? FlowMVC.mvc.service.mock.AbstractServiceMock.DELAY_IN_MILLISECONDS
            : delayInMilliSeconds;

        FlowMVC.mvc.service.mock.AbstractServiceMock.logger.debug("getDelayInMilliSeconds: " + delayInMilliSeconds);
        return delayInMilliSeconds;
    },

    /**
     * Helper method to create random numbers within a given range. Helpful for mocking data.
     *
     * @param {Number} min The minimum or low end of the range.
     * @param {Number} max The maximum or high end of the range.
     * @return {Number} The random generated number.
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

