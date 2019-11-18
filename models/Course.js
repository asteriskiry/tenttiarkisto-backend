const { Model, DataTypes } = require('sequelize');

const Course = (sequelize) => {
    class Course extends Model {}
    Course.init({
        course_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        course_data: DataTypes.JSONB
        // createdBy: 
        // updatedBy: 
    }, { sequelize, modelName: 'course', tableName: 'course', timestamps: true, underscored: true });
    return Course
}

module.exports = Course
  
