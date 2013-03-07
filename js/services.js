'use strict';

/* Services */

angular.module('appServices', ['ngResource'])
    .factory('Phone', function($resource){
		return $resource('phones/:phoneId.json', {}, {
			query: {
				method:'GET', 
				params:{
					phoneId:'phones'
				}, 
				isArray:true
			}
		});
	})
    .factory('config', function($resource){
		return {
			ip : '192.168.1.103',
			port : '4444'
		};
	})
    .factory('socket', function($window, config){
    	var socket = "",
    		eventHandlers = {},
    		api;

		socket = new $window.WebSocket('ws://'+config.ip+':'+config.port);

		socket.onopen = function(){
			console.log('open');
		}
		socket.onclose = function() {
			console.log('close');
		}
		socket.onerror = function() {
			console.log('error');
		}
		socket.onmessage = function(e) {
			var data = JSON.parse(e.data);
			if(eventHandlers[data.type]){
				angular.forEach(eventHandlers[data.type], function(el){
					el(data);
				});
			}
		}

    	api = {
			send : function(data){
					return socket.send(JSON.stringify(data));
			},
			on : function(type, callback){
				if(!eventHandlers[type])
					eventHandlers[type] = [];

				eventHandlers[type].push(callback);
				return this;
			},
			off : function(type, callback){
				if(arguments.length == 1)
					eventHandlers[type] = [];

				else if(eventHandlers[type] && eventHandlers[type].indexOf(callback) != -1)
					eventHandlers[type].splice(eventHandlers[type].indexOf(callback), 1);

				return this;
			}
    	};

    	return api;
	});
