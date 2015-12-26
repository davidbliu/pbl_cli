var _ = require('underscore');
var Parse  = require('parse/node').Parse;
var PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'; 
var PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

var ParseGoLink= Parse.Object.extend('ParseGoLink');

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}
q = new Parse.Query(ParseGoLink);
q.limit(10000);
q.descending('createdAt');
q.find({
  success:function(golinks){
    _.each(golinks, function(golink){
      time = golink.get('createdAt');
      console.log(time.getWeek());
      console.log(_.keys(time));
    });
  }
});
