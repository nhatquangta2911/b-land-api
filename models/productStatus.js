module.exports = (sequelize, type) => {
  return sequelize.define('productStatus', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    }
  });
};
