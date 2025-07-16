import pino from "pino";
import dotenv from "dotenv";
import customUtility from "./custom.utility.js";

dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL,
  timestamp: () => `,"time": ${customUtility.getLocalTimestamp()}`,
  formatters: {
    level:(label) => {
        return {level: label}
    }
  },
});

export default logger;
