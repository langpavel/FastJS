if(typeof Function.prototype.bind === 'undefined')
{
	// refactored code from PrototypeJS
	// TODO: this need heavy testing; 
	Function.prototype.bind = function bind(c)
	{
		var m = this, ag = Array.prototype.slice.call(arguments, 1);

		function update(array, args)
		{
			var l1 = array.length, l2 = args.length;
			while(l2--)
				array[l1 + l2] = args[l2];
			return array;
		}

		function merge(array, args)
		{
			array = Array.prototype.slice.call(array, 0);
			return update(array, args);
		}
		
		return function()
		{
			var a = merge(ag, arguments);
			return m.apply(c, a);
		};
	};
}
