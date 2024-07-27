const arr = [4,23,16,8,2,16,5]

for (let i=0; i < arr.length ; i ++){
  let j = i;

  
  // while (j > 0 && arr[j] < arr[j-1]  ){
  //   let temp = arr[j]
  //   arr[j] = arr[j-1]
  //   arr[j-1] = temp
  //   j--;
  // }
  
  for (let j = i ; j > 0; j--){
    if(arr[j] < arr[j-1]){
      [arr[j], arr[j-1]] = [arr[j-1], arr[j]]
    }
  }
}
console.log(arr)