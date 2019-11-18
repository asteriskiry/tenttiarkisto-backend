const { Model, DataTypes } = require('sequelize');

const File = (sequelize) => {
    class File extends Model {}
    File.init(
        {
            file_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            file_data: DataTypes.JSONB
            // createdBy: 
            // updatedBy: 
        }, 
        { sequelize, modelName: 'file', tableName: 'file', timestamps: true, underscored: true }
    )
    return File
}


module.exports = File