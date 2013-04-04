/*
 Copyright (c) 2013 [Sencha Extensions Contributors](mailto:admin@webappsolution.com)

 WASI Sencha Extensions is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 WASI Sencha Extensions is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with WASI Sencha Extensions.  If not, see <http://www.gnu.org/licenses/>.
 */

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
         * The logger for the object.
         */
        logger: FlowMVC.logger.Logger.getLogger("FlowMVC.mvc.store.AbstractStore")
    },

    /**
     * @event selectedRecordChange
     * Fired when a Model instance has been set as the selected record of Store. You should listen
     * for this event if you have to update a representation of the selected record in this store in your UI.
     * @param {Ext.data.Store} this The store.
     * @param {Ext.data.Model} record The Model instance that is set as the selected record.
     */

    /**
     * @private {Object/Ext.data.Model} _selectedRecord the currently selected record for the store.
     */
    _selectedRecord: null,

    /**
     * Sets the selected record on the store and broadcasts an event with type "selectedRecordChange" with a reference
     * to the store and the selected record.
     *
     * @param {Object/Ext.data.Model} record The record to set as selected on this store.
     */
    setSelectedRecord: function(record) {
        FlowMVC.mvc.store.AbstractStore.logger.debug("setSelectedRecord");

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
     * This method exists to create parity between the ExtJS and Touch SDKs, as ExtJS does not hgve a setData() method.
     *
     * @param {Object[]/Ext.data.Model[]} data
     * Array of Model instances or data objects to load locally. See "Inline data" above for details.
     */
    setData: function(data) {

        if (Ext.getVersion("extjs")) {
            FlowMVC.mvc.store.AbstractStore.logger.info("setData: using 'store.removeAll() and store.add(data)' because ExtJS 4.1 doesn't support store.setData().");
            this.removeAll();
            if ( data )
            {
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
     * @param {Object/Ext.data.Model} model The model to replace existing model in store.
     * @param {String} property The property to use to find model to be replaced.
     */
    update: function(model, property) {
        property = property ? property : "id";

        if (Ext.getVersion("extjs")) {
            var index = this.find(property, model.get(property));

            if(index < 0)
                return;

            this.insert(index, model);
            this.removeAt(index+1);
            FlowMVC.mvc.store.AbstractStore.logger.debug("update: updating ExtJS model with " + property);
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
            }
        }
    }

});