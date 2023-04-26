require("moment/locale/pt-br")
const moment = require("moment-timezone")

moment.locale("pt-br")
moment.tz.setDefault("America/Sao_Paulo")

function now() {
  return moment()
}

function newDatabaseDate() {
  return moment().format("YYYY-MM-DD")
}

function newDatabaseDatetime() {
  return moment().format("YYYY-MM-DD HH:mm:ss")
}

function newDatabaseDatetimetz() {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS Z")
}

function getDatabaseDateFromDate(inputDate) {
  return `${inputDate.getFullYear()}-${
    inputDate.getMonth() + 1
  }-${inputDate.getUTCDate()}`
}

function isValidDate(dateString) {
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(dateString)
}

function isValidDateTime(dateTimeString) {
  return (
    isValidDate(dateTimeString) &&
    /[0-9]{2}:[0-9]{2}(:[0-9]{2})?Z?(\.[0-9]{3})?(\s[-+][0-9]{2}:[0-9]{2})?Z?$/.test(
      dateTimeString
    )
  )
}

module.exports = {
  moment,
  now,
  newDatabaseDate,
  newDatabaseDatetime,
  newDatabaseDatetimetz,
  getDatabaseDateFromDate,
  isValidDateTime,
}
