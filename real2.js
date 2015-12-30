console.log('hi');
var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE'
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';

// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

//authorize();

function authorize() {
  realtimeUtils.authorize(function(response){
    console.log('response 1');
    console.log(response);
    if(response.error){
      realtimeUtils.authorize(function(response){
        console.log('response 2');
        console.log(response);
        start();
      }, true);
    } else {
        start();
    }
  }, false);
}

var myDoc;
authorize();
function start() {
  // With auth taken care of, load a file, or create one if there
  // is not an id in the URL.
  var id = docId;
  console.log(id);
  console.log('got here');
  realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
  console.log('got to this step');
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
  $('#colabs').html('');
  _.each(collaborators, function(c){
    col = $('<div></div>');
    $(col).text(c.displayName);
    img = $('<img></img>');
    $(img).addClass('profile-img');
    $(img).attr('src', c.photoUrl);
    $(col).prepend(img);
    $('#colabs').append(col);
  });
}

var keys;
// After a file has been initialized and loaded, we can access the
// document. We will wire up the data model to the UI.
function onFileLoaded(doc) {
  myDoc = doc;
  keys = myDoc.getModel().getRoot().keys();
  showCollaborators(doc.getCollaborators());
  //add event listeners for collaborators joining and exiting the doc
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, function(){
    showCollaborators(doc.getCollaborators());
  });
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, function(){
    showCollaborators(doc.getCollaborators());
  });
  var collaborativeString = doc.getModel().getRoot().get('demo_string');
  console.log(keys);
  console.log('this ss the text');
  console.log(collaborativeString.text);
  collaborativeString.text += 'append1';
  console.log(collaborativeString.text);
}

