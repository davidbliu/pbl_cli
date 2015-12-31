var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE'
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
var myDoc;
var myAuth;

var tabMap;
app.controller('CopilotCtrl', function($scope){
  $scope.msg = 'hi there';
  $scope.tabDict = {};
  $scope.collaborators = [];
  authorize();

  function authorize() {
    realtimeUtils.authorize(function(response){
      var google_root = 'https://www.googleapis.com/oauth2/v3/userinfo?';
      var access_token = response.access_token;
      var id_url = google_root + 'access_token='+access_token;
      $.ajax({
        url: id_url,
        success:function(data){
          myAuth = data;
        }
      });

      if(response.error){
        realtimeUtils.authorize(function(response){
          start();
        }, true);
      } else {
          start();
      }
    }, false);
  }



  function start() {
    realtimeUtils.load(docId.replace('/', ''), onFileLoaded, onFileInitialize);
  }
  function onFileInitialize(model) {
    var string = model.createString();
    string.setText('Welcome to the Quickstart App!');
    model.getRoot().set('demo_string', string);
  }
  function onFileLoaded(doc) {
    myDoc = doc;
    keys = myDoc.getModel().getRoot().keys();
    tabMap = myDoc.getModel().getRoot().get('mainChannel');
    translateTabMap(tabMap);
    tabMap.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, function(event){
      console.log('changed');
    });
    activateMessages();
    handleCollaborators();
  }
  
  function updateCollaborators(){
    $scope.collaborators = myDoc.getCollaborators();
    console.log($scope.collaborators);
    $scope.userDict = _.object(_.map($scope.collaborators, function(item){
      return [item.userId, item];
    }));
    $scope.$digest();
  }

  function handleCollaborators(){
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, function(){
      updateCollaborators();
    });
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, function(){
      updateCollaborators();
    });
  }

  function translateTabMap(tabMap){
    $scope.tabDict = {};
    _.each(tabMap.keys(), function(key){
      $scope.tabDict[key] = tabMap.get(key);
    });
    $scope.userIds = _.keys($scope.tabDict);
    $scope.$digest();
  }

  //receive messages from chrome extension
  function activateMessages(){
    window.addEventListener('message', function(event){
      if(event.data && event.data.type && event.data.type == 'extension'){
        var message = event.data;
        var myTabs = message.tabs;
        tabMap.set(myAuth.sub, myTabs);
        translateTabMap(tabMap);
        $scope.$digest();
      }
    });
  }

});//end of a super long controller
