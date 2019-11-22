const AWS = require('aws-sdk')
const moment = require('moment')
const generateUuid = require('uuid/v1')

const { now } = require('../helpers/helpers')

/** Create and reuse S3 bucket instance after first run */
let commonS3Bucket
const getS3Bucket = () => {
  if(!commonS3Bucket || process.env.NODE_ENV === 'test') {
    commonS3Bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      reqion: process.env.AWS_REGION
    })
  }
  return commonS3Bucket
}

/** UUID and keys are used for identifying files
 * Files can be separated into "folders" on S3 using /-char 
*/
const generateFileS3Keys = () => {
  const uuid = generateUuid()
  return {
    uuid,
    filePath: `${now('YYYYMM')}/${uuid}`
  }
}

/** Generates AWS url for a single file which is reusable only 15 minutes */
const createPresignedS3URL = (file, options = {}) =>
  getS3Bucket().getSignedUrl('getObject', {
    Expires: 60 * 15,
    Key: file.filePath,
    Bucket: process.env.AWS_S3_BUCKET,
    ResponseContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    ResponseContentEncoding: '',
    ResponseContentType: file.fileType
  })

const generateS3Data = file => {
  const { filename, fileType, uuid, filePath } = file
  const now = moment.utc()
  const fields = {
    acl: 'private',
    bucket: process.env.AWS_S3_BUCKET,
    key: filePath,
    'Content-Type': fileType,
    'x-amz-meta-name': filename,
    'x-amz-meta-filename': uuid,
    'x-amz-meta-content_type': fileType,
    'x-amz-server-side-encryption': 'AES256'
  }

  const policy = {
    Bucket: fields.bucket,
    Expiration: moment(now).add(10, 'minutes').format(),
    Conditions: [
      { acl: fields.acl },
      { bucket: fields.bucket },
      { key: fields.key },
      { 'Content-Type': fields['Content-Type'] },
      { 'x-amz-meta-name': fields['x-amz-meta-name'] },
      { 'x-amz-meta-filename': fields['x-amz-meta-filename'] },
      { 'x-amz-meta-content_type': fields['x-amz-meta-content_type'] },
      { 'x-amz-server-side-encryption': fields['x-amz-server-side-encryption'] }
    ]
  }

  const s3Data = getS3Bucket().createPresignedPost(policy)
  s3Data.fields = { ...fields, ...s3Data.fields }
  return { ...file, _s3Data: s3Data }
}

const deleteFromS3 = file => {
  const payload = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: file.filePath
  }
  return getS3Bucket().deleteObject(payload).promise()
}

module.exports = {
  generateFileS3Keys,
  createPresignedS3URL,
  generateS3Data,
  deleteFromS3
}
