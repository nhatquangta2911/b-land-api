const Sequelize = require('sequelize');
const config = require('../config.js');
const { logger } = require('../middlewares/logging');

const AccountModel = require('../models/account');
const PostModel = require('../models/post');
const BannerModel = require('../models/banner');

//TODO: Connect DB
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

//TODO: Define Models
const Account = AccountModel(db, Sequelize);
const Post = PostModel(db, Sequelize);
const Banner = BannerModel(db, Sequelize);

//TODO: Relationships
Post.belongsTo(Account);
Account.hasMany(Post);

//TODO: Sync data
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
  let post = await Post.create({
    title: 'Công thức tăng ham muốn ‘yêu’ từ cà phê',
    description:
      'Thêm từng thành phần nguyên liệu trên từ từ vào cốc cà phê đen, khuấy đều tay cho tới khi các thành phần này hòa tan. Tiêu thụ mỗi ngày 1 lần trong vài ngày trước khi ngày “giao ban”.',
    content:
      'Chỉ cần thêm một chút bột ca cao, quế, mật ong vào cốc cà phê đen, bạn sẽ có đồ uống cải thiện ham muốn, tăng sức bền hiệu quả. Mọi người chỉ biết rằng cà phê có thể giúp tăng cường năng lượng, sự tỉnh táo cho một ngày dài. Nếu được thêm một số thành phần nhất định, cà phê cũng có tác dụng cải thiện ham muốn tình dục bằng cách tăng cường tâm trạng và lưu thông máu.',
    accountId: 1
  });
  let banner = await Banner.create({
    banners: [
      'https://s-report.s3-ap-southeast-1.amazonaws.com/banner1.jpg',
      'https://s-report.s3-ap-southeast-1.amazonaws.com/banner3.jpg',
      'https://s-report.s3-ap-southeast-1.amazonaws.com/banner2.jfif'
    ]
  });
};

module.exports = { Account, Post, Banner };
