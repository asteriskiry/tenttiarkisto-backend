const { formatOrNull } = require('../helpers/helpers')
const decorate = file => {
  const { file_id: id, file_data: fileData } = file
  const {
    uuid,
    filename,
    fileType,
    filePath,
    size,
    createdAt,
    updatedAt,
    description
  } = fileData
  return {
    id,
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

const decorateList = files =>
  files.map(decorate)


module.exports = {
  decorate,
  decorateList
}
