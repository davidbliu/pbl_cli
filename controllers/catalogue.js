var ParseGoLinkFields= ['key', 'url', 'createdAt', 'image', 'updatedAt', 'description', 'tags', 'member_email', 'num_clicks'];


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
        //minDateUnix = $scope.minDate.getTime()/1000;
        maxDateUnix = $scope.maxDate.getTime()/1000;
        var WEEKS = 604800;
        var seen = [];
        _.each($scope.golinks, function(golink){
          weeks = Math.floor((maxDateUnix - golink.createdAt.getTime()/1000)/WEEKS);
          if(!_.contains(seen, weeks)){
            $scope.weekDict[weeks] = [];
            seen.push(weeks);
          }
          $scope.weekDict[weeks].push(golink);
        });
        $scope.weeks = _.map(_.keys($scope.weekDict), function(week){
          wk = {};
          wk.key = week;
          endTime= new Date(1000*(maxDateUnix - week * WEEKS));
          startTime = new Date(endTime - WEEKS*1000);
          //startTime= (new Date(1000*(maxDateUnix - (week+1) * WEEKS))).toString();
          wk.text = startTime.toString() + ' - ' + endTime.toString();
          return wk;
        });
        $scope.$digest();
      }
    });
  }
  pullGolinks();


});
