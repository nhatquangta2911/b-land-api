module.exports = (sequelize, type) => {
  return sequelize.define('banner', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    banners: {
      type: type.STRING,
      get: function() {
        return JSON.parse(this.getDataValue('banners'));
      },
      set: function(val) {
        return this.setDataValue('banners', JSON.stringify(val));
      }
    },
    createdAt: {
      type: type.DATE,
      allowNull: false,
      defaultValue: type.fn('NOW')
    }
  });
};
