const Sequelize = require('sequelize');
const config = require('../config.js');
const { logger } = require('../middlewares/logging');

const UserModel = require('../models/user');

var dbConfig = {
  username: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
  host: config.HOST,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_520_ci',
    timestamps: false
  }
};

const db = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = UserModel(db, Sequelize);

const beDummyData = false;
db.sync({
  force: beDummyData
}).then(() => {
  logger.info('[SYNCED] DATABASE & TABLES CREATED ');
  // applyDummy();
});

// const applyDummy = async () => {
//   //TODO: FAKE INITIAL DATA
//   let user1 = await User.create({
//     email: 'shawn@enclave.vn',
//     phone: '0368080534',
//     password: '123456'
//   });
// };

module.exports = { User };
