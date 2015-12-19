

app.controller('DriveCtrl', function($scope){
 $scope.msg = 'hi'; 
  function loadDriveApi() {
    gapi.client.load('drive', 'v2', listFiles);
  }

  /**
   * Print files.
   */
  function listFiles() {
    var request = gapi.client.drive.files.list({
        'maxResults': 10
      });

      request.execute(function(resp) {
        var files = resp.items;
        $scope.files =files; 
        //if (files && files.length > 0) {
          //for (var i = 0; i < files.length; i++) {
            //var file = files[i];
            //appendPre(file.title + ' (' + file.id + ')');
          //}
        //} else {
          //appendPre('No files found.');
        //}
      });
    }
});
