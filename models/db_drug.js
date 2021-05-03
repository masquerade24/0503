const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(10),
                primaryKey: true,
                allowNull: false,
            },
            itemName: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            printFront: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            drugShape: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            colorClass1: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            colorClass2: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            formCodeName: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'DB_drug',
            tableName: 'DB_drugs',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate() {
    }
};