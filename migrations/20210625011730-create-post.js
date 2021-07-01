'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      desc:{
        type:Sequelize.STRING,
      },
      image:{
        type: Sequelize.STRING
      },
      authorId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(()=>{
      queryInterface.addConstraint('Posts',{
        type:'FOREIGN KEY',
        fields:['authorId'],
        name:'FK_posts',
        references:{
          table:'Authors',
          field:'id'
        },
        onDelete:'cascade',
        onUpdate:'cascade',
      });
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};