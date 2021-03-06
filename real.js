var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE'
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
var myDoc;
var myAuth;
var tabMap;
var bookmarks;
var myHistory;


function translateTime(timestamp){
  var a= new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function scrollTabs(id){
  setTimeout(function(){
    $('.collaborator-link').click(function(){
      id = $(this).attr('id').split('-')[0];
      tabs_id = id + '-tabs';
      $("html, body").animate({ scrollTop: $('#'+tabs_id).offset().top }, 100);
    });
  }, 1000);
}

app.controller('CopilotCtrl', function($scope){
  $scope.msg = 'hi there';
  $scope.tabDict = {};
  $scope.collaborators = [];
  $scope.historyLimit = 15;

  $scope.translateTime = function(timestamp){
    return translateTime(timestamp);
  }

  $scope.checkHistory = function(userId, tab){
    userLog = myHistory.get(userId);
    tabLog = _.filter(userLog, function(x){
      return x.tabId == tab.id;
    });
    $scope.tabLog= tabLog;
    $scope.modalTitle = 'Tab History';
    $("#myModal").modal();
  }

  $scope.bookmarkTab = function(tab){
    seen = false;
    _.each(_.range(bookmarks.length), function(i){
      if(bookmarks.get(i).url == tab.url){
        seen = true;
      }
    });
    if(!seen){
      bookmarks.push(tab); 
    }
  }
  function showHistory(userId){
    $scope.historyList = myHistory.get(userId);
    $scope.historyUserId = userId;
    $('.history-checkbox').each(function(){
      $(this).prop('checked', false);
    });
    setTimeout(function(){
      activateTabHover();
    }, 1000);
  }

  $scope.showHistory = function(userId){
    showHistory(userId);
  }
  $scope.removeSelectedHistory = function(){
    var excludes = [];
    $('.history-checkbox:checked').each(function(){
      excludes.push($(this).attr('id'));
    });
    //remove excludes from history
    var currHistory = myHistory.get($scope.historyUserId);
    var newHistory = [];
    _.each(_.range(currHistory.length), function(i){
      var entry = currHistory[i];
      var entryId = entry.tabId+'-'+entry.time;
      if(!_.contains(excludes, entryId)){
        newHistory.push(entry);
      }
    });
    myHistory.set($scope.historyUserId,newHistory);
    showHistory($scope.historyUserId);
  }

  $scope.removeBookmark = function(tab){
    //remove all bookmarks with this tabs url
    marks = _.map(_.range(bookmarks.length), function(i){
      return bookmarks.get(i);
    });
    marks = _.filter(marks, function(x){
      return x.url != tab.url;
    });
    bookmarks.removeRange(0,bookmarks.length);
    _.each(marks, function(mark){
      bookmarks.push(mark);
    });
  }

  $scope.activeClass = function(tab){
    if(tab.active){
      return 'active-tab';
    }
  }
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
    console.log('file loaded');
    myDoc = doc;
    keys = myDoc.getModel().getRoot().keys();
    //get tabMap for currently open tabs
    tabMap = myDoc.getModel().getRoot().get('main');
    tabMap.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, function(event){
      translateTabMap(tabMap);
    });
    //get bookmarks
    bookmarks = myDoc.getModel().getRoot().get('main-bookmarks');
    bookmarks.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, function(event){
      translateBookmarks(bookmarks);
    });
    translateBookmarks(bookmarks);

    //get history
    myHistory = myDoc.getModel().getRoot().get('main-history');
    $scope.history = myHistory;
    // get comments
    myComments = myDoc.getModel().getRoot().get('main-comments');
    myComments.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, function(event){
      console.log('webpage: comments changed');
      console.log(event);
      updateComments(event.property);
    });
    activateMessages();
    handleCollaborators();
    console.log('handle the collabs');
  }

  function updateComments(url){
    changeMessage = {
      name:'updateComments',
      comments:myComments.get(url),
      url:url
    }
    window.postMessage(changeMessage, '*');
  }
  
  function updateCollaborators(){
    console.log('updating collaborators');
    $scope.collaborators = myDoc.getCollaborators();
    $scope.userDict = _.object(_.map($scope.collaborators, function(item){
      return [item.userId, item];
    }));
    scrollTabs();
    translateTabMap(tabMap);
  }

  function handleCollaborators(){
    console.log('here are collaborators');
    updateCollaborators();
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, function(){
      updateCollaborators();
    });
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, function(){
      updateCollaborators();
    });
  }

  function translateBookmarks(bookmarks){
    $scope.bookmarks = _.map(_.range(bookmarks.length), function(i){
      return bookmarks.get(i);
    });
    setTimeout(function(){
      activateTabHover();
    }, 1000);
    $scope.$digest();
  }

  function translateTabMap(tabMap){
    var userids = _.keys($scope.userDict);
    $scope.tabDict = {};
    _.each(tabMap.keys(), function(key){
      if(_.contains(userids, key)){
        $scope.tabDict[key] = tabMap.get(key);
      }
    });
    $scope.userIds = _.keys($scope.tabDict);
    $scope.$digest();
    activateTabHover();
  }

  //receive messages from chrome extension
  function activateMessages(){
    window.addEventListener('message', function(event){
      if(event.data && event.data.type && event.data.type == 'extension'){
        var message = event.data;
        if(message.name == 'tabChange'){
          var myTabs = message.tabs;
          tabMap.set(myAuth.sub, myTabs);
          translateTabMap(tabMap);
          //send comments to the activeTab
          active = _.filter(myTabs, function(tab){
            return tab.active;
          });
          console.log('sending active comments');
          console.log(active[0].url);
          updateComments(active[0].url);
        }

        if(message.name == 'postComment'){
          console.log('webpage received comment');
          console.log(message);
          comment = message.comment;
          comment.userId = myAuth.sub;
          if(myComments.get(comment.url) == null){
            myComments.set(comment.url, [comment]);
          }
          else{
            var clist= [];
            var current= myComments.get(comment.url);
            clist.push(comment);
            for(var i=0;i<current.length;i++){
              clist.push(current[i]);
            }
            myComments.set(comment.url, clist);
          }
        }

        if(message.name == 'history'){
          tab = message.tab;
          historyEntry = {
            url: tab.url,
            title: tab.title,
            userId: myAuth.sub,
            faviconUrl: tab.favIconUrl,
            time: (new Date()).getTime(),
            tabId: tab.id,
            windowId: tab.windowId
          };
          hList = myHistory.get(myAuth.sub);
          if(myHistory.get(myAuth.sub) == null){
            myHistory.set(myAuth.sub, [historyEntry])
          }
          else{
            hList = [];
            currentH = myHistory.get(myAuth.sub);
            hList.push(historyEntry);
            lasturls = {};
            lasturls[historyEntry.tabId] = historyEntry.url;
            lastTitles = {};
            lastTitles[historyEntry.tabId] = historyEntry.title;
            seenIds = [];
            //lasturl = historyEntry.url;
            for(var i=0;i<currentH.length;i++){
              e = currentH[i];
              if(lasturls[e.tabId] != e.url && lastTitles[e.tabId] != e.title){
                hList.push(e);
                lasturls[e.tabId]=e.url;
                lastTitles[e.tabId] = e.title;
              }
            }
            myHistory.set(myAuth.sub, hList);
          }
        }
      }
    });
  }

});//end of a super long controller

function activateTabHover(){
  $('.tab-li').unbind('mouseenter mouseleave');
  $('.tab-li').hover(function(){
    $(this).find('.tab-icons').show();
  }, function(){
    $(this).find('.tab-icons').hide();
  });
}
