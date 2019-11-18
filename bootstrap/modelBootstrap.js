const run = (sequelize) => {
    console.log('*** RUNNING MODELBOOTSTRAP ***')
    const Subject = require('../models/Subject')(sequelize)
    const Course = require('../models/Course')(sequelize)
    const File = require('../models/File')(sequelize)

    Subject.hasMany(Course, {foreignKey: 'course_id'})
    Course.hasMany(File, {foreignKey: 'file_id'})
    Course.belongsTo(Subject, {foreignKey: 'subject_id'})
    File.belongsTo(Course, {foreignKey: 'course_id'})

    sequelize.sync()
}

module.exports = run 