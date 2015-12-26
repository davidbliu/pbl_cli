VisualGolinkFields= ['key', 'url', 'createdAt', 'image'];


app.controller('VisualCtrl', function($scope){
  

  function pullGolinks(){
    $scope.golinks=[];
    q = new Parse.Query(VisualGolink);
    q.descending('createdAt');
    q.find({
      success:function(golinks){
        $scope.golinks = convertParseObjects(golinks, VisualGolinkFields);
        $scope.$digest();
      }
    });
  }
  pullGolinks();

  $scope.deleteGolink = function(gl){
    q = new Parse.Query(VisualGolink);
    q.get(gl.objectId, {
      success:function(golink){
        console.log('deleting');
        golink.destroy({
          success:function(data){
          pullGolinks();
          }
        });
      }
    });
  };
});
