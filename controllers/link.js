 $(document).scroll(function() {
   top = $(this).scrollTop();
   if($(this).scrollTop()>300){
     $('#nav').css('top','20px');
   }
   else{
     $('#nav').css('top', '');
   }
 });                   
 
ParseGoLinkFields = ['key', 'url', 'createdAt', 'updatedAt', 'num_clicks', 'directory', 'tags', 'permissions', 'tokens', 'description', 'member_email'];


var linkMap;
app.controller('LinkCtrl', function($scope){
  
  $scope.editing = false;
  $scope.getImg = function(golink){
    return getIconFromUrl(golink.url);
  }
    


  $scope.hasChildren = function(dir){
    if(_.contains(_.keys($scope.subdirs), dir)){
      return true;
    }
    return false;
  }

  function pullGolinks(){
    q = new Parse.Query(ParseGoLink);
    q.limit(1000);
    q.exists('directory');
    q.find({
      success:function(golinks){
        $scope.golinks = convertParseObjects(golinks, ParseGoLinkFields);
        directories = _.map(_.uniq($scope.golinks, function(golink){
          return golink.directory;
        }), function(x){
          return x.directory
        });
        sortDirs(directories);
        //create links
        $scope.linkDir = {};
        $scope.directories = [];
        _.each($scope.golinks, function(link){
          if(!_.contains($scope.directories, link.directory)){
            $scope.directories.push(link.directory);
            $scope.linkDir[link.directory] = [];
          }
          $scope.linkDir[link.directory].push(link);
        });
        $scope.directories = _.sortBy($scope.directories, function(x){ return x; });
        $scope.directories = _.filter($scope.directories, function(x){ return x!= null && x != ''; });
        $scope.$digest();
      }
    });
  }
  //pullGolinks();

  $scope.pullCollectionId = function(id){
    console.log('asasdlksdfkj');
    $scope.collectionId = id;
    pullCollection();
  }

  function pullCollection(){
    //coursesId = 'n0yF63HepG';
    //fallId = 'sgVIeYEKlA';
    q = new Parse.Query(Collection);
    q.find({
      success:function(collections){
        collection = collections[0];
        if($scope.collectionId != null){
          collection = _.filter(collections, function(x){return x.id == $scope.collectionId;})[0];
        }
        $scope.collections = collections;
        golink_keys = [];
        $scope.collection = collection;
        $scope.collectionName = collection.get('name');
        map = JSON.parse(collection.get('map'));
        $scope.map = map;
        _.each(_.keys(map), function(key){
          _.each(map[key], function(x){
            golink_keys.push(x);
          });
        });
        //pull golinks
        q = new Parse.Query(ParseGoLink);
        q.containedIn('key', golink_keys);
        q.limit(1000);
        q.find({
          success:function(golinks){
            golinks = convertParseObjects(golinks, ParseGoLinkFields);
            golinkMap = {};
            seen = new Set();
            _.each(golinks, function(golink){
              if(!seen.has(golink.key)){
                seen.add(golink.key);
                golinkMap[golink.key] = [];
              }
              golinkMap[golink.key].push(golink);
            });
            $scope.linkDir = {};
            _.each(_.keys(map), function(dir){
              $scope.linkDir[dir] =  [];
              _.each(map[dir], function(golink_key){
                _.each(golinkMap[golink_key], function(golink){
                  $scope.linkDir[dir].push(golink);
                });
              });
            });
            $scope.directories = _.uniq(_.keys(map));
            sortDirs($scope.directories);
            $scope.$digest();
          }
        });
      }
    });
  }
  pullCollection();

  //sets topdirs and subdirs
  function sortDirs(dirs){
    topdirs = [];
    subdirs = {};
    seen = [];
    _.each(dirs, function(dir){
      dirMatches = dir.match(/\//g);
      if(dirMatches != null){  
        slashes = dir.match(/\//g).length;
        splits = dir.split('/');  
        if(splits.length == 2){
          topdirs.push(splits[1]);
        }
        else{
          if(!_.contains(topdirs, splits[1])){
            topdirs.push(splits[1]);
          }
          if(!_.contains(seen, splits[1])){
            subdirs[splits[1]] = [];
            seen.push(splits[1]);
          }
          subdirs[splits[1]].push(splits[2]);
        }
      }
      topdirs = _.uniq(topdirs);
      _.each(_.keys(subdirs), function(key){
        subdirs[key] = _.uniq(subdirs[key]);
      });
      $scope.topdirs = topdirs;
      $scope.subdirs = subdirs;
    });
  }

  $scope.$watch('editFilter', function(newFilter){
    if (newFilter != null && newFilter != ''){
      keys = _.map($scope.linkDir[newFilter], function(golink){
        return golink.key;
      });
      keyStr = keys.join('\n');
      $('#id-textarea').val(keyStr);
    }
  });

  $scope.dirLabel = function(dir){
    return dir.replace(/\//g, "");
  }
  $scope.dirComponents = function(dir){
    return dir.split('/');
  }

  //save to collection
  $scope.setMap = function(){
    var str = $('#id-textarea').val();
    keys = str.split('\n');
    dir = $scope.editFilter;
    $scope.map[dir] = keys;
    $scope.collection.set('map', JSON.stringify($scope.map));
    $scope.collection.save(null, {
      success:function(data){
        console.log('saved');
        pullCollection();
      }
    });
    $scope.editing = false;
  }

});
