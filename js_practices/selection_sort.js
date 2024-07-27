const arr = [4,23,16,8,2,16,5]

for (let i=0; i < arr.length ; i ++){
  let min = i
  for (let j = i+1; j < arr.length; j++){
    if (arr[min] > arr[j]){
      let temp =  arr[j];
      arr[j] =arr[min];
      arr[min] = temp
    }
  }
}
console.log(arr)