"use strict";
import { QueryTypes } from "sequelize";
import queries from "../config/app/query.config.js";
import mysql from "../config/database/database.config.js";
import logger from "../utility/logger.utility.js";

const InsertChatMessageDTO = async (
  user_id = null,
  role = null,
  message,
  session_id
) => {
  try {
    const query = queries.INSERT_CHATBOT_MESSAGE;
    const replacements = {
      user_id: user_id ?? null,
      role: role ?? null,
      message: message ?? null,
      session_id: session_id ?? null,
    };
    const data = await mysql.query(query, {
      replacements,
      type: QueryTypes.INSERT,
    });
    return data;
  } catch (error) {
    console.log(error);
    logger.error({ InsertChatMessageDTO: error.message });
    throw new Error(error);
  }
};

const GetChatMessagesBySessionDTO = async (session_id) => {
  try {
    const query = queries.GET_CHATBOT_MESSAGES_BY_SESSION;
    const replacements = { session_id };
    const data = await mysql.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    logger.error({ GetChatMessagesBySessionDTO: error.message });
    throw new Error(error);
  }
};

const SessionMessages3DTO = async (session_id) => {
  try {
    const query = queries.GET_CHATBOT_MESSAGES_BY_SESSION_LIMIT3;
    const replacements = { session_id };
    const data = await mysql.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    logger.error({ SessionMessages3DTO: error.message });
    throw new Error(error);
  }
};

const ChatDto = {
  InsertChatMessageDTO,
  GetChatMessagesBySessionDTO,
  SessionMessages3DTO,
};

export default ChatDto;
