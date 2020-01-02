require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  //TODO: process.env.USERNAME was duplicated with window username
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  HOST: process.env.HOST
  //   TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  //   REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
  //   TOKEN_LIFE: process.env.TOKEN_LIFE,
  //   REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,
  //   S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  //   S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  //   MAILER_USER: process.env.MAILER_USER,
  //   MAILER_PASSWORD: process.env.MAILER_PASSWORD,
  //   FCM_KEY_PAIR: process.env.FCM_KEY_PAIR,
  //   FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
  //   FCM_TOKEN: process.env.FCM_TOKEN,
  //   FCM_PROJECT_ID: process.env.FCM_PROJECT_ID,
  //   FCM_CLIENT_EMAIL: process.env.FCM_CLIENT_EMAIL,
  //   FCM_PRIVATE_KEY: process.env.FCM_PRIVATE_KEY,
  //   FCM_TO: process.env.FCM_TO
};
