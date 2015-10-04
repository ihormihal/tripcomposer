/******* PANEL BUTTON ********/
app.directive('addAccomodation', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var accommodation = null;
			$element[0].onmousedown = function(e){
				accommodation = $scope.add.accommodation();
				accommodation.x = e.pageX + origin().x - 17;
				accommodation.y = e.pageY + origin().y - 17;
				$scope.$apply();
				document.onmousemove = function(e){
					accommodation.x = e.pageX + origin().x - 17;
					accommodation.y = e.pageY + origin().y - 17;
					$scope.$apply();
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;

					//find nearest point to left
					var closest = $scope.canvas.points[0];
					var minDx = Math.abs(accommodation.x - $scope.canvas.points[0].x);
					for(var i = 0; i < $scope.canvas.points.length; i++){
						var dx = Math.abs(accommodation.x - $scope.canvas.points[i].x);
						if(dx < minDx){
							minDx = dx;
							closest = $scope.canvas.points[i];
						}
					}
					accommodation.point = closest;
					accommodation.checkIn = accommodation.point.startDate;
					accommodation.checkOut = accommodation.point.endDate;
					if(!closest.accommodations) closest.accommodations = [];
					closest.accommodations.push(accommodation);
					$scope.canvas.temp.accommodations = [];
					$scope.edit.accommodation(accommodation);
					$scope.$apply();
				} //onmouseup end
			}//onmousedown end
		}//link end
	}//return end
});