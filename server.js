"use strict";
process.env.PUPPETEER_CACHE_DIR = '/opt/render/.cache/puppeteer';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "./config/database/database.config.js";
import logger from "./utility/logger.utility.js";
import ChatRouter from "./routes/chat.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use('/chat',ChatRouter)

const mySqlDatabaseConnection = async () => {
  try {
    await mysql.authenticate();
    logger.info("database connected sucessfully")
  } catch (error) {
    console.error(error);
  }
};

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`server started on Port ${PORT}`);
    });
  } catch (error) {
    logger.info(error)
    process.exit(-1);
  }
};
mySqlDatabaseConnection();

startServer();
