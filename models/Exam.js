const { Model, DataTypes } = require('sequelize');
const Course = require('./Course')
const File = require('./File')

const Exam = (sequelize) => {
    class Exam extends Model {}
    Exam.init({
        date: DataTypes.STRING,
        // createdBy: 
        // updatedBy: 
    }, { sequelize, modelName: 'exam', tableName: 'exam', timestamps: true })
    return Exam
}

module.exports = Exam