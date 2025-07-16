import dotenv from "dotenv"
dotenv.config();

const OTP_TYPES = {
    REGISTER :'1',
    LOGIN:'2'
}

const AppConfig = {
    PORT:process.env.PORT,
    JWT_SECRETKEY_USER:process.env.JWT_SECRETKEY_USER, 
    LOG_LEVEL:process.env.LOG_LEVEL,
    JWT_USER_EXPIRY:process.env.JWT_USER_EXPIRY,
    EMAIL:process.env.EMAIL,
    EMAIL_PASSWORD:process.env.EMAIL_PASSWORD,
    OTP_TYPES:OTP_TYPES,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
}

export default AppConfig;