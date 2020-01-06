module.exports = (sequelize, type) => {
  return sequelize.define('contentUI', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quotes: {
      type: type.STRING,
      get: function() {
        return JSON.parse(this.getDataValue('quotes'));
      },
      set: function(val) {
        return this.setDataValue('quotes', JSON.stringify(val));
      }
    },
    info: {
      type: type.STRING,
      allowNull: false
    },
    createdAt: {
      type: type.DATE,
      allowNull: false,
      defaultValue: type.fn('NOW')
    }
  });
};
