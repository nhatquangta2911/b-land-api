module.exports = (sequelize, type) => {
  return sequelize.define('product', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    images: {
      type: type.STRING(1024),
      get: function() {
        return JSON.parse(this.getDataValue('images'));
      },
      set: function(val) {
        return this.setDataValue('images', JSON.stringify(val));
      }
    },
    shortDescription: {
      type: type.STRING,
      allowNull: true
    },
    detailDescription: {
      type: type.STRING,
      allowNull: true
    },
    unitsInStock: {
      type: type.INTEGER,
      allowNull: false
    },
    totalImport: {
      type: type.INTEGER,
      allowNull: false
    },
    weight: {
      type: type.INTEGER,
      allowNull: false
    }
  });
};
