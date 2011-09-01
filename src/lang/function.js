(function(af){
	if(typeof Function.prototype.bind === 'undefined')
	{
		af['Function.prototype.bind'] = true; 
		// refactored code from PrototypeJS
		// TODO: this need heavy testing; 
		Function.prototype.bind = function bind(c)
		{
			var m = this, ag = Array.prototype.slice.call(arguments, 1);
	
			function update(array, args) {
				var l1 = array.length, l2 = args.length;
				while(l2--)
					array[l1 + l2] = args[l2];
				return array;
			}
	
			function merge(array, args)	{
				array = Array.prototype.slice.call(array, 0);
				return update(array, args);
			}
			
			return function() {
				var a = merge(ag, arguments);
				return m.apply(c, a);
			};
		};
	}
	
	if (typeof Function.prototype.apply === 'undefined') {
		af['Function.prototype.apply'] = true;
		Function.prototype.apply = function(o, a) {
			if(!a) a = [];
			o.__applied_func = this;
			o.__applied_func(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
			delete o.__applied_func;
		};
	}
})(getFastJS('features','artificials'));
