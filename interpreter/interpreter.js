function interpret(command){
  command = command.replace('$$', '').replace('$$', '');
  components = command.split(',');
  func = components[0];
  operands = components.slice(1, components.length);
  operands = _.map(operands, function(x){
    return x.trim();
  });
  console.log(func);
  console.log(operands);
  return exec(func, operands);
}


function exec(func, operands){
  if(!_.contains(Object.keys(fMap), func)){
    return false;
  }
  //execute the function
  fMap[func](operands);
  return true;
}

/*
 * Function implemented for CLI. These should be documented someplace
 **/

var fMap = {};
//fMap.changeName = function(x){ changeName(x) };
//fMap.test = function(x){ test(x) };
fMap.test = function(operands){
  tweet = new Tweet();
  tweet.set('content', 'THIS IS A TEST: '+operands.join('%'));
  tweet.save(null, {});
}
fMap.changeName = function(operands){
  email = operands[0];
  name = operands[1];
  q = new Parse.Query(ParseMember);
  q.equalTo('email', email);
  q.find({
    success:function(members){
      console.log('hi theree');
      console.log(members);
      if (members.length > 0){
        member = members[0];
        console.log(member.get("name"));
        member.set('name', name);
        member.save(null, {});
      }
      else{
        alert('nobody with that email');
      }
    }
  });
}
