
<link rel = 'stylesheet' href = './bower_components/bootstrap/dist/css/bootstrap.min.css'>
<script src = './bower_components/jquery/dist/jquery.min.js'></script>
<script src = './node_modules/parse/dist/parse-latest.min.js'></script>
<script src = './bower_components/angular/angular.min.js'></script>
<script src = './bower_components/underscore/underscore-min.js'></script>
<script src = './parse.js'></script>
<script src = './app.js'></script>
<script src = './controllers.js'></script>

<script src = 'http://cdn.ckeditor.com/4.5.6/standard/ckeditor.js'></script>
<style type = 'text/css'>
body{
  background-color:rgba(0,0,255, 0.1);
}
.tweet{
  padding:5px;
  margin:5px;
  border:1px solid rgba(0,0,0,0.1);
  background-color:white;
}
textarea{
  width:75% !important;
  height: 75px;
  margin-bottom:5px;
}
#edit-area{
  margin: 25px;
  margin-right:0px;
}
#edit-tweet{
  display:none;
}
#tweet-area{
  margin: 25px;
  width:75%;
  //border-left:10px solid rgba(0,0,0,0.1);
}
.navbar{
  border-radius:0px;
}
#banner{
  text-align:center;
  color:white;
}
.text-muted{
  opacity:0.5;
  font-size:9px;
}
#search{
  width: 50%;
  margin:25px;
}
#create-btn{
  margin-left:25px;
}
</style>

<body ng-app = 'cliApp'>
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <h2 id= 'banner' >Dear Dewid...</h2>
    </div>
  </div><!-- /.container-fluid -->
</nav>
<div ng-controller = 'HomeCtrl'>
<input class = 'form-control' id = 'search' ng-model = 'searchTerm' placeholder = 'Search Posts'/>
<div id = 'create-btn' class = 'btn btn-primary' ng-click = 'createPost()'>Create</div>
<div id = 'tweet-area'>
  <div id = 'edit-tweet' class = 'tweet'>
    <div id = 'edit-area'>
      <div>
        <textarea name="editor1"></textarea>
      </div>
      <div class = 'btn btn-success' ng-click = 'saveTweet()'>Send</div>
      <div class = 'btn btn-danger' ng-click = 'cancelTweet()'>Cancel</div>
    </div>
  </div>
  <div ng-repeat = 'tweet in tweets | filter:searchTerm' class = 'tweet'>
    <div class = 'pull-right btn btn-danger' ng-click = 'deleteTweet(tweet.objectId)'>x</div>
    <div class = 'content' ng-bind-html = 'tweet.content | to_trusted'></div>
    <div class = 'text-muted'>{{tweet.createdAt}}</div>
  </div>
</div>
</div>
</body>
