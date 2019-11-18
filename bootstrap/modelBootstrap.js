const run = (sequelize) => {
    console.log('*** RUNNING MODELBOOTSTRAP ***')
    const Subject = require('../models/Subject')(sequelize)
    const Course = require('../models/Course')(sequelize)
    const Exam = require('../models/Exam')(sequelize)
    const File = require('../models/File')(sequelize)

    Subject.hasMany(Course)
    Course.hasMany(Exam)
    Course.belongsTo(Subject)
    Exam.hasMany(File)
    Exam.belongsTo(Course)
    File.belongsTo(Exam)

    sequelize.sync()
}

module.exports = run 