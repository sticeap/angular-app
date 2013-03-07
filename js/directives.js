'use strict';

/* Directives */

angular.module('appDirectives', [])
	.directive('autoComplete', function($timeout) {
	    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: function(request, response){
                	var contacts = scope.contacts, //scope[iAttrs.uiItems];
                		result = [];
                    if(contacts){
                    	for(var i=0; i<contacts.length; i++){
                    		if(contacts[i].name.toLowerCase().indexOf(request.term.toLowerCase()) > -1){
                    			contacts[i].label = contacts[i].name;
                    			result.push(contacts[i]);
                    		}
                    	}
                    }
                    
                    response(result);
                },
                select: function(event, ui) {
                	console.log(ui.item);
                	console.log(iElement);
                }
            });
	    };
	});