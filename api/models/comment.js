const { Sequelize, DataTypes } = require('sequelize');
module.exports = function(sequelize, DataTypes){
    var comment = sequelize.define('comment', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(4)
        },
        user_id: {
            type: Sequelize.INTEGER(4)
        },
        content: {
            type: Sequelize.STRING(255)
        },
        deleted: {
            allowNull: false,
            type: Sequelize.INTEGER(2)
        },
        created_by: {
            type: Sequelize.STRING(255)
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: Sequelize.STRING(255)
        },
        updated_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        timestamps: false
    });
    return comment;
}