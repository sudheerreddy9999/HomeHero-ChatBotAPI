"use strict";
import jwt from "jsonwebtoken";
import AppConfig from "../config/app/app.config.js";
import logger from "../utility/logger.utility.js";

const { JWT_SECRETKEY_USER, JWT_USER_EXPIRY } = AppConfig;

const GenerateToken = async (data) => {
  try {
    const token = jwt.sign(data, JWT_SECRETKEY_USER, {
      expiresIn: JWT_USER_EXPIRY,
    });
    return token;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error.message);
  }
};

const VerifyToken = async (request, response, next) => {
  try {
    let token = request.get("Authorization");
    if (!token) {
      return response
        .status(403)
        .json({ message: "Forbidden You Don't have Access" });
    }
    token = request.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRETKEY_USER);
    request.email = decodedToken.email;
    next();
  } catch (error) {
    logger.error(error.message);
    return response
      .status(403)
      .json({ message: "Forbidden You Don't have Access" });
  }
};

const UserJwtMiddleWare = { GenerateToken, VerifyToken };

export default UserJwtMiddleWare;
