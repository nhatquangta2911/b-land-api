module.exports = (sequelize, type) => {
  return sequelize.define('productPricing', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    basePrice: {
      type: type.INTEGER,
      allowNull: false
    }
  });
};
