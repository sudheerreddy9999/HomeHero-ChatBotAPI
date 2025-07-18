import dotenv from "dotenv";

dotenv.config();

const queries = {
  INSERT_SCRAPED_JSON:process.env.INSERT_SCRAPED_JSON,
    GET_USER: process.env.GET_USER,
    INSERT_CHATBOT_MESSAGE:process.env.INSERT_CHATBOT_MESSAGE
};

export default queries;
