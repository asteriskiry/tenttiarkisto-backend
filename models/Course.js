const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize')

class Course extends Model {}
Course.init({
    course_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_data: DataTypes.JSONB,
    subject_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'subject',
            key: 'subject_id'
        }
    }
    // createdBy: 
    // updatedBy: 
}, { sequelize, modelName: 'course', tableName: 'course', timestamps: true, underscored: true });

module.exports = Course
  
