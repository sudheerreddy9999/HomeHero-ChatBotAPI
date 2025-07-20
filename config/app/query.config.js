import dotenv from "dotenv";

dotenv.config();

const queries = {
  INSERT_SCRAPED_JSON:process.env.INSERT_SCRAPED_JSON,
    GET_USER: process.env.GET_USER,
    INSERT_CHATBOT_MESSAGE:process.env.INSERT_CHATBOT_MESSAGE,
    GET_CHATBOT_MESSAGES_BY_SESSION: process.env.GET_CHATBOT_MESSAGES_BY_SESSION,
    GET_CHATBOT_MESSAGES_BY_SESSION_LIMIT3: process.env.GET_CHATBOT_MESSAGES_BY_SESSION_LIMIT3,
};

export default queries;
