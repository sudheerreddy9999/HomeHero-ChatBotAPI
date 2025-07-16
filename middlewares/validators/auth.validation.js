"use strict";

import { header, body, validationResult } from "express-validator";

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

const AuthValidation = { loginValidation };

export default AuthValidation;
