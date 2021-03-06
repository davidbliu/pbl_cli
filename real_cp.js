var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE'
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';

app.controller('CopilotCtrl', function($scope){
  $scope.msg = 'hi there';
  $scope.tabs = [];
  //draws the tabs in scope.tabs
  function drawTabs(){
  }


// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

authorize();

function authorize() {
  realtimeUtils.authorize(function(response){
    if(response.error){
      realtimeUtils.authorize(function(response){
        start();
      }, true);
    } else {
        start();
    }
  }, false);
}

var myDoc;
function start() {
  // With auth taken care of, load a file, or create one if there
  // is not an id in the URL.
  var id = docId;
  if (id) {
    // Load the document id from the URL
    realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
  } else {
    // Create a new document, add it to the URL
    realtimeUtils.createRealtimeFile('New Quickstart File', function(createResponse) {
      window.history.pushState(null, null, '?id=' + createResponse.id);
      realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
    });
  }
}

// The first time a file is opened, it must be initialized with the
// document structure. This function will add a collaborative string
// to our model at the root.
function onFileInitialize(model) {
  var string = model.createString();
  string.setText('Welcome to the Quickstart App!');
  model.getRoot().set('demo_string', string);
}
function showCollaborators(collaborators){
  $('#collaborators-div').html('');
  _.each(collaborators, function(c){
    col = $('<div>&nbsp;'+c.displayName+'</div>');
    img = $('<img class = "profile-img"></img>');
    $(img).attr('src', c.photoUrl);
    $(col).prepend(img);
    $('#collaborators-div').append(col);
  });
}

// After a file has been initialized and loaded, we can access the
// document. We will wire up the data model to the UI.
function onFileLoaded(doc) {
  myDoc = doc;
  keys = myDoc.getModel().getRoot().keys();
  //show collaborators
  showCollaborators(doc.getCollaborators());
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, function(){
    showCollaborators(doc.getCollaborators());
  });
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, function(){
    showCollaborators(doc.getCollaborators());
  });
  //tell extension online
  window.postMessage({'type':'copilot_webpage', 'name':'ONLINE'},'*');
  activateMessages();
  getList();
  //display list on the board
  handleListChange();
}

var tabList;
function getList(){
  tabList = myDoc.getModel().getRoot().get('tab_list');
  tabList.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, function(event){
    handleListChange();
  });
  tabList.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, function(event){
    handleListChange();
  });
}

// redraws the links shown onscreen
var tabs = [];
function handleListChange(){
  tabs = [];
  //dont add duplicate urls
  seenUrls = [];
  $('#tabs-list').html('');
  for(var i=0;i<tabList.length;i++){
    tab = tabList.get(i);
    tabs.push(tab)
    if(!_.contains(seenUrls, tab.url)){
      seenUrls.push(tab.url);
      favicon_img = '<img src = "'+tab.favIconUrl+'" class = "favicon-img"></img>';
      $('#tabs-list').append('<li class = "list-group-item">'+favicon_img+'&nbsp;<a href = "'+tab.url+'" target = "_blank">'+tab.title+'</a></li>');
    }
  }  
  $('#tabs-list').data('tabs', tabs);
}

// receive messages from chrome extension
function activateMessages(){
  window.addEventListener('message', function(event){
    if(event.data && event.data.type && event.data.type == 'extension'){
      message = event.data;
      myId = message.id;
      myTabs = message.tabs;
      _.each(myTabs, function(x){
        x.userId = myId;
      });
      var tabs = _.map(_.range(tabList.length), function(i){
        return tabList.get(i);
      });
      tabs = _.filter(tabs, function(x){
        x.userId != myId;
      });
      var finalTabs = tabs.concat(myTabs);

      tabList.removeRange(0,tabList.length);
      _.each(finalTabs, function(tab){
        tabList.push(tab);
      });
    }
   });
}
});//end of a super long controller
