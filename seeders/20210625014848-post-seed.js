'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Posts',[
      {
        title:'post 1',
        desc:'description 1',
        body:'lorem akjsdk a;lsd ;lzkmxclkwpoq ',
        authorId:1,
        createdAt: new Date,
        updatedAt: new Date,
      },
      {
        title:'post 2',
        body:';asd;laslh lashduqwh kasdjlzxbcoi akjsdlkzncxmn',
        desc:'description 2',
        authorId:2,
        createdAt: new Date,
        updatedAt: new Date,
      },
      {
        title:'post 3',
        body:'isi post 3',
        desc:'description 3',
        authorId:3,
        createdAt: new Date,
        updatedAt: new Date,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts',null,{});
  }
};
