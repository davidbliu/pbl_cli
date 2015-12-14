<link rel = 'stylesheet' href = './bower_components/bootstrap/dist/css/bootstrap.min.css'>
<script src = './bower_components/jquery/dist/jquery.min.js'></script>
<script src = './node_modules/parse/dist/parse-latest.min.js'></script>
<script src = './bower_components/angular/angular.min.js'></script>
<script src = './bower_components/underscore/underscore-min.js'></script>
<script src = './parse.js'></script>
<script src = './interpreter.js'></script>
<script src = './app.js'></script>
<script src = './controllers.js'></script>

<style type = 'text/css'>
body{
  background-image: url("wood.jpg");
}
.navbar{
  border-radius:0px;
}
.top-input{
  width:50%;
  margin:5px;
}
#banner{
  text-align:center;
  color:white;
}
.tweet{
  background-color:white;
  border:1px solid rgba(0,0,0,0.1);
  padding:5px;
  margin:5px;
  width:50%;
  border-radius:3px;
}
</style>

<body ng-app = 'cliApp'>

<div ng-controller = 'CliCtrl'>
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <h3 id = 'banner'>$PBL_cli;</h3>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li ng-repeat = 'channel in channels' ng-click = 'pullTweets(channel)'><a href="#">{{channel}}</a></li>
        </ul>
      </div>
    </div><!-- /.container-fluid -->
  </nav>
  <div id = 'controls'>
    <input class = 'form-control top-input' id = 'search' ng-model = 'content' placeholder = 'Enter commands here, or text' ng-enter = 'sendTweet(channel, content)' />
    <input class = 'form-control top-input' id = 'search' ng-model = 'searchTerm' placeholder = 'Search'/>
  </div>
  <div id = 'tweets-container'>
    <h2>{{channel}}</h2>
    <div ng-repeat = 'tweet in tweets' class = 'tweet'>
      <div class = 'content' ng-bind-html = 'tweet.get("content") | to_trusted'></div>
      <a href = 'javascript:void(0)' ng-click = 'deleteTweet(tweet)'>x</a>
    </div>
  </div>
</div>

</body>
