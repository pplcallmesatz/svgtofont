'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // No-op: email column already created in Users table
  },

  async down (queryInterface, Sequelize) {
    // No-op: nothing to revert
  }
};
