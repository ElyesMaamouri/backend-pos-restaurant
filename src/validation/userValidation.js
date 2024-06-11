const yup = require("yup");
const isValidId = require("./idValidation");


const workRangeSchema = yup.object().shape({
    start: yup.string().required(),
    end: yup.string().required(),
  });
const userSchemaValidation = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.number().required(),
    password : yup.string().required(),
    role: yup.string().oneOf(["admin", "serveur", "cuisine"]).default("serveur").required(),
    workRangeHours: yup.array().of(workRangeSchema).required(),
 
  timestamps: yup.number(),
});


const loginSchemaValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(70).required(),
});
module.exports = {userSchemaValidation, loginSchemaValidation};
