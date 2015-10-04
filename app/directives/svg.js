app.directive('ngCustomSelection', function() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			$element[0].onmousedown = function(e){
				if(e.which !== 1) return false;
				$scope.canvas.selection.visible = false;
				var x = e.pageX + origin().x;
				var y = e.pageY + origin().y;
				$scope.$apply();
				//move
				$element[0].onmousemove = function(e){
					$scope.canvas.selection.visible = true;
					if(e.pageX + origin().x >= x){
						$scope.canvas.selection.x = x;
						$scope.canvas.selection.width = e.pageX + origin().x - x;
					}else{
						$scope.canvas.selection.x = e.pageX + origin().x;
						$scope.canvas.selection.width = x - (e.pageX + origin().x);
					}
					if(e.pageY + origin().y >= y){
						$scope.canvas.selection.y = y;
						$scope.canvas.selection.height = e.pageY + origin().y - y;
					}else{
						$scope.canvas.selection.y = e.pageY + origin().y;
						$scope.canvas.selection.height = y - (e.pageY + origin().y);
					}
					$scope.$apply();
				};
				//move end
				$element[0].onmouseup = function(){
					$element[0].onmousemove = null;
    				$element[0].onmouseup = null;
    				for(var i = 0; i < $scope.canvas.points.length; i++){
    					var point = $scope.canvas.points[i];
    					point.selected = false;
    					if($scope.canvas.selection.visible){
							if(
								point.x > $scope.canvas.selection.x && 
								point.x <= ($scope.canvas.selection.x + $scope.canvas.selection.width) &&
								point.y - 55 > $scope.canvas.selection.y && 
								point.y - 55 <= ($scope.canvas.selection.y + $scope.canvas.selection.height)
							){
								point.selected = true;
							}
						}
    				}
    				$scope.$apply();
				};
			};
		}
	}
});

app.directive('ngTransform', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngTransform', function(value) {
				$element.attr('transform', value);
			});
		}
	}
});
app.directive('ngWidth', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngWidth', function(value) {
				$element.attr('width', value);
			});
		}
	}
});
app.directive('ngHeight', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngHeight', function(value) {
				$element.attr('height', value);
			});
		}
	}
});
app.directive('ngX', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngX', function(value) {
				$element.attr('x', value);
			});
		}
	}
});
app.directive('ngY', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngY', function(value) {
				$element.attr('y', value);
			});
		}
	}
});
app.directive('ngX1', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngX1', function(value) {
				$element.attr('x1', value);
			});
		}
	}
});
app.directive('ngX2', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngX2', function(value) {
				$element.attr('x2', value);
			});
		}
	}
});
app.directive('ngY1', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngY1', function(value) {
				$element.attr('y1', value);
			});
		}
	}
});
app.directive('ngY2', function() {
	return {
		restrict: 'A',
		controller: function ($scope, $element, $attrs) {
			$attrs.$observe('ngY2', function(value) {
				$element.attr('y2', value);
			});
		}
	}
});