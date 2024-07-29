let input = [3,1,5,6,3,4,8,2,1,1,3]
console.log("Input Array ------------------------->", input);
function merge(arr, low , mid, high){
  let temp = [];
  let left = low 
  let right = mid + 1
  while (left <= mid && right <= high) {
    if (arr[left] < arr[right]){
      temp.push(arr[left])
      left++;
    }else{
      temp.push(arr[right])
      right++;
    }
  }
  
  while(left <= mid){
    temp.push(arr[left]);
    left++;
  }
  
  while(right <= high){
    temp.push(arr[right]);
    right++;
  }
  
  for ( let i = low ; i<= high ; i++ ){
    arr[i] = temp[i - low];
  }
  return arr;
}

function MergeSort(arr, low, high){
  if (low >= high) return;
  let mid = Math.floor((low + high) / 2);
  MergeSort(arr,low, mid);
  MergeSort(arr,mid+1, high);
  merge(arr, low, mid, high);
}
console.log(input.length)
MergeSort(input, 0, input.length -1)
console.log("Output Array ------------------------->",input);




// SOlution 2

// function merge_Arrays(left_sub_array, right_sub_array) {
//     let array = []
//     while (left_sub_array.length && right_sub_array.length) {
//         if (left_sub_array[0] < right_sub_array[0]) {
//           array.push(left_sub_array.shift())
//         } else {
//           array.push(right_sub_array.shift())
//         }
//     }
//     return [ ...array, ...left_sub_array, ...right_sub_array ]
//   }
//   function merge_sort(unsorted_Array) {
//     const middle_index = unsorted_Array.length / 2
//     if(unsorted_Array.length < 2) {
//         return unsorted_Array
//     }
//     const left_sub_array = unsorted_Array.splice(0, middle_index)
//     return merge_Arrays(merge_sort(left_sub_array),merge_sort(unsorted_Array))
//   }
//   console.log("Output ------------------------------> ", merge_sort(input) )
