var ParseGoLinkFields= ['key', 'url', 'createdAt', 'image', 'updatedAt', 'description', 'tags', 'member_email', 'num_clicks'];
var WEEKS = 604800;
var ParseGoLinkClickFields = ['golink_id', 'createdAt', 'updatedAt', 'member_email'];


app.controller('InsightsCtrl', function($scope){
  $scope.key = 'parse';
  function pullInsights(){
    var url = location.href;
    id = url.split('?id=')[1];
    q = new Parse.Query(ParseGoLinkClick);
    q.limit(1000);
    q.descending('createdAt');
    q.equalTo('golink_id', id);
    q.find({
      success:function(clicks){
        $scope.clicks = convertParseObjects(clicks, ParseGoLinkClickFields);
        $scope.$digest();
      }
    });
    
  }

  pullInsights();
  function pullGolink(){
    var url = location.href;
    id = url.split('?id=')[1];
    q = new Parse.Query(ParseGoLink);
    q.get(id, {
      success:function(golink){
        $scope.golink = convertParse(golink, ParseGoLinkFields);
        $scope.key = $scope.golink.key;
        $scope.$digest(); 
      }
    });
  }
  pullGolink();
});
