
app.controller('NoteCtrl', function($scope){
  $scope.keys = keys;
  function setKeys(){
    console.log('setting keys');
    if(keys == null){
      setTimeout(setKeys, 1000);
    }
    else{
      $scope.keys = keys;
      $scope.$digest();
    }
  }
  $scope.changeNote = function(key){
    changeNote(key);
  }

  $scope.makeNote = function(key){
    $scope.newKey = "";
    changeNote(key);
    setKeys();
  }
  setKeys();
  
});
