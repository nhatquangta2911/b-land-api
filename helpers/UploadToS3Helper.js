const AWS = require('aws-sdk');
const config = require('../config');
const ErrorHelper = require('../helpers/ErrorHelper');
const { logger } = require('../middlewares/logging');

module.exports = {
  upload: (res, file, callback) => {
    let s3bucket = new AWS.S3({
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY
    });
    var params = {
      Bucket: 'b-land',
      Key: Date.now() + '' + Math.floor(Math.random() * 100000 + 1) + file.name,
      Body: file.data,
      ContentType: file.mime,
      ACL: 'public-read'
    };
    s3bucket.upload(params, (error, data) => {
      if (error) {
        ErrorHelper.InternalServerError(res, error);
      } else {
        logger.error(data);
        callback(data.Location);
      }
    });
  },
  uploadMulti: file =>
    new Promise((resolve, reject) => {
      const s3bucket = new AWS.S3({
        accessKeyId: config.S3_ACCESS_KEY_ID,
        secretAccessKey: config.S3_SECRET_ACCESS_KEY
      });
      const params = {
        Bucket: 'b-land',
        Key:
          Date.now() + '' + Math.floor(Math.random() * 100000 + 1) + file.name,
        Body: file.data,
        ContentType: file.mime,
        ACL: 'public-read'
      };
      s3bucket.upload(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.Location);
        }
      });
    })
};
