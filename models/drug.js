const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            itemName: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            entpName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            efficiency: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            useMethod: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            warning: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            intrcnt: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            sideEffect: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            depositMethod: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            itemImage: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Drug',
            tableName: 'drugs',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Drug.belongsTo(db.User);
    }
};