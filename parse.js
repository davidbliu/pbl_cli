var PARSE_APP_ID = '9S16GhoFsiKeidxsLDMBvuESYJPWyyacFbd8zgys'; 
var PARSE_JS_KEY = 'YBqU0O4eqgSh6EdFihUj6jjtznr0SQENfGO6b8lB';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
var Tweet = Parse.Object.extend("Tweet");
var Log = Parse.Object.extend("Log");

function convertParse(parseObject, fields){
  res = {};
  _.each(fields, function(field){
    res[field] = parseObject.get(field);
  });
  res.objectId = parseObject.id;
  return res;
}

function convertParseObjects(parseObjects, fields){
  return _.map(parseObjects, function(obj){
    return convertParse(obj, fields);
  });
}
