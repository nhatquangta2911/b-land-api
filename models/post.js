module.exports = (sequelize, type) => {
  return sequelize.define('post', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: type.STRING,
      allowNull: false
    },
    banner: {
      type: type.STRING,
      allowNull: true,
      defaultValue: 'https://b-land.s3-ap-southeast-1.amazonaws.com/image13.png'
    },
    description: {
      type: type.STRING,
      allowNull: false
    },
    content: {
      type: type.STRING,
      allowNull: false
    },
    dateCreated: {
      type: type.DATE,
      allowNull: false,
      defaultValue: type.fn('NOW')
    }
  });
};
