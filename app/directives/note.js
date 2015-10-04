/******* PANEL BUTTON ********/
app.directive('addNote', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var note = null;
			$element[0].onmousedown = function(e){
				note = $scope.add.note();
				note.x = e.pageX + origin().x - 17;
				note.y = e.pageY + origin().y - 17;
				$scope.$apply();
				document.onmousemove = function(e){
					note.x = e.pageX + origin().x - 17;
					note.y = e.pageY + origin().y - 17;
					$scope.$apply();
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;

					//find nearest point to left
					var closest = $scope.canvas.points[0];
					var minDx = Math.abs(note.x - $scope.canvas.points[0].x);
					for(var i = 0; i < $scope.canvas.points.length; i++){
						var dx = Math.abs(note.x - $scope.canvas.points[i].x);
						if(dx < minDx){
							minDx = dx;
							closest = $scope.canvas.points[i];
						}
					}
					note.point = closest;
					if(!closest.notes) closest.notes = [];
					closest.notes.push(note);
					$scope.canvas.temp.notes = [];
					$scope.edit.note(note);
					$scope.$apply();
				} //onmouseup end
			}//onmousedown end
		}//link end
	}//return end
});