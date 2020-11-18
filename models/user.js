'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
const passport = require('../config/ppConfig');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.weapon)
      models.user.hasMany(models.map)
      models.user.hasMany(models.strategy)
    }
  };
  user.init({
    gamertag: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2,30],
          msg: 'Name must be between 2 and 30 characters long.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0,99],
          msg: 'Password must be between 0 and 99 characters.'
        }
      }
    }
  },{
    sequelize,
    modelName: 'user',
  });

  // user.addHook('beforeCreate',async(pendingUser,options)=>{
  //   await bcrypt.hash(pendingUser.password, 10)
  //   .then(hashedPassword=>{
  //     console.log(`${pendingUser.password} became -------------->${hashedPassword}`)
  //     pendingUser.password = hashedPassword
  //   })
  // })

  user.addHook('beforeCreate',(pendingUser,options)=>{
    let hashedPassword = bcrypt.hashSync(pendingUser.password,10)
    console.log(`${pendingUser.password} became ------> ${hashedPassword}`)
    pendingUser.password= hashedPassword
  })

  user.prototype.validPassword = async function(passwordInput){
    let match = await bcrypt.compare(passwordInput, this.password)
    return match
  }
  return user;
};

