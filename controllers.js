var tweetFields = ['content', 'createdAt'];

app.controller('HomeCtrl', function($scope){
  
  $scope.tweet = {};
  function pullTweets(){
    q = new Parse.Query(Tweet);
    q.descending('createdAt');
    q.find({
      success:function(tweets){
        $scope.tweets = convertParseObjects(tweets, tweetFields);
        $scope.$digest();
      }
    });
  }
  pullTweets();

  $scope.saveTweet = function(){
    content = editor.getData();
    tweet = new Tweet();
    tweet.set('content', content);
    tweet.save(null, {
      success:function(data){
        pullTweets();
        hideEditor();
      }
    }); 
  }

  $scope.deleteTweet = function(id){
    q = new Parse.Query(Tweet);
    q.get(id, {
      success:function(tweet){
        tweet.destroy({
          success:function(data){
            pullTweets();
          }
        });
      }
    });
  };
  $scope.createPost = function(){
    $('#edit-tweet').show();
    activateEditor();
  };
  function hideEditor(){
    $('#edit-tweet').hide();
    editor.setData('');
  }
  $scope.cancelTweet = function(){
    hideEditor();
  }
  var config;
  var editor;
  function activateEditor(){
    config = {};
    editor = CKEDITOR.replace( 'editor1', {
      height: 75,
      width: 800, 
      toolbar: [
        {'name': 'basicstyles', items: ['Bold', 'Italic']},
        { name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
        { name: 'insert', items : [ 'Image', 'Table' ] },
        { name: 'links', items : [ 'Link','Unlink' ] }
      ]
    });
  }

});

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
