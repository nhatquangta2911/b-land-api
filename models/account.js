module.exports = (sequelize, type) => {
  return sequelize.define('account', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: type.STRING,
      allowNull: false
    },
    avatar: {
      type: type.STRING,
      allowNull: true,
      defaultValue:
        'https://s-report.s3-ap-southeast-1.amazonaws.com/service_default_avatar_182956.png'
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    password: {
      type: type.STRING,
      allowNull: false
    }
  });
};
