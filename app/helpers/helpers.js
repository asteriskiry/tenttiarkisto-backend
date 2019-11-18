const moment = require('moment')

const now = () => moment().format()

const formatOrNull = value => value ? moment(value).format() : null

const formatDateTime = value => moment(value).format('DD.MM.YYYY HH:mm:ss')
const formatDate = value => moment(value).format('DD.MM.YYYY')

const formatDateOrEmpty = value => value != null ? formatDate(value) : ''
const formatDateOrNull = value => value != null ? formatDate(value) : null

const formatDateTimeOrEmpty = value => value ? formatDateTime(value) : ''
const formatDateTimeOrNull = value => value ? formatDateTime(value) : null

const isBeforeToday = date => !moment(date).isSameOrAfter(moment(), 'day')

module.exports = {
  now,
  formatOrNull,
  formatDateTime,
  formatDate,
  formatDateOrEmpty,
  formatDateTimeOrEmpty,
  formatDateOrNull,
  formatDateTimeOrNull,
  isBeforeToday
}
