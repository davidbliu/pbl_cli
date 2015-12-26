var _ = require('underscore');
var Parse  = require('parse/node').Parse;
var PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'; 
var PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

var ParseGoLink= Parse.Object.extend('ParseGoLink');

q = new Parse.Query(ParseGoLink);
q.equalTo('member_email', 'berkeleypbl.machine@gmail.com');
q.limit(10000);
q.find({
  success:function(golinks){
    _.each(golinks, function(golink){
      if(golink.get('num_clicks') == null || golink.get('num_clicks') > 0){
        console.log('deleting '+golink.get('key'));
        golink.destroy();
      }
    });
  }
});
