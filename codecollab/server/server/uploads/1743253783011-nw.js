//1. Write a Program to reverse a string in JavaScript.

// function rr(str)
// {
//     return str.split("").reverse("").join("");
// }
// console.log(rr("kaival"))

//2. Write a Program to check whether a string is a palindrome string.

// function pd(str){
//     const rev = str.split("").reverse().join("");
//     return str === rev;
// }
// console.log(pd("gfg"))

// 3. Find the largest number in an array in JavaScript

// method 1
// arr1= [99,5,3,100,1]
// function findlarge(arr){
//     return Math.max(...arr);
// }
// console.log(findlarge(arr1))

//method 2
// const arr = [10,20,30,50,25]
// let largest = arr[0];

// for (let i = 1; i<arr.length; i++){
//     if(arr[i] > largest){
//         largest = arr[i];
//     }
// }

// console.log("larger" + largest);

//4. How Remove the first element from an array in JavaScript?

// let arr= [5,6,4,8];
// arr = arr.slice(1);
// console.log(arr);

//5.Write a Program to use a callback function?
// function greet(name, callback){
//     console.log("Hello,"+ name);
//     callback();
// }

// function aftergreet(){
//     console.log("welcome")
// }

// greet("alice",aftergreet);

//6.Write a code to create an arrow function?
// const add = (a,b)=>{
// return a+b;
// }
// console.log(add(5,3));

//7. Write a Program to add a property to an object?

// const obj = {name: "kaival"};
// obj.age = 21;
// obj.rank = 1;
// console.log(obj);

//8.Write a Program to delete a property from an object?

// const obj = {name: "kaival", age:21};
// delete obj.age;
// console.log(obj);

//9. reduce method

// const num=[1,2,3,4,5];

// const sum = num.reduce((a,b)=>{
// return a+b
// })

// console.log("SUm",sum)

//10.repeat method
// const str= "hello";
// console.log(str.repeat(4));

//11.console.log(1 + '2');

//12.console.log('6' - 1);

//13.console.log(1 === '1');   // false becasue int and str

//14.console.log(null == undefined); //true loose equality operator

//15.Write a Program to find a sum of an array?

// arr1=[15,25,26,48]

// function sumarr(arr){
//     let sum = 0;
//     for(let i=0; i<arr.length;i++){
//         sum+= arr[i]
//     }
//     return sum;
// }

// console.log(sumarr(arr1))

//16. Write a Program to check if a number is prime or not?

// const prime=1;

// function isprime(num){
//     if (num<=1)
//         return false;
//     for (let i=2; i< num; i++)
//     {
//         if(num % i === 0)
//             return false;
//     }
//     return true;
// }

// console.log(isprime(prime))

//17. Write a Program to print Fibonacci sequence up to n terms?

// function fibonacci(n){
//     let num1 = 0, num2 = 1, nextNum;
//     console.log("fibonacci ser")

//     for (let i=1; i<=n;i++){
//         console.log(num1);
//         nextNum = num1 + num2;
//         num1 = num2;
//         num2 = nextNum;
//     }
// }

// fibonacci(9)

//18. Write a Program to find factorial of a number?

// function fac(num){
//     let ans = 1;
//     for(let i=2; i<=num;i++){
//         ans *=i; //ans= ans *1
//     }
//     return ans
// }

// console.log(fac(4))

//19. Calculate the Power of a Number in JavaScript?
// const pow = 2
// const pow1 = 2
// function power(base, exponent){
//     return base ** exponent
// }
// console.log(power(pow,pow1))

//20.Write a Program to print the frequency of elements in an array?

// function frequency(arr){
//     const freq = {};
//     for(let i=0;i< arr.length;i++){
//         if(freq[arr[i]]){
//             freq[arr[i]] +=1;
//         }else{
//             freq[arr[i]] =1;
//         }
//     }
//     return freq;
// }

// console.log(frequency([1,1,2,3,3,4]))

//21.Write a Program to count the occurrences of a character in a string in JavaScript?
// let string = prompt('enter:')
// let letter = prompt('enter letter:')
// let count = 0;
// for(let i=0;i<string.length;i++){
//     if(string[i]==letter){
//         count++;
//     }
// }
// document.write("count",count)

//22.Write a Program to convert Celsius to Fahrenheit in JavaScript?
// function ctof(celsius){
//     return (celsius * 9/5)+32;
// }

// console.log(ctof(20))

//23.Write a Program to convert Fahrenheit to Celsius in JavaScript?

// function ftoc(fahren){
//     return (fahren -32)*5/9;
// }

// console.log(ftoc(68))

//24. Write a Program to sort an array in Ascending Order in JavaScript?
// arr1 = [5,6,2,4,89,1]

// function sortarray(arr){
//     for(let i=0;i<arr.length;i++){
//         for (let j=i+1;j<arr.length;j++){
//         if(arr[i]>arr[j]){
//             let temp = arr[i];
//             arr[i] =arr[j];
//             arr[j]=temp;
//         }
//     }
// }
// return arr;
// }

// console.log(sortarray(arr1))

//25. write a Program to sort an array in Descending Order in JavaScript?
// arr1=[5,6,45,21,15,2]
// function sortarray(arr){
//     let n= arr.length;
//     for(let i=0;i<n;i++){
//         for(let j=0;j<n-1-i;j++){
//             if(arr[j]<arr[j+1]){
//                 let temp = arr[j];
//             arr[j]= arr[j+1]
//             arr[j+1]=temp;
//             }
//         }
//     }
//     return arr;
// }

// console.log(sortarray(arr1))

//26. Write a Program to merge two arrays in JavaScript?

// function mergearray(arr1,arr2){
//     return arr1.concat(arr2)
// }

// a1 = [5,6,2]
// a2 = [8,9,3]

// console.log(mergearray(a1,a2))

//27. Find the Intersection of Two Arrays in JavaScript?

// function arrint(arr1,arr2){
//     const set2 = new Set(arr2);
//     return arr1.filter(value => set2.has(value));
// }

// a1= [2,,4,8,9]
// a2=[2,4,5,3]

// console.log(arrint(a1,a2))

//28. Find the Union of Two Arrays in JavaScript?

// function arrayuni(arr1,arr2){
//     return[...new Set([...arr1, ...arr2])]
// }

// console.log(arrayuni([1,2,3],[2,3,4,5]))

//29. Check if a Number is Even or Odd in JavaScript?

// function isEven(num){
//     return num % 2 === 0;
// }
// console.log(isEven(10))

//30.Write a Program to find the minimum value in an array in JavaScript?

// function findmin(arr){
//     return Math.min(...arr);

// }
// console.log(findmin([5,6,4,8,9]))


//31. Check if a String Contains Another String in JavaScript?

// function containan(str, substr){
//     return str.indexOf(substr) !== -1;

// }

// console.log(containan('kaival','aiv'))

// 33. Find the Longest Word in a String in JavaScript?

// function longword(str){
//     const words = str.split(' ');
//     let longest = '';

//     for(let word of words){
//         if(word.length > longest.length){
//             longest = word;
//         }
//     }
//     return longest
// }

// console.log(longword("kaival is good boy"))


//34. Capitalize the First Letter of Each Word in a Sentence in JavaScript?
// function capfirstl(sentence){
//     const words = sentence.split(' ')
//     for(let i=0;i< words.length;i++){
//         words[i] = words[i].charAt(0).toUpperCase() +words[i].slice(1)
//     }
//     return words.join(' ')
// }

// console.log(capfirstl('kaival zala'))


//35. Convert an Array of Strings to Uppercase in JavaScript?

// function arrayu(arr){

//     const upperarr = [];
//     for(let i=0;i<arr.length;i++){
//         upperarr[i] = arr[i].toUpperCase();
//     }
//     return upperarr
// }

// console.log(arrayu([a,z,c,r]))

//36.36. Write a Program to reverse an array in JavaScript?

// function revarr(arr){

//     const rev =[]
//     for(let i= arr.length-1;i>=0;i--){
//         rev.push(arr[i])
//     }
//     return rev;
// }

// console.log(revarr([4,8,9,6,4]))

//37. Get the last element of an array in JavaScript?

// function lastel(arr){
//     return arr[arr.length-1]
// }

// console.log(lastel([6,2,1,4,5]))

// 39. Calculate the factorial of a number using recursion in JavaScript?

// function fac(n){
//     if(n ===0 || n === 1) return 1;
//     return n* fac(n-1)
// }
// console.log(fac(4))

//40. Create an object and print the property?
// let person = { name: "GFG", age: 25 };
// console.log(person.name);

//41. Use the map function on an array in JavaScript?
// let numbers = [5, 6, 7];
// let ans = numbers.map(function (num) {
//     return num * 2;
// });
// console.log(ans);

// Write a switch statement code in JavaScript?

// let course = "javascript";
// switch (course) {
//     case "javascript":
//         console.log("This is a javascript course");
//         break;
//     default:
//         console.log("Not a javascript course");
// }

//Remove Duplicates from an Array in JavaScript?

// function removed(arr){
//     const uniarr=[]
//     for(let i=0;i<arr.length;i++){
//         if(!uniarr.includes(arr[i])){
//             uniarr.push(arr[i])
//         }
//     }
//     return uniarr
// }
// console.log(removed([5, 2, 5, 6, 6, 7]));

//Count Vowels in a String in JavaScript?

// function countVowels(str) {
//     let count = 0;
//     // Include both lowercase and uppercase vowels
//     const vowels = 'aeiouAEIOU'; 
//     for (let i = 0; i < str.length; i++) {
//         if (vowels.includes(str[i])) {
//             count++;
//         }
//     }

//     return count;
// }

// console.log(countVowels("hello geek"));
