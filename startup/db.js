const Sequelize = require('sequelize');
const config = require('../config.js');
const { logger } = require('../middlewares/logging');

const AccountModel = require('../models/account');

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

const Account = AccountModel(db, Sequelize);

const isSync = true;
db.sync({
  force: isSync
}).then(() => {
  logger.info('[SYNCED] DATABASE & TABLES CREATED ');
  if (isSync) {
    applyDummy();
  }
});

const applyDummy = async () => {
  let account = await Account.create({
    name: 'Tạ Nhật Phong',
    email: 'tanhatphong@gmail.com',
    phone: '0931964784',
    password: '$2a$10$ivZecdz7qRZHuAqXoL9pmO11G2gByx9x9K3cxvnE0U7r7ACzxnWNC',
    avatar:
      'https://s-report.s3-ap-southeast-1.amazonaws.com/service_default_avatar_182956.png'
  });
};

module.exports = { Account };
