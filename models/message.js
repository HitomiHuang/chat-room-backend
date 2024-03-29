'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  message.init({
    roomName: DataTypes.STRING,
    sendUser: DataTypes.STRING,
    message: DataTypes.TEXT,
    sendTime: DataTypes.DATE,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages'
  });
  return message;
};