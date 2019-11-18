const { Model, DataTypes } = require('sequelize');
const Exam = require('./Exam')
const Subject = require('./Subject')

const Course = (sequelize) => {
    class Course extends Model {}
    Course.init({
        //subject: Subject,
        code: DataTypes.STRING,
        name: DataTypes.STRING,
        // createdBy: 
        // updatedBy: 
    }, { sequelize, modelName: 'course', tableName: 'course', timestamps: true });
    return Course
}

module.exports = Course

