"use strict";

if(typeof getFastJS === 'undefined') {
	var getFastJS = (function(){
		var FastJS = {
			getNS: function(namespace) {
				var np = arguments;
				if(arguments.length === 1)
				{
					np = (Object.prototype.toString.call(namespace) === '[object String]')
						? namespace.split('.')
						: namespace;
				}
				var ns = this, nn, i = 0;
				for(i=0, nn=np[0]; typeof (nn=np[i]) !== 'undefined'; i++)
				{
					if(typeof ns[nn] === 'undefined')
						ns[nn] = {};
					ns = ns[nn];
				}
				return ns;
			},

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
			return FastJS.getNS(arguments);
		};
	})();
}
