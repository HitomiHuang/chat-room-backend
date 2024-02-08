'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Messages', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'text'
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'type');
  }
};
