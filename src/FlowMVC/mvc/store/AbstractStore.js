/**
 * The abstract store classes provides additional base functionality to update records in the store and
 * force auto syncs without requiring the use of a proxy. Treats the store more like a collection.
 * 
 * This file is part of WASI Sencha Extensions.
 */
Ext.define("FlowMVC.mvc.store.AbstractStore", {
    extend: "Ext.data.Store",

    statics: {

	    /**
	     * @property {FlowMVC.logger.Logger} logger The logger for the object.
	     * @static
	     */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.store.AbstractStore"),

        /**
         * @property {String} ERROR_SET_DATA_PARAM_NOT_VALID An error string indicating that the setData() method's parameter
         * cannot be anything other than null or an array.
         * @static
         */
        ERROR_SET_DATA_PARAM_NOT_VALID: "The setData() method's 'data' parameter must be an array or null.",

        /**
         * @property {String} ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID An error string indicating that the setSelectedRecord()
         * method's parameter cannot be anything other than null or an instance of the expected model for this store.
         * @static
         */
        ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID: "The setSelectedRecord() method's 'record' parameter must null or " +
            "be an instance of the expected model for this store.",

	    /**
	     * @property {String} ERROR_SET_UPDATE_PARAM_NOT_VALID An error string indicating that the update()
	     * method's parameter must be not-null and an instance of the expected model for this store.
	     * @static
	     */
	    ERROR_SET_UPDATE_PARAM_NOT_VALID: "The update() method's 'record' parameter must be not null and " +
		    "be an instance of the expected model for this store."
    },

    /**
     * @event selectedRecordChange
     * Fired when a Model instance has been set as the selected record of Store. You should listen
     * for this event if you have to update a representation of the selected record in this store in your UI.
     * @param {Ext.data.Store} this The store.
     * @param {Ext.data.Model} record The Model instance that is set as the selected record.
     */

	/**
	 * @event updatedRecord
	 * Fired when a Model instance has been updated in the Store. You should listen
	 * for this event if you have to update a representation of the selected record in this store in your UI.
	 * @param {Ext.data.Store} this The store.
	 * @param {Ext.data.Model} record The Model instance that was updated.
	 */

    /**
     * @private {Object/Ext.data.Model} _selectedRecord the currently selected record for the store.
     */
    _selectedRecord: null,

    /**
     * Sets the selected record on the store and broadcasts an event with type "selectedRecordChange" with a reference
     * to the store and the selected record.
     *
     * @param {Ext.data.Model} record The record to set as selected on this store.
     */
    setSelectedRecord: function(record, autoAdd) {
        FlowMVC.mvc.store.AbstractStore.logger.debug("setSelectedRecord");

        // the record parameter must either be null an instance of the expected model for this store
        if ( !this.isModel(record) && (record != null) ) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_SELECTED_RECORD_PARAM_NOT_VALID
            });
        }

        // default autoAdd to true
        // TODO: create util to default values
        autoAdd = typeof autoAdd !== "undefined" ? autoAdd : true;

        // if the record isn't in the store and autoAdd is set to true, then add it
        if( record && autoAdd && (this.getById(record.id) == null) ) {
            this.add(record);
        }

        this._selectedRecord = record;
        this.fireEvent("selectedRecordChange", this, record);
    },

    /**
     * Accessor for this store's selected record.
     *
     * @return {Object/Ext.data.Model} The selected record for this store.
     */
    getSelectedRecord: function() {
        FlowMVC.mvc.store.AbstractStore.logger.debug("getSelectedRecord");

        return this._selectedRecord;
    },

    /**
     * Removes all records from the store and makes sure the selected record is null.
     */
    removeAll: function() {
        FlowMVC.mvc.store.AbstractStore.logger.debug("removeAll");

        this._selectedRecord = null;
        this.callParent(arguments);
    },

    /**
     * This method exists to create parity between the ExtJS and Touch SDKs, as ExtJS does not have a setData() method.
     *
     * @param {Object[]/Ext.data.Model[]} data
     * Array of Model instances or data objects to load locally. See "Inline data" above for details.
     */
    setData: function(data) {

        // the data parameter must either be null or an array
        if (!Ext.isArray(data) && (data != null)) {
            Ext.Error.raise({
                msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_DATA_PARAM_NOT_VALID
            });
        }

        // do some quick sencha framework checking as there's no setData() in ExtJS.
        if (Ext.getVersion("extjs")) {
            FlowMVC.mvc.store.AbstractStore.logger.info("setData: using 'store.removeAll() and store.add(data)' because ExtJS 4.1 doesn't support store.setData().");
            this.removeAll();
            if(data) {
                this.add(data);
            } else {
                this.removeAll();
            }
        } else {
            FlowMVC.mvc.store.AbstractStore.logger.info("setData");
            this.callParent(arguments);
        }
    },

    /**
     * Update a model object on the store by replacing it with a new model
     *
     * @param {Ext.data.Model} model The model to replace existing model in store.
     * @param {String} property The property to use as the id to find the model to be replaced.
     */
    update: function(model, property) {
        property = property ? property : "id";

	    // the record parameter must be non-null and an instance of the expected model for this store
	    if ( (model == null) || (this.isModel(model) == false) ) {
		    Ext.Error.raise({
			    msg: FlowMVC.mvc.store.AbstractStore.ERROR_SET_UPDATE_PARAM_NOT_VALID
		    });
	    }

        if (Ext.getVersion("extjs")) {
            var index = this.find(property, model.get(property));

            if(index < 0)
                return;

            this.insert(index, model);
            this.removeAt(index+1);
            FlowMVC.mvc.store.AbstractStore.logger.debug("update: updating ExtJS model with " + property);
	        this.fireEvent("updatedRecord", this, model);
	        return model;
        } else {
            var value = model.data[property];
            var record = this.findRecord(property, value);
            if(record) {
//                record.setData(model);
                record = model;
                // force the store to update correctly and broadcast refresh events
                // so views using this store update correctly
                record.dirty = true;
                this.sync();
                FlowMVC.mvc.store.AbstractStore.logger.debug("update: updating Touch model with " + property);
	            this.fireEvent("updatedRecord", this, record);
	            return model;
            }
        }

	    return null;
    },

	/**
	 * Determines if the model parameter is the expected model type for this store.
	 *
	 * @param {Object/Ext.data.Model} model The object being tested to determine if it's the expected model for
	 * this store.
	 * @return {Boolean} A flag indicating if the parameter is the expected model for this store.
	 */
	isModel: function(record) {

		// ExtJS and Touch get to the underlying model differently
		var modelClass = (Ext.getVersion("extjs")) ? this.model : this._model;
		var bool = (record instanceof modelClass);
		return (record instanceof modelClass);
	}

});