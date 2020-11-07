const { logger } = require("../logger/winstonLogger")

const removeDuplicates = (arr) => { 
  if (typeof(arr) !== 'object') {
    logger.warn('cannot remove duplicates from non-object/non-array parameter')
    return arr
  }
  const duplicateFreeArray = Array.from(new Set(arr))
  if(arr && duplicateFreeArray) {
    return duplicateFreeArray
  } 
}

module.exports = removeDuplicates