/******* PANEL BUTTON ********/
app.directive('addTransfer', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var transfer = null;
			$element[0].onmousedown = function(e){
				transfer = $scope.add.transfer();
				transfer.x = e.pageX + origin().x - 17;
				transfer.y = e.pageY + origin().y - 17;
				$scope.$apply();
				document.onmousemove = function(e){
					transfer.x = e.pageX + origin().x - 17;
					transfer.y = e.pageY + origin().y - 17;
					$scope.$apply();
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;

					//find nearest point to left
					var closest_point_index = 0;
					var minDx = transfer.x - $scope.canvas.points[0].x;
					for(var i = 0; i < $scope.canvas.points.length; i++){
						var dx = transfer.x - $scope.canvas.points[i].x;
						if(dx >= 0 && dx < minDx){
							minDx = dx;
							closest_point_index = i;
						}
					}
					var connection = null;
					for(var i = 0; i < $scope.canvas.connections.length; i++){
						if(closest_point_index == $scope.canvas.connections[i].index_from){
							connection = $scope.canvas.connections[i];
						}
					}
					if(connection){
						transfer.index_from = connection.index_from;
						transfer.index_to = connection.index_to;
						transfer.pointFrom = $scope.canvas.points[connection.index_from];
						transfer.pointTo = $scope.canvas.points[connection.index_to];
						connection.transfers.push(transfer);
						$scope.canvas.temp.transfers = [];
						$scope.edit.transfer(transfer);
					}else{
						$scope.canvas.temp.transfers = [];
						console.log('need create new point and connection');
					}
					$scope.$apply();
				} //onmouseup end
			}//onmousedown end
		}//link end
	}//return end
});