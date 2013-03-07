'use strict';

/* Controllers */

app.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone) {
	$scope.phones = Phone.query();
	$scope.orderProp = 'age';

	var $ = angular.element;

	$scope.templates = [ 
		{ name: 'header.html', url: 'views/header.html' }, 
		{ name: 'footer.html', url: 'views/footer.html' }, 
		{ name: 'sliderHome.html', url: 'views/sliderHome.html' }
	];

	$scope.header = $scope.templates[0];
	$scope.footer = $scope.templates[1];
	$scope.sliderHome = "";
}]);


app.controller('HomeCtrl', ['$scope', '$window', '$timeout', 'socket', function($scope, $window, $timeout, socket) {

	socket
		.on('getContacts', function(response){
			console.log(response);
			$scope.contacts = JSON.parse(response.response)
		})
		.on('receiveSms', function(response){
			console.log(response);
		})

	$scope.socket = {
		getContacts : function(){
			//socket.send(this.text);
			var data = {
				type : 'getContacts',
				callback : function(){
					console.log("now run callback");
				},
				message : "getContacts"
			}
			socket.send(data);
		},
		contacts : function(){
			$scope.contacts = socket.contacts();
		},
		text : "getContacts"
	};

	var $ = angular.element;

	$scope.templates = [ 
		{ name: 'header.html', url: 'views/header.html' }, 
		{ name: 'footer.html', url: 'views/footer.html' }, 
		{ name: 'sliderHome.html', url: 'views/sliderHome.html' }
	];

	$scope.header = $scope.templates[0];
	$scope.footer = $scope.templates[1];
	$scope.sliderHome = $scope.templates[2];

	$scope.initSlider = function(){
		/*$('.flexslider').flexslider({
			slideshow: false
		});*/
	}

	//$scope.contacts =  [];


	$scope.getTime = function(){
		var d = new Date();
		return d.getDate() + "/" + ( d.getMonth() + 1 ) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	}

	$scope.notifiedTime = $scope.getTime();

	//$timeout(function(){ $scope.notify(); },5000);

	$scope.notify = function(){
		var havePermission = $window.webkitNotifications.checkPermission();
		$scope.notifiedTime = $scope.getTime();

		if (havePermission == 0) {
			// 0 is PERMISSION_ALLOWED
			var notification = $window.webkitNotifications.createNotification(
				'img/mail-icon.png',
				'New SMS!',
				"Here is the notification text \n\r sdfsadf s \n sdfsfsdfsd");

			notification.onclick = function (){
				//$scope.notifiedTime = $scope.getTime();
				notification.close();
			}
			notification.show();

			$timeout(function(){
				notification.close();
			}, 5000);
		}else{
			$window.webkitNotifications.requestPermission();
		}
	}
}]);


app.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
	$scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
		console.log(phone.images);
		$scope.mainImageUrl = phone.images[0];
	});

	$scope.setImage = function(imageUrl) {
		$scope.mainImageUrl = imageUrl;
	}
}]);
