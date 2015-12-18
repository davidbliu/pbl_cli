var MAXINT = 1000;
var tweetFields = ['content', 'createdAt', 'channel', 'email'];

var channels = ['#general', '#events', '#tabling', '#ideas',  '#points', '#david', '#all'];
var commands = ['switch', 'mark', 'changeName'];

var email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
var function_regex = /\$\$.+\$\$/g;

app.controller('NavCtrl', function($scope){
  $scope.channels = channels;
});

function startAutocomplete(mappings){
  functions = _.keys(fMap);
  names = _.keys(mappings);
  //re looks for @word
  //re = /@(^|\b)(\w{2,})$/;
  $('#cli-input').textcomplete([
      { // names --> emails
          mentions: names,
          match: /\B@(\w*)$/,
          search: function (term, callback) {
              callback($.map(this.mentions, function (mention) {
                  return mention.indexOf(term) === 0 ? mention : null;
              }));
          },
          index: 1,
          replace: function (name) {
              return mappings[name];
          }
      },
      { // functions
          mentions: functions,
          match: /\B\$(\w*)$/,
          search: function (term, callback) {
              callback($.map(this.mentions, function (mention) {
                  return mention.indexOf(term) === 0 ? mention : null;
              }));
          },
          index: 1,
          replace: function (func) {
              return '$'+func;
          }
      }
  ], { appendTo: 'body' }).overlay([
      {
          match: function_regex,
          css: {
              'background-color': '#d8ffef'
          }
      },
      {
          match: email_regex,
          css: {
              'background-color': '#d8dfea'
          }
      } 
  ]);
  //$('#cli-input').textcomplete([{
      //match: re,
      //search: function (term, callback) {
          //var words = keywords;
          //callback($.map(words, function (word) {
            //console.log('hi');
              //return word.indexOf(term) === 0 ? word : null;
          //}));
      //},
      //replace: function (word) {
        //return word;
      //}
  //}]);
}

app.controller('CliCtrl', function($scope){
  $scope.funcs = _.keys(fMap);
  $scope.myEmail = 'davidbliu@gmail.com';
  $scope.myName = 'No Name';
  $scope.channels = channels;
  $scope.channel = channels[0];

  function pullMembers(){
    q = new Parse.Query(ParseMember);
    q.limit(MAXINT);
    q.equalTo('latest_semester', 'Fall 2015');
    q.find({
      success:function(members){
        $scope.members = members;
        $scope.emails = _.map(members, function(x){return x.get('email');});
        $scope.names = _.map(members, function(x){return x.get('name');});
        nameMappings = _.object(_.map(members, function(item){
          return [item.get('name'), item.get('email')];
        }));
        $scope.memberHash = _.object(_.map(members, function(item) {
           return [item.get('email'), item]
        }));
        convertContent();
        startAutocomplete(nameMappings);
        $scope.$digest();
      }
    });
  }


  function pullTweets(channel){
    $scope.tweets = [];
    q = new Parse.Query(Tweet);
    if(channel != '#all'){
      q.equalTo('channel', channel);
    }
    q.descending('createdAt');
    q.find({
      success:function(tweets){
        $scope.tweets = convertParseObjects(tweets, tweetFields);
        $scope.tweetHash = _.object(_.map(tweets, function(item) {
             return [item.id, item]
        }));
        convertContent();
        $scope.$digest();
      }
    });
  }
  
  pullTweets(channels[0]);
  pullMembers();

  $scope.pullTweets = function(channel){
    $scope.channel = channel;
    pullTweets(channel);
  };

  $scope.sendTweet = function(channel, content){
    functions = content.match(function_regex);
    if( functions != null && functions.length > 0){
      _.each(functions, function(x){
        interp = interpret(x);
        if(!interp){
          alert('failed to execute ' + x);
          return;
        }
      });
    }
    tweet = new Tweet();
    tweet.set('channel', channel);
    tweet.set('content', content);
    tweet.save(null, {
      success:function(data){
        pullTweets($scope.channel);
        $scope.content = "";
      }
    });
  };
  
  function convertContent(){
    _.each($scope.tweets, function(tweet){
      emails = tweet.content.match(email_regex);
      funcs = tweet.content.match(function_regex);
      //remove functions from tweet
      functions = _.map(funcs, function(f){
        if (f!=''){
          tweet.content = tweet.content.replace(f, '');
          return '<i class = "tweet-function"><em>'+f+'</em></i>';
        }
        return '';
      }).join(' ');
      //convert emails
      _.each(emails, function(email){
       tweet.content = tweet.content.replace(email, emailToName(email, $scope.memberHash));
      }); 
      tweet.content = tweet.content + functions;
    });
  }


  $scope.deleteTweet = function(tweet){
    tweet = $scope.tweetHash[tweet.objectId];
    tweet.destroy({
      success:function(data){ pullTweets($scope.channel); }
    });
  }

  $scope.startFunc = function(func){
    $scope.content = '$' + func + '(';
  }

  $scope.gravatarUrl = function(email){
    email = $scope.emails[_.random(0, $scope.emails.length)];
    return 'http://www.gravatar.com/avatar/' + md5(email)+'fs=20';
  };
});
//end of cli controller


app.controller('HackCtrl', function($scope){
  q = new Parse.Query(Log);
  q.descending('createdAt');
  q.find({
    success:function(x){
      $scope.logs = x;
      $scope.$digest();
    }
  });
});

function emailToName(email, memberHash){
  if(_.contains(_.keys(memberHash), email)){
    return memberHash[email].get('name');
  }
  return email;
}
