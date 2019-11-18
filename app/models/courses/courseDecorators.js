const { formatOrNull } = require('../../helpers/helpers')
const decorate = courseResult => {
  const {
    course_id: id,
    course_data: courseData,
    subject_id: subjectId,
    created_at: createdAt,
    updated_at: updatedAt } = courseResult
  const {
    name
  } = courseData
  return {
    id,
    subjectId,
    name,
    createdAt: formatOrNull(createdAt),
    updatedAt: formatOrNull(updatedAt)
  }
}

const decorateList = courseResults =>
  courseResults.map(decorate)


module.exports = {
  decorate,
  decorateList
}
