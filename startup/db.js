const Sequelize = require('sequelize');
const config = require('../config.js');
const { logger } = require('../middlewares/logging');

const AccountModel = require('../models/account');
const PostModel = require('../models/post');
const BannerModel = require('../models/banner');
const ContentUIModel = require('../models/contentUI');
const ProductModel = require('../models/product');
const ProductDiscountModel = require('../models/productDiscount');
const ProductPricingModel = require('../models/productPricing');
const ProductStatusModel = require('../models/productStatus');
const ProductTypeModel = require('../models/productType');

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
const ContentUI = ContentUIModel(db, Sequelize);
const Product = ProductModel(db, Sequelize);
const ProductDiscount = ProductDiscountModel(db, Sequelize);
const ProductPricing = ProductPricingModel(db, Sequelize);
const ProductStatus = ProductStatusModel(db, Sequelize);
const ProductType = ProductTypeModel(db, Sequelize);

//TODO: Relationships
Post.belongsTo(Account);
Account.hasMany(Post);

ProductStatus.hasMany(Product);
Product.belongsTo(ProductStatus);
ProductType.hasMany(Product);
Product.belongsTo(ProductType);
Product.hasOne(ProductPricing);
Product.hasOne(ProductDiscount);

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
  let contentUI = await ContentUI.create({
    quotes: ['Quote1', 'Quote2', 'Quote3'],
    info: 'About us'
  });
  let productStatus = await ProductStatus.create({
    name: 'Sold-out'
  });
  let productType1 = await ProductType.create({
    name: 'Cà phê hạng A',
    description: 'Hạng A'
  });
  let productType2 = await ProductType.create({
    name: 'Cà phê hạng B',
    description: 'Hạng B'
  });
  let product = await Product.create({
    name: 'CÀ PHÊ RANG XAY B-LAND A 450G',
    images: [
      'https://b-land.s3-ap-southeast-1.amazonaws.com/coffee0.jpg',
      'https://b-land.s3-ap-southeast-1.amazonaws.com/coffee1.jpg',
      'https://b-land.s3-ap-southeast-1.amazonaws.com/coffee2.jpg',
      'https://b-land.s3-ap-southeast-1.amazonaws.com/coffee3.jpg'
    ],
    shortDescription: 'Chất lượng hảo hạng',
    detailDescription: 'Vị đậm, đặc trưng riêng không lẫn với các cà phê khác',
    unitsInStock: 300,
    totalImport: 300,
    weight: 450,
    productStatusId: 1,
    productTypeId: 2
  });
  let productPricing = await ProductPricing.create({
    basePrice: 150000,
    productId: 1
  });
  let productDiscount = await ProductDiscount.create({
    discountValue: 30,
    discountUnit: 1000,
    lasting: 2,
    amount: 20,
    productId: 1
  });
};

module.exports = {
  Account,
  Post,
  Banner,
  ContentUI,
  Product,
  ProductDiscount,
  ProductPricing,
  ProductStatus,
  ProductType
};
