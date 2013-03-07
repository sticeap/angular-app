'use strict';

/* App Module */

var app = angular.module('app', ['appFilters', 'appServices', 'appDirectives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when('/phones', {
		templateUrl: 'views/phone-list.html',   
		controller: 'PhoneListCtrl'
	}).
	when('/phones/:phoneId', {
		templateUrl: 'views/phone-detail.html',
		controller : 'PhoneDetailCtrl'
	}).
	when('/home', {
		templateUrl: 'views/home.html',
		controller : 'HomeCtrl'
	}).
	when('/about', {
		templateUrl: 'views/about.html',
		controller : 'HomeCtrl'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);
