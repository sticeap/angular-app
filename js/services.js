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
			port : '4444',
			retryAfter : 2000, // time in miliseconds for retry connect socket if is disconnected by the server
			retryCount : 10 //retry connect of "n" time default -1 (infinite retry)
		};
	})
    .factory('socket', function($window, config, $timeout){
    	var socket = "",
    		eventHandlers = {},
    		api,
    		persist = true,
    		count = 0,
			initSocket = function(){
				if(socket.readyState == 1)
					socket.close();

				socket = new $window.WebSocket('ws://'+config.ip+':'+config.port);

				socket.onopen = function(){
					count = 0;
					api.readyState = socket.readyState;
					console.log('OPEN: ' + new Date().toString().split(" GMT")[0]);
				}
				socket.onclose = function() {
					if(persist == true && (count < config.retryCount || config.retryCount == -1)){
						$timeout(function(){
							count++;
							initSocket();
						}, config.retryAfter);
						//console.log('CLOSE by server: ' + new Date().toString().split(" GMT")[0]);
						api.readyState = socket.readyState;
					}else{
						console.log('CLOSE: ' + new Date().toString().split(" GMT")[0]);
						api.readyState = socket.readyState;
					}
				}
				socket.onerror = function() {
					console.error('ERROR : ' + new Date().toString().split(" GMT")[0]);
					api.readyState = socket.readyState;
				}
				socket.onmessage = function(e) {
					api.readyState = socket.readyState;
					var data = JSON.parse(e.data);
					if(eventHandlers[data.type]){
						angular.forEach(eventHandlers[data.type], function(el){
							el(data);
						});
					}
				}
			};

		initSocket();		

    	api = {
			send : function(data){
				return socket.send(JSON.stringify(data));
			},
			readyState : socket.readyState,
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
