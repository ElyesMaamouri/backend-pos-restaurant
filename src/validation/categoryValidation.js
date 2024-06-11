const yup = require("yup");
const isValidId = require("./idValidation");

const categorySchemaValidation = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  role: yup.string().oneOf(["categorie", "subCategorie"]).default("categorie").required(),
  subcategories: yup
    .string()
    .nullable() // Allow null or undefined
    .test("is-valid-mongo-id", "Category is not a valid MongoDB ID", function (value) {
      if (!value) return true; // If value is null or undefined, validation passes
      return isValidId(value); // Otherwise, validate as MongoDB ID
    }),
  timestamps: yup.number(),
});

module.exports = categorySchemaValidation;