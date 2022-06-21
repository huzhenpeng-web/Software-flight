/* 去重数组中重复对象 */

export function removeDuplicates (arr) {
  const result = []
  const duplicatesIndices = []
  // Loop through each item in the original array
  arr.forEach((current, index) => {
    if (duplicatesIndices.includes(index)) return
    result.push(current)
    // Loop through each other item on array after the current one
    for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
      const comparison = arr[comparisonIndex]
      const currentKeys = Object.keys(current)
      const comparisonKeys = Object.keys(comparison)
      // Check number of keys in objects
      if (currentKeys.length !== comparisonKeys.length) continue
      // Check key names
      const currentKeysString = currentKeys.sort().join('').toLowerCase()
      const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase()
      if (currentKeysString !== comparisonKeysString) continue
      // Check values
      let valuesEqual = true
      for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i]
        if (current[key] !== comparison[key]) {
          valuesEqual = false
          break
        }
      }
      if (valuesEqual) duplicatesIndices.push(comparisonIndex)
    } // end for loop
  }) // end arr.forEach()
  return result
}
