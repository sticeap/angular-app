'use strict';

/* Controllers */

app.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone) {
	$scope.phones = Phone.query();
	$scope.orderProp = 'age';
}]);


app.controller('HomeCtrl', ['$scope', '$window', '$timeout', function($scope, $window, $timeout) {

	$scope.getTime = function(){
		var d = new Date();
		return d.getDate() + "/" + ( d.getMonth() + 1 ) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	}

	$scope.notifiedTime = $scope.getTime();

	$timeout(function(){ $scope.notify(); },5000);

	$scope.notify = function(){
		var havePermission = $window.webkitNotifications.checkPermission();
		$scope.notifiedTime = $scope.getTime();
		//$scope.$apply();
		if (havePermission == 0) {
			// 0 is PERMISSION_ALLOWED
			var notification = $window.webkitNotifications.createNotification(
				'img/mail-icon.png',
				'Chrome notification!',
				"Here is the notification text \n\r sdfsadf s \n sdfsfsdfsd");

			notification.onclick = function (){
				//$window.open("http://stackoverflow.com/a/13328397/1269037");
				//console.log($scope.getTime());
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
