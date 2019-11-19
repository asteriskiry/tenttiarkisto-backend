const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize')

class File extends Model {}
File.init(
    {
        file_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        file_data: DataTypes.JSONB,
        course_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'course',
                key: 'course_id'
            }
        }
        // createdBy: 
        // updatedBy: 
    }, 
    { sequelize, modelName: 'file', tableName: 'file', timestamps: true, underscored: true }
)

module.exports = File