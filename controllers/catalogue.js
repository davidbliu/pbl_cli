var ParseGoLinkFields= ['key', 'url', 'createdAt', 'image', 'updatedAt', 'description', 'tags', 'member_email', 'num_clicks'];
var WEEKS = 604800;


app.controller('CatalogueCtrl', function($scope){

  $scope.getImg = function(golink){
    return getIconFromUrl(golink.url);
  }
  var headerHidden = false;
  $scope.page = 0;
  $scope.pageSize = 1000;
  function activateSearch(){
    $('#search-input').keyup(function(){
      console.log($(this).val());
      if($(this).val() != ''){
        headerHidden = true;
        $('.header').each(function(){
          $(this).hide();
        });
      }
      else{
        if(headerHidden){
          $('.header').each(function(){
            $(this).show();
          });
        }
      }
    });
  }
  activateSearch();

  $scope.deleteGolink = function($event, golink){
    var id = golink.objectId;
    q = new Parse.Query(ParseGoLink);
    q.get(golink.objectId, {
      success:function(data){
        data.destroy({
          success:function(data2){
            console.log('removed');
            $('#'+id).remove();
          }
        });
      }
    });

  }
  
  $scope.showModal = function(golink){
    $scope.modalGolink= golink;
    $("#myModal").modal();
  };

  $scope.changePage = function(diff){
    $scope.page = $scope.page + diff;
    pullGolinks();
  };

  function pullGolinks(){
    $scope.golinks=[];
    $scope.weekDict = {};
    $scope.weeks = [];
    q = new Parse.Query(ParseGoLink);
    q.descending('createdAt');
    //q.notEqualTo('member_email', 'davidbliu@gmail.com');
    q.limit($scope.pageSize);
    q.skip($scope.page * $scope.pageSize);
    q.find({
      success:function(golinks){
        $scope.golinks = convertParseObjects(golinks, ParseGoLinkFields);
        $scope.minDate = _.min($scope.golinks, function(x){
          return x.createdAt;
        }).createdAt;
        $scope.maxDate = _.max($scope.golinks, function(x){
          return x.createdAt;
        }).createdAt;
        var minDateUnix = $scope.minDate.getTime()/1000;
        var maxDateUnix = $scope.maxDate.getTime()/1000;
        $scope.weekDict = getWeekDict($scope.golinks, maxDateUnix);
        $scope.weeks = _.map(_.keys($scope.weekDict), function(week){
          wk = {};
          wk.key = week;
          endTime= new Date(1000*(maxDateUnix - week * WEEKS));
          startTime = new Date(endTime - WEEKS*1000);
          wk.text = startTime.toString() + ' - ' + endTime.toString();
          return wk;
        });

        //also pull blogposts
        //console.log('pulling blogposts too');
        //bq = new Parse.Query(BlogPost);
        //bq.greaterThan('createdAt', $scope.minDate);
        //bq.find({
          //success:function(blogposts){
            //$scope.blogposts = convertParseObjects(blogposts, BlogPostFields);
            //_.each($scope.blogposts, function(x){
            //});
            //$scope.blogpostDict = getWeekDict($scope.blogposts, maxDateUnix);
            //console.log($scope.blogpostDict);
            //$scope.$digest();
          //}
        //});
        $scope.$digest();
      }
    });
  }
  pullGolinks();


});
