/**
 * returns an array with moving average of the input array
 * @param array - the input array
 * @param count - the number of elements to include in the moving average calculation
 * @param qualifier - an optional function that will be called on each
 *  value to determine whether it should be used
 */
export const movingAvg = (array: number[], count: number, qualifier?: (val: number) => boolean) => {
  // calculate average for subarray
  const avg = function (array: number[], qualifier?: (val: number) => boolean) {
    let sum = 0,
      count = 0,
      val;
    for (var i in array) {
      val = array[i];

      if (!qualifier || qualifier(val)) {
        sum += val;
        count++;
      }
    }

    return sum / count;
  };

  const result = [];

  // pad beginning of result with null values
  for (let i = 0; i < count - 1; i++) result.push(null);

  // calculate average for each subarray and add to result
  for (let i = 0, len = array.length - count; i <= len; i++) {
    const val = avg(array.slice(i, i + count), qualifier);
    if (isNaN(val)) {
      result.push(null);
    } else {
      result.push(val);
    }
  }

  return result;
};
