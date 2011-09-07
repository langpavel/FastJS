(function(Enc) {

	Enc.utf8toByteArray = function(str) {
		str = str.replace(/\r\n/g, "\n");
		var result = [];

		for( var n = 0; n < str.length; n++)
		{
			var c = str.charCodeAt(n);

			if(c < 128)
			{
				result.push(c);
			} else if((c > 127) && (c < 2048))
			{
				result.push((c >> 6) | 192, (c & 63) | 128);
			} else
			{
				result.push((c >> 12) | 224, ((c >> 6) & 63) | 128,
					(c & 63) | 128);
			}
		}
		return result;
	};

})(getFastJS('Encoding'));
