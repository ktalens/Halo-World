'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class strategy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.strategy.belongsTo(models.user)
      models.strategy.belongsTo(models.map)
      models.strategy.belongsTo(models.weapon)
    }
  };
  strategy.init({
    description: DataTypes.TEXT,
    gameId: DataTypes.INTEGER,
    mapId: DataTypes.STRING,
    weapId: DataTypes.BIGINT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'strategy',
  });
  return strategy;
};