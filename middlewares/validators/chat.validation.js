"use strict";

import {  query, validationResult } from "express-validator";

const ValidateSessionId = [
  query("session_id").trim().notEmpty().withMessage("Session ID is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  },
];

const ChatValidation = { ValidateSessionId };
export default ChatValidation;
