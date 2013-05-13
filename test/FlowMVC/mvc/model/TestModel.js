Ext.define("FlowMVC.mvc.model.TestModel", {
    extend: "Ext.data.Model",

//    config: {

    idProperty: "id",

    fields: [
        { name: "id",           type: "int"     },
        { name: "firstName",    type: "string"  },
        { name: "lastName",     type: "string"  },
        { name: "email",        type: "string"  },
        { name: "phoneNumber",  type: "string"  },
        { name: "startDate",    type: "date",       dateFormat: "c" }
    ],

    validations: [
        { type: "presence", field: "id" },
        { type: "presence", field: "firstName",     message: "Please enter a first name." },
        { type: "presence", field: "lastName",      message: "Please enter a last name." }
    ]
//    }
});
