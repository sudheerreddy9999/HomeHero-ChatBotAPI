"use strict";

import mysql from "../config/database/database.config.js";

const getLocalTimestamp = () => {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return Intl.DateTimeFormat("en-IN", options).format(now);
};

const CustomMessage = (errorCode, customMessage, error) => {
  return { errorCode, customMessage, error };
};

const SetTimeZone = async (req, res, next) => {
  await mysql.query("SET time_zone = '+05:30';");
  next();
};

const customUtility = {
  getLocalTimestamp,
  CustomMessage,
  SetTimeZone,
};

export default customUtility;
