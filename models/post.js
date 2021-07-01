'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Author}) {
      // define association here
      this.belongsTo(Author,{foreignKey:'authorId',as:'author'});
    }
  };
  Post.init({
    title: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:{msg:'judul tidak boleh kosong'}
      }
    },
    body: DataTypes.TEXT,
    desc:DataTypes.STRING,
    image: DataTypes.STRING,
    authorId: {
      type: DataTypes.INTEGER,
      validate:{
        notEmpty:{msg:'Isikan Author'}
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};