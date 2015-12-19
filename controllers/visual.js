VisualGolinkFields= ['key', 'url', 'createdAt', 'image'];


app.controller('VisualCtrl', function($scope){
  

  function pullGolinks(){
    q = new Parse.Query(VisualGolink);
    q.find({
      success:function(golinks){
        $scope.golinks = convertParseObjects(golinks, VisualGolinkFields);
        $scope.$digest();
      }
    });
  }
  pullGolinks();
});
