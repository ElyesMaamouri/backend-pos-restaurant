const yup = require("yup");
const isValidId = require("./idValidation");

const productSchemaValidation = yup.object().shape({

    tableNumber: yup.number().required(),
    tableStatus: yup.string().required(),
    orders: yup
    .string()
    .nullable()  
    .test(
      "is-valid-mongo-id",
      "Category is not a valid MongoDB ID",
      function (value) {
        if (!value) return true;  
        return isValidId(value);  
      }
    ),
  timestamps: yup.number(),
});

module.exports = productSchemaValidation;
