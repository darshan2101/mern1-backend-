
const arr = [4,23,16,8,2,16,5]

for (let i=0; i < arr.length ; i ++){
  for (let j= 0; j< arr.length -i - 1; j++){
    if (arr[j] > arr[j+1] ){
      [ arr[j], arr[j+1] ] = [arr[j+1], arr[j]];
    }
  }
}
console.log(arr)