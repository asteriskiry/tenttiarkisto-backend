const { formatOrNull } = require('../../helpers/helpers')
const decorate = fileResult => {
  const { file_id: id,
    course_id: courseId,
    file_data: fileData,
    created_at: createdAt,
    updated_at: updatedAt } = fileResult
  const {
    uuid,
    filename,
    fileType,
    filePath,
    size,
    description
  } = fileData
  return {
    id,
    courseId,
    uuid,
    filename,
    fileType,
    filePath,
    size,
    createdAt: formatOrNull(createdAt),
    updatedAt: formatOrNull(updatedAt),
    description
  }
}

const decorateList = fileResults =>
  fileResults.map(decorate)


module.exports = {
  decorate,
  decorateList
}
