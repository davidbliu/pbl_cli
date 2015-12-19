var app = angular.module('cliApp', []);
var MAXINT = 1000;
app.filter('to_trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

app.directive('scrollSpy', function($timeout){
  return function(scope, elem, attr) {
    scope.$watch(attr.scrollSpy, function(value) {
      $timeout(function() { elem.scrollspy('refresh') }, 200);
    }, true);
  }
});

