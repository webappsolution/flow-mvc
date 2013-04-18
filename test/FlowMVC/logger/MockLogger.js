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
Ext.define("FlowMVC.logger.MockLogger", {

	statics: {

		/**
		 * The logger for the object.
		 */
		logger: FlowMVC.logger.Logger.getLogger("FlowMVC.logger.MockLogger")
	},

	log: function() {
		FlowMVC.logger.MockLogger.logger.log("log {0} and name = {1}", ["[BMR 0]", "[BMR 1]"]);

		var source =
			'<table border="{border}">' +
				'<tr><th>Last</th><td>{user.last}</td></tr>' +
				'<tr><th>First</th><td>{user.first}</td></tr>' +
			'</table>';

		var fields = {
			user: {
				first : "Thomas",
				last : "Burleson"
			},
			border: 2
		};

		FlowMVC.logger.MockLogger.logger.log(source, fields);
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
	}
});