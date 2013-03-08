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
		.on('sendSms', function(response){
			alert(response.response);
			console.log(response);
		})
		.on('smsStatus', function(response){
			var status = JSON.parse(response.response);
			console.log(status);
		})
		.on('smsDelivery', function(response){
			var delivery = JSON.parse(response.response);
			console.log(delivery);
		});

	$scope.socketState = 0;

	$scope.socket = {
		getContacts : function(){
			var data = {
				type : 'getContacts',
				callback : function(){
					
				},
				message : "getContacts"
			}
			socket.send(data);
		},
		sendSms : function(){
			var data = {
				type : 'sendSms',
				callback : function(){
					console.log("now run callback sms");
				},
				message : "sendSms",
				data : JSON.stringify({number:'0749785884', id : '123675217635762', message : $scope.textSms })
			}
			socket.send(data);
		},
		checkState : function(){
			$scope.socketState = socket.readyState;

			$timeout(function(){
				$scope.socket.checkState();
			},1000, true);
		},
		contacts : function(){
			$scope.contacts = socket.contacts();
		},
		text : "getContacts"
	};

	$scope.socket.checkState();
	$scope.selectedContact = {};
	$scope.textSms = "";
	//$scope.socket.getContacts();

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
