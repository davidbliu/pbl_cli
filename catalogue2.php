<?php
require_once("../pblPhp/header.php");
?>
<!DOCTYPE html>
<html>
  <head>
    <title>BB</title>
    <link rel = 'icon' type = 'image/png' href = './icons/logo-138.png'>


    <!-- Load Styles -->

    <!--<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>-->
    <!--<script src = './bower_components/jquery/dist/jquery.min.js'></script>-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>
    <script src = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js'></script>
    <script src = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/umd/scrollspy.js'></script>

    <link rel = 'stylesheet' href = './bower_components/bootstrap/dist/css/bootstrap.min.css'>

    <!--<link rel = 'stylesheet' href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.min.css'>-->
    <link rel = 'stylesheet' href = './main.css'>
      

    <!-- Load the Realtime JavaScript library -->
    <script src="https://apis.google.com/js/api.js"></script>

    <script src = './bower_components/underscore/underscore-min.js'></script>

    <!-- Load the utility library -->
    <script src="https://www.gstatic.com/realtime/realtime-client-utils.js"></script>

    <script src = './bower_components/angular/angular.min.js'></script>
    <!--load my own stuff (david)-->
    <script src = './node_modules/parse/dist/parse-latest.min.js'></script>
    <script src = './date.js'></script>

    <script src = './parse.js'></script>

    <script src = './icons.js'></script>
    <script src = './app.js'></script>
    <script src = './controllers/catalogue.js'></script>

    
  </head>
  <body ng-app = 'cliApp'>
  <div ng-controller = 'CatalogueCtrl'>
      <div class = 'jumbotron' >
        <h3>PBL Links</h3>
        <input type = 'text' placeholder = 'Search PBL Links' class = 'form-control' id =   'search-input' ng-model = 'searchTerm'>
      </div>

      <div id = 'myModal' class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">{{modalGolink.key}}</h4>
            </div>
            <div class="modal-body">
              <img src = '{{modalGolink.image.url()}}' id = 'modal-img'></img>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" ng-click = 'window.location.href = modalGolink.url' >Go</button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->

      <div>
        <i class = 'glyphicon glyphicon-arrow-left' ng-click = 'changePage(-1)'></i>
        <i class = 'glyphicon glyphicon-arrow-right' ng-click = 'changePage(1)'></i>
        <div>Page {{page+1}}, {{pageSize}} results per page</div> 
      </div>
      <div class = 'row' ng-repeat = 'week in weeks'>
        <h2 class = 'header'>{{week.text}}</h2>
        <div class = 'golink-div' ng-repeat = 'golink in weekDict[week.key] | filter:searchTerm' id = '{{golink.objectId}}'>
          <div> <img src = '{{getImg(golink)}}' class = 'golink-icon'/> </div>
          <div><a href = '{{golink.url}}' target = '_blank'>{{golink.key}}</a></div>
          <div>{{golink.description}}</div>
          <div>{{golink.member_email}}</div>
          <div ng-if = 'golink.tags && golink.tags.length > 0' >tags: <i>{{golink.tags.join(',')}}</i></div>
          <div>{{golink.num_clicks}}</div>
          <div ng-if = 'golink.image'>
            <img src = '{{golink.image.url()}}' class = 'thumbnail-img' ng-click = 'showModal(golink)'></img>
          </div>
          <div>
            <i class = 'glyphicon glyphicon-remove' ng-click = 'deleteGolink($event, golink)'></i>
            <i class = 'glyphicon glyphicon-cog' ng-click = 'showModal(golink)'></i>
          </div>
        </div>
      </div>

        <!--<div class = 'col-md-6'>-->
          <!--<img ng-repeat = 'golink in weekDict[week.key]' ng-if = 'golink.image' src = '{{golink.image.url()}}' class = 'thumbnail-img'></img>-->
        <!--</div>-->
      </div> <!--end of row week in weeks-->
  </div>
  </body>
</html>
