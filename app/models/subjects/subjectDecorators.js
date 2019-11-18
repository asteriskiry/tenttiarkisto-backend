const { formatOrNull } = require('../../helpers/helpers')
const decorate = subjectResult => {
  const { subject_id: id, subject_data: subjectData, created_at: createdAt, updated_at: updatedAt } = subjectResult
  const {
    name
  } = subjectData
  return {
    id,
    name,
    createdAt: formatOrNull(createdAt),
    updatedAt: formatOrNull(updatedAt)
  }
}

const decorateList = subjectResults =>
  subjectResults.map(decorate)


module.exports = {
  decorate,
  decorateList
}
