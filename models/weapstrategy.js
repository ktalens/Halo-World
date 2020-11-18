'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weapStrategy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  weapStrategy.init({
    mapId: DataTypes.BIGINT,
    strategyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'weapStrategy',
  });
  return weapStrategy;
};