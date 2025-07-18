"use strict";
import logger from "../utility/logger.utility.js";
import queries from "../config/app/query.config.js";
import mysql from "../config/database/database.config.js";
import { QueryTypes } from "sequelize";

const StoreScrapedFile = async (request) => {
  try {
    const replacements = {
      filename: "homehero-content-123.json",
      data: JSON.stringify(request),
    };
    const query = queries.INSERT_SCRAPED_JSON;
    const data = await mysql.query(query, {
      replacements,
      type: QueryTypes.INSERT,
    });
    return data;
  } catch (error) {
    logger.error({ StoreScrapedFile: error.message });
    throw new Error("Failed to store scraped file");
  }
};

const ScrapingDto = { StoreScrapedFile };
export default ScrapingDto;
