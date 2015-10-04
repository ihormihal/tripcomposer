app.directive('tripPoint', function(){
    return {
    	restrict: 'A',
		templateUrl: 'app/svg/point.svg',
		link: function($scope, $element, $attrs) {
			var point = $scope.canvas.points[$attrs.index];
			//move start
			var balloon = $element[0].childNodes[0].childNodes[7];
			//var balloon = $element[0];
			balloon.onmousedown = function(e){
				console.log('point_onmousedown');
				e.stopPropagation();
				if(e.which !== 1) return false;		
				var y = point.y;
				var x = point.x;
				//move
				document.onmousemove = function(e){
					point.x = e.pageX + origin().x;
					point.y = e.pageY + origin().y + 55;
					point.time = $scope.getTime(point.x);
					$scope.$apply();
				};
				//move end
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
    				balloon.onmouseup = null;
    				console.log('point_onmouseup');
    				point.y = y;
    				if(point.x == x) return false; //if not moved
    				if(point.x <= $scope.settings.dx) point.x = $scope.settings.dx;
    				point.time = $scope.getTime(point.x);
    				$scope.request.editPoint(point);
					$scope.initDays();
    				$scope.plot();
					$scope.reConnect();
    				$scope.$apply();
				}
			};
		}
    };
});

/******* PANEL BUTTON ********/
app.directive('addPoint', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var point = null;
			$element[0].onmousedown = function(e){
				console.log('point_onmousedown');
				point = $scope.add.point();
				point.x = e.pageX + origin().x - 10;
				point.y = e.pageY + origin().y + 55;
				$scope.$apply();
				document.onmousemove = function(e){
					point.x = e.pageX + origin().x - 10;
					point.y = e.pageY + origin().y + 55;
					point.time = $scope.getTime(point.x);
					$scope.$apply();
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					$element[0].onmouseup = null;
					console.log('point_onmouseup');
					if(point.x < $scope.settings.dx) point.x = $scope.settings.dx;
					point.time = $scope.getTime(point.x);
					$scope.edit.point(point);
					$scope.$apply();
				}
			}
		}
	}
});