'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('Users', 'name', {
    //   type: Sequelize.STRING,
    //   allowNull: true
    // });
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true, // allow null for now to avoid validation error
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Users', 'name');
    await queryInterface.removeColumn('Users', 'email');
  }
};
