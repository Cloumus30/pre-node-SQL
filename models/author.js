'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post}) {
      // define association here
      this.hasMany(Post,{foreignKey:'authorId',as:'post'});
    }
  };
  Author.init({
    name: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:{msg:'nama tidak boleh kosong'},
      }
    },
    username: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{msg:'username tidak boleh kosong'},
      }
    }
  }, {
    sequelize,
    modelName: 'Author',
  });
  return Author;
};