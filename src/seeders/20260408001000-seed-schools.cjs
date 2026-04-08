"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "schools",
            [
                {
                    "name": "Rajkumar College (RKC)",
                    "address": "G.E. Road, Mukut Nagar, Raipur, Chhattisgarh 492001",
                    "latitude": 21.2392,
                    "longitude": 81.6166
                },
                {
                    "name": "St. Xavier's High School",
                    "address": "Avanti Vihar, Ravigram, Raipur, Chhattisgarh 492006",
                    "latitude": 21.2471,
                    "longitude": 81.6667
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("schools", null, {});
    }
};