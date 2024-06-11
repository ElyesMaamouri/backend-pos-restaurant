const yup = require("yup");
const isValidId = require("./idValidation");

const productSchemaValidation = yup.object().shape({
  productName: yup.string().required(),
  productImage: yup.string(),
  productPrice: yup.number().required(),
  description: yup.string().required(),
  categories: yup
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
    subCategories: yup
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
