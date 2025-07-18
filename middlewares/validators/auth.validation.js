"use strict";

import { header, validationResult } from "express-validator";
import dotenv from "dotenv";
import logger from "../../utility/logger.utility.js";
import jwt from "jsonwebtoken";

dotenv.config();

const loginValidation = [
  header("email")
    .trim()
    .if(header("mobile_number").isEmpty())
    .notEmpty()
    .withMessage("Please Enter Email Or MobileNumber"),
  header("mobile_number")
    .trim()
    .if(header("email").isEmpty())
    .notEmpty()
    .withMessage("Please Enter Email Or MobileNumber"),
  header("password")
    .trim()
    .if(header("otp").isEmpty())
    .notEmpty()
    .withMessage("Please Enter Valid Password")
    .isLength({ min: 4, max: 16 })
    .withMessage("Password Should be within 4 to 16 characters"),
    header("otp")
    .trim()
    .if(header("password").isEmpty())
    .notEmpty()
    .withMessage("Please Enter Valid Password")
    .isLength({ min: 4, max: 4 })
    .withMessage("Password Should be within 4 to 16 characters"),
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
        .status(400)
        .json({ message: "Bad Request", error: errors });
    }
    next();
  },
];


const GetUserDeatilsFromToken = async (token) => {
  try {
    const secret = process.env.JWT_SECRETKEY_USER;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    logger.error({ValidationError:err})
    return "Invalid Token"
  }
};

const AuthValidation = { loginValidation,GetUserDeatilsFromToken };

export default AuthValidation;
