"use strict";
import { QueryTypes } from "sequelize";
import queries from "../config/app/query.config.js";
import mysql from "../config/database/database.config.js";
import logger from "../utility/logger.utility.js";

const GetUserDTO = async (email = null, mobile_number = null) => {
  try {
    // if (email && typeof email === "string") {
    //   email = email.trim();
    // }

    // if (mobile_number && typeof mobile_number === "string") {
    //   mobile_number = mobile_number.trim();
    // }

    if (!email && !mobile_number) {
      throw new Error("Either email or mobile_number must be provided");
    }

    // let query = `
    //   SELECT user_id, first_name, middle_name, last_name, mobile_number, email, dob, password, profile_img, gender, active
    //   FROM home_hero.users
    //   WHERE
    // `;
    // const replacements = {};

    // if (email && mobile_number) {
    //   query += ` mobile_number = :mobile_number OR email = :email`;
    //   replacements.email = email;
    //   replacements.mobile_number = mobile_number;
    // } else if (email) {
    //   query += ` email = :email`;
    //   replacements.email = email;
    // } else if (mobile_number) {
    //   query += ` mobile_number = :mobile_number`;
    //   replacements.mobile_number = mobile_number;
    // }

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
