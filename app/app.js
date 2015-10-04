var scrollElement = document.getElementById('scroll');
var origin = function(){
	var square = {
		width: scrollElement.clientWidth,
		height: scrollElement.clientHeight,
		x: scrollElement.scrollLeft - scrollElement.offsetLeft,
		y: scrollElement.scrollTop - scrollElement.offsetTop
	};
	return square;
};

//config
var url = {
	tripboard: {
		get: 'server/'
	},
	price: {
		get: 'server/price.json',
		set: 'server/?type=setprice'
	},
	point: {
		add: 'server/?type=addpoint',
		remove: 'server/?type=removepoint',
		edit: 'server/?type=editpoint'
	},
	transfer: {
		get: 'server/transfers.json',
		add: 'server/?type=addtransfer',
		remove: 'server/?type=removetransfer',
		edit: 'server/?type=edittransfer'
	},
	accommodation: {
		get: 'server/accommodations.json',
		add: 'server/?type=addAccommodation',
		remove: 'server/?type=removeAccommodation',
		edit: 'server/?type=editAccommodation'
	}
};

//config
var url_ = {
	tripboard: {
		get: 'http://tripcomposer.net/rest/service/tripboard/get'
	},
	price: {
		get: 'http://tripcomposer.net/rest/service/tripboard/triptotal/get',
		set: 'http://tripcomposer.net/rest/service/tripboard/usertotal/set'
	},
	point: {
		add: 'http://tripcomposer.net/rest/service/point/add',
		remove: 'http://tripcomposer.net/rest/service/point/remove',
		edit: 'http://tripcomposer.net/rest/service/point/edit'
	},
	transfer: {
		get: 'server/transfers.json',
		add: 'http://tripcomposer.net/rest/service/transfer/add',
		remove: 'http://tripcomposer.net/rest/service/transfer/remove',
		edit: 'http://tripcomposer.net/rest/service/transfer/edit'
	},
	accommodation: {
		get: 'server/accommodations.json',
		add: 'http://tripcomposer.net/rest/service/accommodation/add',
		remove: 'http://tripcomposer.net/rest/service/accommodation/remove',
		edit: 'http://tripcomposer.net/rest/service/accommodation/edit'
	}
};

var app = angular.module('app',['checklist-model','ionSlider', 'pickadate']);


app.controller('mainController', ['$scope','$http', function($scope,$http){
	$scope.settings = {
		dx: 180,
		dy: 120,
		transfers : ['flight','bus','train','car','ship']
	};

	$scope.data = {};
	$scope.all = {};
	$scope.place = {};
	$scope.totalPrice = 0;

	$scope.priceMap = {};
	//load tripboard
	$scope.request = {
		getBoard : function(){
			console.log('getBoard');
			$http.post(
				url.tripboard.get, 
				{}
			).then(function(response){
				if(!response.data.success){
					alert(response.data.message);
				}
				if('tripBoard' in response.data){
					if(response.data.tripBoard.points.length > 0){
						$scope.data = response.data.tripBoard;
						$scope.init();
					}
				}
			});
		},
		setPrice: function(price){
			console.log('setPrice');
			$http.post(
				url.price.set, 
				{userTripTotal: price}
			).then(function(response){
				if(response.data.success){
					$scope.data.tripTotal = response.data.userTripTotal;
				}else{
					alert(response.data.message);
				}
			});
		},
		addPoint : function(point){
			console.log('add_point_request');
			if(!point) return false;
			var pointObject = JSON.stringify({
				countryName: point.country.name,
				cityName: point.city.name,
				coordinates: point.city.coordinates,
				startDate: point.time,
				endDate: point.time+86400000
			});
			console.log(pointObject);
			$http.post(
				url.point.add,
				pointObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		removePoint: function(point){
			console.log('remove_point_request');
			if(!point) return false;
			var pointObject = JSON.stringify({
				pointId: point.id
			});
			console.log(pointObject);
			$http.post(
				url.point.remove,
				pointObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		editPoint: function(point){
			console.log('edit_point_request');
			if(!point) return false;
			var pointObject = JSON.stringify({
				pointId: point.id,
				countryName: point.country.name,
				cityName: point.city.name,
				coordinates: point.city.coordinates,
				startDate: point.startDate,
				endDate: point.endDate
			});
			console.log(pointObject);
			$http.post(
				url.point.edit,
				pointObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		addTransfer: function(transfer){
			console.log('add_transfer_request');
			var transferObject = {
				"pointFromId": transfer.pointFrom.id,
				"pointToId": transfer.pointTo.id,
				"startDate": transfer.pointFrom.time,
				"transferTypes": transfer.transferTypes
			};
			console.log(transferObject);
			
			$http.post(
				url.transfer.add,
				transferObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					console.log(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		editTransfer: function(transfer){
			console.log('add_transfer_request');
			var transferObject = {
				"transferId": transfer.id,
				"pointFromId": transfer.pointFrom.id,
				"pointToId": transfer.pointTo.id,
				"startDate": transfer.startDate,
				"transferTypes": transfer.transferTypes
			};
			console.log(transferObject);
			
			$http.post(
				url.transfer.edit,
				transferObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					console.log(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		removeTransfer: function(transfer){
			console.log('remove_transfer_request');
			if(!transfer) return false;
			var transferObject = JSON.stringify({
				transferId: transfer.id
			});
			console.log(transferObject);
			$http.post(
				url.transfer.remove,
				transferObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		addAccommodation: function(accommodation){
			console.log('add_accommodation_request');
			if(!accommodation) return false;
			var accommodationObject = JSON.stringify({
				pointId: accommodation.point.id,
				checkIn: accommodation.checkIn,
				checkOut: accommodation.checkOut,
				accommodationTypes: accommodation.accommodationTypes,
				locationTypes: accommodation.locationTypes
			});
			//console.log(accommodationObject);
			$http.post(
				url.accommodation.add,
				accommodationObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		removeAccommodation: function(accommodation){
			console.log('remove_accommodation_request');
			if(!accommodation) return false;
			console.log(accommodation);
			var accommodationObject = JSON.stringify({
				pointId: accommodation.point.id,
				accommodationId: accommodation.id
			});
			//console.log(accommodationObject);
			$http.post(
				url.accommodation.remove,
				accommodationObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		},
		editAccommodation: function(accommodation){
			console.log('edit_accommodation_request');
			if(!accommodation) return false;
			console.log(accommodation);
			var accommodationObject = JSON.stringify({
				pointId: accommodation.point.id,
				accommodationId: accommodation.id,
				checkIn: accommodation.checkIn,
				checkOut: accommodation.checkOut,
				accommodationTypes: accommodation.accommodationTypes,
				locationTypes: accommodation.locationTypes
			});
			//console.log(accommodationObject);
			$http.post(
				url.accommodation.edit,
				accommodationObject
			).then(function(response){
				console.log(response);
				if(!response.data.success){
					alert(response.data.message);
				}
				if(response.data.tripBoard.points.length > 0){
					$scope.data = response.data.tripBoard;
					$scope.init();
				}
			});
		}
	};

	$scope.request.getBoard();

	$scope.canvas = {
		width : origin().width,
	 	height : origin().height,
		points: [],
		transfers: [],
		days : [],
		countries: [],
		connections: [],
		temp: {transfers: [], accommodations: [], activities: [], notes: []},
		selection: {x: 0, y: 0, width: 0, height: 0}
	};

	$scope.popup = {
		point: null,
		transfer: null,
		accommodation: null,
		activity: null,
		note: null
	};

	$scope.tooltip = {
		point: null,
		transfer: null,
		accommodation: null,
		activity: null,
		note: null
	};

	// FUNCTIONS
	$scope.init = function(){
		$scope.initData();
		$scope.initCountries();
		$scope.initDays();
		$scope.plot();
		$scope.initConnections();
	};

	$scope.initData = function(){
		console.log('init');
		$scope.totalPrice = 0;
		$scope.canvas.points = $scope.data.points;
		$scope.canvas.transfers = $scope.data.transfers;

		$scope.totalPrice += $scope.canvas.transfers.length * 120;
		//convert time and bind elements
		for(var i=0; i < $scope.canvas.points.length; i++){
			//$scope.canvas.points[i].time = new Date($scope.canvas.points[i].startDate).getTime();
			$scope.canvas.points[i].time = $scope.canvas.points[i].startDate;
			if(!$scope.canvas.points[i].accommodations) $scope.canvas.points[i].accommodations = [];
			if(!$scope.canvas.points[i].activities) $scope.canvas.points[i].activities = [];
			if(!$scope.canvas.points[i].notes) $scope.canvas.points[i].notes = [];

			for(var j=0; j < $scope.canvas.points[i].accommodations.length; j++){
				$scope.canvas.points[i].accommodations[j].point = $scope.canvas.points[i];
				$scope.totalPrice += 50;
			}
			for(var j=0; j < $scope.canvas.points[i].activities.length; j++){
				$scope.canvas.points[i].activities[j].point = $scope.canvas.points[i];
				$scope.totalPrice += 20;
			}
			for(var j=0; j < $scope.canvas.points[i].notes.length; j++){
				$scope.canvas.points[i].notes[j].point = $scope.canvas.points[i];
			}
		}
	};

	$scope.initCountries = function(){
		console.log('init_countries');
		$scope.canvas.countries = [];
		var uniqCountries = {};
		for(var i=0; i < $scope.canvas.points.length; i++){
			uniqCountries[$scope.canvas.points[i].country.name] = $scope.canvas.points[i].country;
		}
		for(var i in uniqCountries){
			$scope.canvas.countries.push(uniqCountries[i]);
		}
		//set canvas height
		var graphHeight = $scope.canvas.countries.length * $scope.settings.dx;
		if(graphHeight > origin().height){
			$scope.canvas.height = graphHeight;
		}
	};
	
	$scope.initDays = function(){
		console.log('init_days');
		if($scope.canvas.points.length == 0) return false;
		$scope.canvas.points.sort(function(a,b){return a.time - b.time});
		$scope.canvas.days = [];
		var minDayTime = Math.floor($scope.canvas.points[0].time/86400000)*86400000;
		var maxDayTime = Math.floor($scope.canvas.points[$scope.canvas.points.length-1].time/86400000 + 1)*86400000;

		var periods = [];
		var scale = 1;
		for(var i = 0; i < $scope.canvas.points.length; i++){
			var periodStart = Math.floor($scope.canvas.points[i].time/86400000)*86400000;
			var periodEnd = periodStart+86400000;
			if(periods.indexOf(periodStart) == -1){
				var periodPrev = periods[periods.length - 1];
				if(periodPrev) scale = Math.ceil((periodStart-periods[periods.length - 1])/86400000);
				if(scale == 0 ) scale = 1;
				
				$scope.canvas.days.push({
					title: periodStart,
					scale: scale,
					time: periodStart
				});
				periods.push(periodStart);
			}
			if(periods.indexOf(periodEnd) == -1){
				var periodPrev = periods[periods.length - 1];
				if(periodPrev) scale = Math.ceil((periodStart-periods[periods.length - 1])/86400000);
				if(scale == 0 ) scale = 1;
				
				$scope.canvas.days.push({
					title: periodEnd,
					scale: scale,
					time: periodEnd
				});
				periods.push(periodEnd);
			}
		}
		//set canvas width
		var graphWidth = $scope.canvas.days.length * $scope.settings.dx;
		if(graphWidth + $scope.settings.dx > origin().width){
			$scope.canvas.width = graphWidth + $scope.settings.dx * 2;
		}
	};
	
	$scope.plot = function(){
		console.log('plot');
		//parse points
		$scope.canvas.points.sort(function(a,b){return a.time - b.time});
		for(var i=0; i < $scope.canvas.points.length; i++){
			var point = $scope.canvas.points[i];
			for(var day = 0; day < $scope.canvas.days.length; day++){
				var timeDif = (point.time - $scope.canvas.days[day].time);
				if(timeDif >= 0 && timeDif < 86400000-1){
					point.x = $scope.settings.dx*(1+day+timeDif/86400000);
				}
			}

			for(var country = 0; country < $scope.canvas.countries.length; country++){
				if(point.country.name == $scope.canvas.countries[country].name){
					point.y = $scope.settings.dy * (1 + country);
				}
			}
		}
	};

	$scope.initConnections = function(){
		$scope.canvas.connections = [];
		for(var i=1; i < $scope.canvas.points.length; i++){
			var connection = {
				index_from: i-1, 
				index_to: i, 
				transfers: []
			};
			var point_from_id = $scope.canvas.points[i-1].id;
			var point_to_id = $scope.canvas.points[i].id;
			if($scope.canvas.transfers.length > 0){
				for(var j=0; j < $scope.canvas.transfers.length; j++){
					if($scope.canvas.transfers[j].pointFrom == point_from_id && $scope.canvas.transfers[j].pointTo == point_to_id){
						connection.transfers.push($scope.canvas.transfers[j]);
					}
				}
			}
			$scope.canvas.connections.push(connection);
		}
	};

	$scope.reConnect = function(){
		$scope.canvas.transfers = [];
		//parse transfers
		for(var i = 0; i < $scope.canvas.connections.length; i++){
			for(var j = 0; j < $scope.canvas.connections[i].transfers.length; j++){
				$scope.canvas.transfers.push($scope.canvas.connections[i].transfers[j]);
			}
		}
		//update connections
		$scope.initConnections();
	};

	$scope.getTime = function(x){
		console.log('get_time');
		var time = new Date().getTime();;
		var lastDay = $scope.canvas.days.length - 1;
		for(var day = 1; day < $scope.canvas.days.length; day++){
			if(x >= (day-1+1)*$scope.settings.dx && x < (day+1)*$scope.settings.dx){
				var dif = x - (day-1+1)*$scope.settings.dx;
				time = $scope.canvas.days[day-1].time + (dif/$scope.settings.dx)*$scope.canvas.days[day].scale*86400000;
			}else if(x >= (lastDay + 1)*$scope.settings.dx){
				var dif = x - (lastDay + 1)*$scope.settings.dx;
				time = $scope.canvas.days[lastDay].time + (dif/$scope.settings.dx)*86400000;
			}
		}
		return Math.round(time);
	};

	document.addEventListener('mousedown', function(event) {
		console.log('document mousedown');
		if(event.target.id == 'canvas'){
			//close context menu
			$scope.contextmenu.clear();
			//close tooltips
			for(tooltip in $scope.close.tooltip){
				$scope.close.tooltip[tooltip]();
			}
		}
	});

	$scope.getPoindById = function(id){
		for(var i = 0; i < $scope.canvas.points.length; i++){
			if(id == $scope.canvas.points[i].id){
				return $scope.canvas.points[i];
			}
		}
	};

	/****** PLUS ELEMENT *******/
	$scope.plus = {
		transfer: function(point){
			var transfer = $scope.add.transfer();
			var pointIndex = $scope.canvas.points.indexOf(point);
			for(var i = 0; i < $scope.canvas.connections.length; i++){
				if($scope.canvas.connections[i].index_to == pointIndex){
					var connection = $scope.canvas.connections[i];
					if(!connection.transfers) connection.transfers = [];

					transfer.index_from = connection.index_from;
					transfer.index_to = connection.index_to;
					transfer.pointFrom = $scope.canvas.points[connection.index_from];
					transfer.pointTo = $scope.canvas.points[connection.index_to];

					$scope.canvas.connections[i].transfers.push(transfer);
					$scope.canvas.temp.transfers = [];
					$scope.edit.transfer(transfer);
					break;
				}
			}
			$scope.contextmenu.clear();
		},
		accommodation: function(point){
			console.log('plus_accomodation');
			var accommodation = $scope.add.accommodation();
			accommodation.point = point;
			accommodation.checkIn = accommodation.point.startDate;
			accommodation.checkOut = accommodation.point.endDate;
			if(!point.accommodations) point.accommodations = [];
			point.accommodations.push(accommodation);
			$scope.canvas.temp.accommodations = [];
			$scope.edit.accommodation(accommodation);
			$scope.contextmenu.clear();
		},
		activity: function(point){
			console.log('plus_activity');
			var activity = $scope.add.activity();
			activity.point = point;
			if(!point.activities) point.activities = [];
			point.activities.push(activity);
			$scope.canvas.temp.activities = [];
			$scope.edit.activity(activity);
			$scope.contextmenu.clear();
		},
		note: function(point){
			var note = $scope.add.note();
			note.point = point;
			if(!point.notes) point.notes = [];
			point.notes.push(note);
			$scope.canvas.temp.notes = [];
			var point_index = $scope.canvas.points.indexOf(point);
			$scope.edit.note(note,point_index);
			$scope.contextmenu.clear();
		}
	};


	/****** CREATE ELEMENT *******/
	$scope.add = {
		point: function(){
			console.log('add_point');
			var index = $scope.canvas.points.push({
				id: 'new',
				time: new Date().getTime(),
				place: {country: null, city: null}
			});
			$scope.$apply();
			return $scope.canvas.points[index-1];
		},
		transfer: function(){
			var index = $scope.canvas.temp.transfers.push({
				id: 'new',
				pointFrom: {},
				pointTo: {},
				transferTypes: ['flight'],
				x: 0, y: 0
			});
			return $scope.canvas.temp.transfers[index-1];
		},
		accommodation: function(){
			var index = $scope.canvas.temp.accommodations.push({
				id: 'new',
				checkIn: new Date().getTime(),
				checkOut: new Date().getTime(),
				accommodationTypes: ["camping", "hostel", "hotel", "free_accommodation"],
				locationTypes: ["beach", "downtown", "historical", "mountain"],
				point: null,
				x: 0, y: 0
			});
			return $scope.canvas.temp.accommodations[index-1];
		},
		activity: function(){
			var index = $scope.canvas.temp.activities.push({
				id: 'new',
				point: null,
				x: 0, y: 0
			});
			return $scope.canvas.temp.activities[index-1];
		},
		note: function(){
			var index = $scope.canvas.temp.notes.push({
				id: 'new',
				point: null,
				title: '',
				text: '',
				images: [],
				x: 0, y: 0
			});
			return $scope.canvas.temp.notes[index-1];
		}
	};
	/****** OPEN POPUP *******/
	$scope.edit = {
		point: function(point){
			console.log('edit_point');
			$scope.popup.point = point;
			
			$scope.place = {time: point.time};
			if(point.city){
				$scope.place.city  = point.city;
				$scope.place.country  = point.country;
			}

			$scope.contextmenu.clear();
		},
		transfer: function(transfer){
			console.log('edit_transfer');	
			$scope.popup.transfer = transfer;
			$scope.contextmenu.clear();
		},
		accommodation: function(accommodation){
			console.log('edit_accommodation');
			$scope.popup.accommodation = accommodation;
			$scope.contextmenu.clear();
		},
		activity: function(activity){
			console.log(activity);
			$scope.popup.activity = activity;
			$scope.contextmenu.clear();
		},
		note: function(note){
			$scope.popup.note = note;
			$scope.contextmenu.clear();
		}
	};
	/****** SET ELEMENT *******/
	$scope.set = {
		point: function(place){
			console.log('set_point');
			$scope.popup.point.city = $scope.place.city;
			$scope.popup.point.country = $scope.place.country;
			$scope.popup.point.time = $scope.place.time;

			//if first point
			if($scope.canvas.points.length == 1){
				$scope.popup.point.time = new Date().getTime();
			}

			$scope.initCountries();
			$scope.initDays();
			$scope.plot();
			$scope.reConnect();

			if($scope.popup.point.id == 'new'){
				$scope.request.addPoint($scope.popup.point);
			}else{
				$scope.request.editPoint($scope.popup.point);
			}

			$scope.popup.point = null;
			$scope.place = null;
		},
		transfer: function(){
			console.log('set_transfer');
			console.log($scope.popup.transfer);
			if($scope.popup.transfer.id == 'new'){
				$scope.request.addTransfer($scope.popup.transfer);
			}else{
				$scope.request.editTransfer($scope.popup.transfer);
			}
			$scope.popup.transfer = null;
		},
		accommodation: function(){
			console.log('set_accommodation');
			if($scope.popup.accommodation.id == 'new'){
				$scope.request.addAccommodation($scope.popup.accommodation);
			}else{
				$scope.request.editAccommodation($scope.popup.accommodation);
			}
			$scope.popup.accommodation = null;
		},
		activity: function(place){
			$scope.popup.activity.place = place;
			$scope.popup.activity = null;
			$scope.place = null;
		},
		note: function(){
			$scope.popup.note = null;
		}
	};
	/****** SEARCH RESULTS *******/
	$scope.search = {
		point: function(){

		},
		transfer: function(){
			$http.get(url.transfer.get,{
				//some data
			}).success(function(data, status, headers, config){
				//response here
				$scope.popup.transfer.results = data.results;
			});
		},
		accommodation: function(){
			$http.get(url.accommodation.get,{
				//some data
			}).success(function(data, status, headers, config){
				//response here
				$scope.popup.accommodation.results = data.results;
			});
		},
		activity: function(){

		},
		note: function(){
			
		}
	};


	/****** REMOVE *******/
	$scope.remove = {
		point: function(point){
			console.log('remove_point');
			$scope.request.removePoint(point);
			var index = $scope.canvas.points.indexOf(point);
			$scope.canvas.points.splice(index, 1);
			$scope.initCountries();
			$scope.initDays();
			$scope.plot();
			$scope.reConnect();
			$scope.contextmenu.clear();
		},
		transfer: function(transfer){
			console.log('remove_transfer');
			$scope.request.removeTransfer(transfer);
			/*for(var i = 0; i < $scope.canvas.connections.length; i++){
				var point_from_id = $scope.canvas.points[$scope.canvas.connections[i].index_from].id;
				var point_to_id = $scope.canvas.points[$scope.canvas.connections[i].index_to].id;
				
				if(point_from_id == transfer.pointFrom.id && point_to_id == transfer.pointTo.id){
					var index = $scope.canvas.connections[i].transfers.indexOf(transfer);
					$scope.canvas.connections[i].transfers.splice(index, 1);
					break;
				}
			}*/
			$scope.contextmenu.clear();
		},
		accommodation: function(accommodation){
			console.log('remove_accommodation');
			$scope.request.removeAccommodation(accommodation);
			/*var index = accommodation.point.accommodations.indexOf(accommodation);
			accommodation.point.accommodations.splice(index, 1);*/
			$scope.contextmenu.clear();
		},
		activity: function(activity){
			console.log('remove_activity');
			var index = activity.point.activities.indexOf(activity);
			activity.point.activities.splice(index, 1);
			$scope.contextmenu.clear();
		},
		note: function(note){
			console.log('remove_note');
			var index = note.point.notes.indexOf(note);
			note.point.notes.splice(index, 1);
			$scope.contextmenu.clear();
		}
	};


	/****** CONTEXT MENU ********/
	$scope.context = {x: 0, y: 0};
	$scope.contextmenu = {
		clear: function(){
			$scope.context.point = null;
			$scope.context.transfer = null;
			$scope.context.accommodation = null;
			$scope.context.activity = null;
			$scope.context.note = null;
		},
		canvas: function(){
			console.log('canvas context menu');
		},
		point: function(item){
			$scope.context.point = item;
		},
		transfer: function(item){
			$scope.context.transfer = item;
		},
		accommodation: function(item){
			$scope.context.accommodation = item;
		},
		activity: function(item){
			$scope.context.activity = item;
		},
		note: function(item){
			$scope.context.note = item;
		}
	};
	$scope.open = {};
	$scope.close = {};
	/****** CLOSE POPUP *******/
	$scope.close.popup = {
		point: function(){
			if($scope.popup.point.id == 'new'){
				$scope.remove.point($scope.popup.point);
			}
			$scope.popup.point = null;
			$scope.place = null;
		},
		transfer: function(){
			if(!'time' in $scope.popup.transfer){
				$scope.remove.transfer($scope.popup.transfer);
			}
			$scope.popup.transfer = null;
		},
		accommodation: function(){
			$scope.remove.accommodation($scope.popup.accommodation);
			$scope.popup.accommodation = null;
		},
		activity: function(){
			$scope.remove.activity($scope.popup.activity);
			$scope.popup.activity = null;
		},
		note: function(){
			$scope.remove.note($scope.popup.note);
			$scope.popup.note = null;
		}
	};

	$scope.open.tooltip = {
		point: function(point,$event){
			$scope.tooltip.point = point;
		},
		transfer: function(transfer,$event){
			var element = $event.currentTarget;
			$scope.tooltip.transfer = transfer;
			$scope.tooltip.transfer.position = {x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top};
		},
		accommodation: function(accommodation,$event){
			console.log('open_tooltip_accommodation');
			var element = $event.currentTarget;
			$scope.tooltip.accommodation = accommodation;
			$scope.tooltip.accommodation.position = {x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top};
		},
		activity: function(activity,$event){
			console.log('open_tooltip_activity');
			var element = $event.currentTarget;
			$scope.tooltip.activity = activity;
			$scope.tooltip.activity.position = {x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top};
		},
		note: function(note,$event){
			console.log('open_tooltip_accommodation');
			var element = $event.currentTarget;
			$scope.tooltip.note = note;
			$scope.tooltip.note.position = {x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top};
		}
	};

	$scope.close.tooltip = {
		point: function(){
			$scope.tooltip.point = null;
		},
		transfer: function(){
			$scope.tooltip.transfer = null;
		},
		accommodation: function(){
			$scope.tooltip.accommodation = null;
		},
		activity: function(){
			$scope.tooltip.activity = null;
		},
		note: function(){
			$scope.tooltip.note = null;
		}
	};

	$scope.expandElements = function(){
		console.log('expandElements');
	};

	$scope.transferPosition = function(transfer){
		console.log(transfer);
		return {x: 200, y: 200};
	};

	$scope.timePick = {
		point: function(time){
			if(time.select){
				$scope.place.time = time.select;
				$scope.$apply();
			}
		},
		transfer: function(time){
			if(time.select){
				$scope.popup.transfer.startDate = time.select;
				$scope.$apply();
			}
		},
		accommodation : {
			in: function(time){
				if(time.select){
					$scope.popup.accommodation.checkIn = time.select;
					$scope.$apply();
				}
			},
			out: function(time){
				if(time.select){
					$scope.popup.accommodation.checkOut = time.select;
					$scope.$apply();
				}
			}
		}
	};

	//on price-slider updated
	$scope.userTotalUpdated = function(sliderObj){
		$scope.request.setPrice(sliderObj.from);
		$scope.$apply();
	};

}]);

app.directive('ngContext', function($parse) {
    return function($scope, $element, $attrs){
        var fn = $parse($attrs.ngContext);
        $element.bind('contextmenu', function(event) {
            $scope.$apply(function() {
                event.preventDefault();
                event.stopPropagation();
                $scope.contextmenu.clear();
                $scope.context.x = event.clientX;
				$scope.context.y = event.clientY;
                fn($scope, {$event:event});
            });
        });
    };
});