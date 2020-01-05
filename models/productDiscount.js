module.exports = (sequelize, type) => {
  return sequelize.define('productDiscount', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    discountValue: {
      type: type.INTEGER,
      allowNull: false
    },
    discountUnit: {
      type: type.STRING,
      allowNull: false
    },
    lasting: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 7
    },
    amount: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 50
    }
  });
};
