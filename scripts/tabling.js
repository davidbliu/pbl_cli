var _ = require('underscore');
var Parse  = require('parse/node').Parse;
var PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'; 
var PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

var ParseTablingSlot = Parse.Object.extend('ParseTablingSlot');

q = new Parse.Query(ParseTablingSlot);
q.find({
  success:function(tablingSlots){
    console.log(tablingSlots.length);
    _.each(tablingSlots, function(x){
      x.set('emails', x.get('member_emails').split(','));
      x.save({
        success:function(d){
          console.log('saved');
        }
      });
    });
  }
});
