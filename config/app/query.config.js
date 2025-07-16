import dotenv from "dotenv";

dotenv.config();

const queries = {
  POST_USER: process.env.POST_USER,
  GET_USER: process.env.GET_USER,
  INSERT_OTP: process.env.INSERT_OTP,
  VERIFY_OTP:process.env.VERIFY_OTP
};

export default queries;
