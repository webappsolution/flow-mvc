describe("FlowMVC.logger.Logger", function() {

	beforeEach(function() {
	});

	afterEach(function() {
	});

	it("should instantiate", function() {

		var mockLogger = Ext.create("FlowMVC.logger.MockLogger");
		mockLogger.log();
		mockLogger.debug();
		mockLogger.info();
		mockLogger.warn();
		mockLogger.error();
		mockLogger.fatal();
	});
});