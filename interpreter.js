
function interpret(command){
  console.log('interpreting '+command);
  command = command.replace('$', '').replace(';', '');
  func = command.split('(')[0];

  opStr = command.split('(')[1];
  opStr = opStr.replace(')', '');
  operands = opStr.split(',');
  operands = _.map(operands, function(x){
    return x.trim();
  });
  exec(func, operands);
}


function exec(func, operands){
  // create function mapping
  fMap = {};
  fMap.changeName = function(x){ changeName(x) };
  fMap.test = function(x){ test(x) };

  //execute the function
  fMap[func](operands);
}

/*
 * Function implemented for CLI. These should be documented someplace
 **/

function test(operands){
  tweet = new Tweet();
  tweet.set('content', 'THIS IS A TEST: '+operands.join('%'));
  tweet.save(null, {});
}
function changeName(operands){
}
