'use strict';

/* Filters */

angular.module('appFilters', [])
	.filter('checkmark', function() {
	//app.filter('checkmark', function() {
		return function(input) {
			return input ? '\u2713' : '\u2718';
		};
	});
