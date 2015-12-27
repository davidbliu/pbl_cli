
var WEEKS = 604800;
function getWeekDict(objects, maxDateUnix){
  var seen = [];
  var weekDict = {};
  _.each(objects, function(obj){
    weeks = Math.floor((maxDateUnix- obj.createdAt.getTime()/1000)/WEEKS);
    if(!_.contains(seen, weeks)){
      weekDict[weeks] = [];
      seen.push(weeks);
    }
    weekDict[weeks].push(obj);
  });
  return weekDict;
}
