const arr = [ 6, 2, 4, 1, 3, 5 ]

for (let index = 0; index < arr.length; index++) {
  for (let k = index + 1; k < arr.length; k++) {
    if(arr[index] > arr[k]) {
      const val = arr[index]
      arr[index] = arr[k]
      arr[k] = val
    }
  }
}

console.log(arr)