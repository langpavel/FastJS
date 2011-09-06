"use strict";

if(typeof getFastJS === 'undefined') {
	var getFastJS = (function(){
		var FastJS = {
			/**
			 * Empty function
			 */
			E: function() { /* void */ },

			/**
			 * True function
			 */
			T: function() { return true; },

			/**
			 * False function
			 */
			F: function() { return false; },

			/**
			 * Identity function - transparent function
			 */
			K: function(x) { return x; }
		};
		
		return function() {
			if(arguments.length === 0)
				return FastJS;
			var nn, i;
			var l=arguments.length;
			var ns = FastJS;
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
