const { Model, DataTypes } = require('sequelize');
const Course = require('./Course')

const Subject = (sequelize) => {
    class Subject extends Model {}
    Subject.init({
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      // createdBy: 
      // updatedBy: 
    }, { sequelize, modelName: 'subject', tableName: 'subject', timestamps: true });
    return Subject
}

module.exports = Subject

