'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weapon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.weapon.belongsTo(models.user)
      models.weapon.belongsToMany(models.strategy, {through: 'weaponStrategy'})
    }
  };
  weapon.init({
    weaponId: {
      type: DataTypes.BIGINT
    },
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    smallIconImageUrl: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'weapon',
  });
  return weapon;
};
