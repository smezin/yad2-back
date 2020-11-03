const removeDuplicates = (arr) => { 
  const duplicateFreeArray = Array.from(new Set(arr))
  if(arr && duplicateFreeArray) {
    return duplicateFreeArray
  } 
}

module.exports = removeDuplicates