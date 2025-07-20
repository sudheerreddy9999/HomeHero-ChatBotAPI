"use strict";
import { QueryTypes } from "sequelize";
import queries from "../config/app/query.config.js";
import mysql from "../config/database/database.config.js";
import logger from "../utility/logger.utility.js";

const GetUserDTO = async (email = null, mobile_number = null) => {
  try {
    if (!email && !mobile_number) {
      throw new Error("Either email or mobile_number must be provided");
    }

    const query = queries.GET_USER;
    const replacements = {
      email: email ?? null,
      mobile_number: mobile_number ?? null,
    };
    const data = await mysql.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (error) {
    logger.error({ GetUserDTO: error.message });
    throw new Error(error);
  }
};

const AuthDTO = { GetUserDTO };
export default AuthDTO;
