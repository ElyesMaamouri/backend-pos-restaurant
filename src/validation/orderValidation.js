const yup = require("yup");
const mongoose = require("mongoose");

const isValidMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

const orderSchemaValidation = yup.object().shape({
 
  user: yup
    .string()
    .test("is-valid-mongo-id", "User is not a valid MongoDB ID", isValidMongoId)
    .required(),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productName: yup
          .string()
          .test(
            "is-valid-mongo-id",
            "User is not a valid MongoDB ID",
            isValidMongoId
          )
          .required()
          .required(),
        quantity: yup.number().required(),
        totalPrice: yup.number().required(),
      })
    )
    .required(),
  total: yup.number().default(0),
  status: yup.string().oneOf(["unpaid", "paid"]).default("unpaid"),
  paymentMethod: yup.string().oneOf(["cash", "card"]).required(),
});

module.exports = orderSchemaValidation;
