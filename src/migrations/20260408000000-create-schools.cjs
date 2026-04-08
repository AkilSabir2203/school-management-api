"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("schools", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING
            },
            latitude: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            longitude: {
                allowNull: false,
                type: Sequelize.FLOAT
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("schools");
    }
};