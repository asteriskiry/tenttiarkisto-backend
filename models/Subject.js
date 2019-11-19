const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize')

class Subject extends Model {}
Subject.init({
    subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subject_data: DataTypes.JSONB
    // createdBy: 
    // updatedBy: 
}, { sequelize, modelName: 'subject', tableName: 'subject', timestamps: true, underscored: true });

module.exports = Subject
