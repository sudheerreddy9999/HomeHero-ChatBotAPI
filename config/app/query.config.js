import dotenv from "dotenv";

dotenv.config();

const queries = {
  INSERT_SCRAPED_JSON:process.env.INSERT_SCRAPED_JSON
};

export default queries;
