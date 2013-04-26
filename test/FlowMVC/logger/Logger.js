describe("FlowMVC.logger.Logger", function() {

	beforeEach(function() {
	});

	afterEach(function() {
	});

	it("should instantiate from the static getLogger()", function() {

		var mockLogger = FlowMVC.logger.Logger.getLogger("FlowMVC.logger.MockLogger");
		expect(mockLogger).not.toBeNull();
	});

	it("should instantiate inside another object", function() {

		var mockLogger = Ext.create("FlowMVC.logger.MockLogger");
		expect(mockLogger).not.toBeNull();
		expect(FlowMVC.logger.MockLogger.logger).not.toBeNull();
	});

	it("should log to the console", function() {

		var mockLogger = Ext.create("FlowMVC.logger.MockLogger");
		mockLogger.log("test");
		mockLogger.debug();
		mockLogger.info();
		mockLogger.warn();
		mockLogger.error();
		mockLogger.fatal();

		mockLogger.newLogLine();
	});

	it("should log only above the level set -- WARN", function() {

		var level = FlowMVC.logger.Logger.LEVEL_WARN;
		var mockLogger = Ext.create("FlowMVC.logger.MockLogger");
		FlowMVC.logger.Logger.setLevel(level);
		expect(FlowMVC.logger.Logger.level).toEqual(level);
		mockLogger.log();
		mockLogger.debug();
		mockLogger.info();
		mockLogger.warn();
		mockLogger.error();
		mockLogger.fatal();

		mockLogger.newLogLine("testing setting log level");
	});

	it("should log acceptable filter", function() {

		var FlowMVCFilter = "FlowMVC";

		FlowMVC.logger.Logger.setLevel(FlowMVC.logger.Logger.LEVEL_ALL);
		var mockLogger = Ext.create("FlowMVC.logger.MockLogger");
		FlowMVC.logger.Logger.addFilter(FlowMVCFilter);
		FlowMVC.logger.Logger.addFilter("Test");
		mockLogger.log();
		FlowMVC.logger.Logger.removeFilter(FlowMVCFilter);
		mockLogger.log();

		FlowMVC.logger.Logger.addFilter(FlowMVCFilter);
		mockLogger.newLogLine("testing setting filters");
	});
});