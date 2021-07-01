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
    await queryInterface.bulkInsert('Authors',[
    {
      name:'Cloudias',
      username:'cloumus30',
      createdAt: new Date,
      updatedAt: new Date,
    },
    {
      name:'Imani',
      username:'imani30',
      createdAt: new Date,
      updatedAt: new Date,
    },
    {
      name:'Pradana',
      username:'pradana30',
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
    await queryInterface.bulkDelete('Authors',null,{});
  }
};
