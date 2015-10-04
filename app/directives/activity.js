/******* PANEL BUTTON ********/
app.directive('addActivity', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var activity = null;
			$element[0].onmousedown = function(e){
				activity = $scope.add.activity();
				activity.x = e.pageX + origin().x - 17;
				activity.y = e.pageY + origin().y - 17;
				$scope.$apply();
				document.onmousemove = function(e){
					activity.x = e.pageX + origin().x - 17;
					activity.y = e.pageY + origin().y - 17;
					$scope.$apply();
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;

					//find nearest point to left
					var closest = $scope.canvas.points[0];
					var minDx = Math.abs(activity.x - $scope.canvas.points[0].x);
					for(var i = 0; i < $scope.canvas.points.length; i++){
						var dx = Math.abs(activity.x - $scope.canvas.points[i].x);
						if(dx < minDx){
							minDx = dx;
							closest = $scope.canvas.points[i];
						}
					}
					activity.point = closest;
					if(!closest.activities) closest.activities = [];
					closest.activities.push(activity);
					$scope.canvas.temp.activities = [];
					$scope.edit.activity(activity);
					$scope.$apply();
				} //onmouseup end
			}//onmousedown end
		}//link end
	}//return end
});