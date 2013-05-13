Ext.define("FlowMVC.logger.MockLogger", {

	statics: {

		/**
		 * The logger for the object.
		 */
		logger: FlowMVC.logger.Logger.getLogger("FlowMVC.logger.MockLogger")
	},

	log: function() {
		FlowMVC.logger.MockLogger.logger.log("log {0} and name = {1}", ["[BMR 0]", "[BMR 1]"]);

		var logMessage = "" +
			"User '{user.username}' successfully logged in with " +
			"password '{user.password}' and has a " +
			"session ID = '{sessionID}'.";

		var jsonToken = {
			user: {
				username: "john@doe.com",
				password: "secret1234"
			},
			sessionID: "C4A56B5B-AC4B-46FB-AE7D-BAF45154A95E"
		};

		FlowMVC.logger.MockLogger.logger.log(logMessage, jsonToken);
	},

	debug: function() {
		FlowMVC.logger.MockLogger.logger.debug("debug");
	},

	info: function() {
		FlowMVC.logger.MockLogger.logger.info("info");
	},

	warn: function() {
		FlowMVC.logger.MockLogger.logger.warn("warn");
	},

	error: function() {
		FlowMVC.logger.MockLogger.logger.error("error");
	},

	fatal: function() {
		FlowMVC.logger.MockLogger.logger.fatal("fatal");
	},

	newLogLine: function(msg) {
		( (msg == null) || (msg == "undefined") ) ? "" : msg;
		FlowMVC.logger.MockLogger.logger.fatal("\n" +
			"-------------------------------------------------------------------------------------------\n" +
			"END " + msg + "\n" +
			"-------------------------------------------------------------------------------------------");
	}
});