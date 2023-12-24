import { body,param, validationResult } from "express-validator";
import { BadRequestError,NotFoundError,UnauthorizedError } from "../errors/customErrors.js";
import mongoose from "mongoose";
import Estate from "../models/estate-model.js"
import User from "../models/user-model.js"

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job"))
        {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateListingInput = withValidationErrors([
  body("name").notEmpty().withMessage("Estate name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("beds").notEmpty().withMessage("Beds number is required"),
  body("baths").notEmpty().withMessage("baths number is required"),
  body("price").notEmpty().withMessage("Price is required"),
  body("address").notEmpty().withMessage("Estate address is required"),
  body("type")
    .notEmpty()
    .isIn(["rent", "sell"])
    .withMessage("invalid type value"),
]);

export const validateIdParam = withValidationErrors([ 
  param("id").custom(async (value,{req}) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const Listing = await Estate.findById(value);
    if (!Listing) throw new NotFoundError(`no job with id : ${value}`);
    const isOwner = req.user?.userId === Listing.createdBy.toString();
    if (!isOwner)
    { throw new UnauthorizedError("not authorized to access this route") };
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("userName").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8"
    ),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("userName").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8"
    ),
]);