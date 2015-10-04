/* pickadate */

var app = angular.module('pickadate',[]);


app.directive('pickadate',function($timeout){
    return{
        restrict: 'E',
        scope: {
        	time:'=',
        	onPick:'='
        },
        template:  '<input type="text" class="datepicker full" />',
        replace:true,
        link:function($scope,$element,attrs){
            (function init(){
                $element.pickadate({
					container: 'body',
					selectMonths: true,
					selectYears: 2
				})
				.pickadate('picker')
				.set('select', $scope.time)
				.on({
					/*set: function(){
						if(this.get('select')){
							$scope.onPick(this.get('select').pick);
						}
					}*/
					set: $scope.onPick
				});
            })();
            $scope.$watch('time', function(value) {
                $timeout(function(){ $element.pickadate('picker').set('select', value); });
            });
        }
    }
});
