fMap.switchTabling = function(operands){
  console.log('switching '+operands);
  email1 = operands[0];
  email2 = operands[1];
  q1 = new Parse.Query(ParseTablingSlot);
  q2 = new Parse.Query(ParseTablingSlot);
  q1.equalTo('emails', email1);
  q2.equalTo('emails', email2);
  q = Parse.Query.or(q1, q2);
  q.find({
    success:function(slots){
      //swap their tabling
      s1 = slots[0];
      s2 = slots[1];
      if(_.contains(s1.get('emails'), email1)){
        slot1 = s1;
        slot2 = s2;
      }
      else{
        slot1 = s2;
        slot2 = s1;
      }
      e = slot1.get('emails');
      e = _.without(e, email1);
      e.push(email2)
      e2 = slot2.get('emails');
      e2 = _.without(e2, email2);
      e2.push(email1);
      slot1.set('emails', e);
      slot2.set('emails', e2);
      slot1.set('member_emails', e.join(','));
      slot2.set('member_emails', e2.join(','));
      //save both slots
      slot1.save(null, {
        success:function(slot){
          tweet = new Tweet();
          tweet.set('content', slot.get('emails').join(', ') + ' at ' + slot.get('time'));
          tweet.set('channel', '#tabling');
          tweet.set('email', 'berkeleypbl.webdev@gmail.com');
          tweet.save(null, {});
        }
      });
      slot2.save(null, {
        success:function(slot){
          tweet = new Tweet();
          tweet.set('content', slot.get('emails').join(', ') + ' at ' + slot.get('time'));
          tweet.set('channel', '#tabling');
          tweet.set('email', 'berkeleypbl.webdev@gmail.com');
          tweet.save(null, {});
        }
      });
    }
  });
}
//end of switch tabling
