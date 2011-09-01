(function(af){
	// borrowed from Prototype
	if(typeof String.isJSON === 'undefined') {
		af['Object.isJSON'] = true;
		String.isJSON = function(str)
		{
			if(typeof str !== 'string')
				return false;
			if(str.blank())
				return false;
			str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
			str = str.replace(
					/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
					']');
			str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
			return (/^[\],:{}\s]*$/).test(str);
		};
	}
})(getFastJS('features','artificials'));
