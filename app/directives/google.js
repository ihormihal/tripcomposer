app.directive('googlecity', function() {
    return {
        link: function($scope, $element, $attrs, $model) {
            var options = {
                language: 'ru',
                types: ['(cities)']
            };
            var googlePlace = new google.maps.places.Autocomplete($element[0], options);
            google.maps.event.addListener(googlePlace, 'place_changed', function() {
                var result = googlePlace.getPlace();
                $scope.place.city.coordinates = result.geometry.location.H+':'+result.geometry.location.L;
                for(var i=0; i < result.address_components.length; i++){

                    if(result.address_components[i].types.indexOf('locality') !== -1){
                        $scope.place.city.id = result.place_id;
                        $scope.place.city.name = result.address_components[i].long_name;
                        $scope.place.city.short_title = result.address_components[i].short_name
                    }
                    if(result.address_components[i].types.indexOf('country') !== -1){
                        $scope.place.country = {id: result.address_components[i].short_name, name: result.address_components[i].long_name};
                    }
                }
                $scope.$apply();
            });
        }
    };
});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function($scope, $element, attrs, $model) {
            
            $model.$render = function() {};

            var options = {
                //componentRestrictions: { country: "uk" },
                language: 'ru'
            };
            var gPlace = new google.maps.places.Autocomplete($element[0], options);
            var place = {};
            google.maps.event.addListener(gPlace, 'place_changed', function() {
                var result = gPlace.getPlace();
                console.log(result);
                place = {
                    name: result.name,
                    country: null,
                    location: result.geometry.location.G+':'+result.geometry.location.K
                };
                for(var i=0; i < result.address_components.length; i++){
                    if(result.address_components[i].types.indexOf('country') !== -1){
                        place.country = {id: result.address_components[i].short_name, title: result.address_components[i].long_name};
                    }
                }
                $scope.$apply(function() {
                    $model.$setViewValue(place);
                });
            });
        }
    };
});