myRe = /d(b+)d/g;
var myArray = myRe.exec("cdbbdbsbz");
console.log(myArray);

re = /\$*;/;
var arr  = re.exec('$switch(davidbliu@gmail.com,alice.sun94@gmail.com);');
console.log('regex');
console.log(arr);
