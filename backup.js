

map = {};
map['a'] = ['sldkf', 'asdfalsk', 'asdlfk', 'afelkfj'];
map['b'] = ['asldfkj', 'lskje', 'asdflk'];
function unloadMap(map){
  mapStr = '';
  _.each(_.keys(map), function(key){
    mapStr = mapStr + key + '\n';
  });
  return mapStr;
}
function loadMap(mapStr){
  splits = mapStr.split('\n');
  map = {};
  currKey = 'nokey'
  map[currKey] = [];
  _.each(splits, function(line){
    line = line.trim();
    if(line != ''){
      if(line.charAt(0) == '*'){
        map[currKey].push(line.split('*')[1]);
      }
      else{
        currKey = line;
        map[currKey] = [];
      }
    }
  });
  return map;
}
console.log(unloadMap(map));
$('#id-textarea').html('alsdfkjalskdfj');
        //linkMap = {};
        //_.each(_.keys($scope.linkDir), function(key){
          //linkMap[key]=_.map($scope.linkDir[key], function(golink){
            //return golink.key;
          //});
        //});
        
        //c = new Collection();
        //c.set('map', JSON.stringify(linkMap));
        //c.set('name', 'Fall 2015');
        //c.save(null, {});
        //console.log(linkMap);
