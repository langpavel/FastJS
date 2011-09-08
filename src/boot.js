"use strict";

if(typeof FastJS === 'undefined')
	FastJS = {};

if(typeof getFastJS === 'undefined') {
	var getFastJS = (function(){
		var FJS = FastJS;
		FJS.E = function() { /* void */ };
		FJS.T = function() { return true; };
		FJS.F = function() { return false; };
		FJS.K = function(x) { return x; };
		
		return function() {
			if(arguments.length === 0)
				return FJS;
			var nn, i;
			var l=arguments.length;
			var ns = FJS;
			for(i=0; i<l; i++)
			{
				nn = arguments[i];
				ns = (typeof ns[nn] === 'undefined')
					? (ns[nn] = {})
					: ns[nn];
			}
			return ns;
		};
	})();
}

getFastJS()['GLOBAL'] = this;
