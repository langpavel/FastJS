(function(GLOBAL, Enc, af) {

	var hd = '0123456789abcdef';
	
	Enc.strToHex = function(data) {
		var i, l = data.length;
		var a = [];
		var h;
		for(i=0; i<l; i++) {
			 h = data.charCodeAt(i);
			 if(h > 255) throw new Error('Invalid character at position '+i);
			 a.push(hd.charAt((h >>> 4) & 15));
			 a.push(hd.charAt(h & 15));
		}
		return a.join('');
	};
	
	Enc.byteArrayToHex = function(data) {
		var i, l = data.length;
		var a = [];
		var h;
		for(i=0; i<l; i++) {
			 h = data[i];
			 if(typeof h !== 'number' || h > 255 || h < 0) 
				 throw new Error('Invalid value at position '+i);
			 a.push(hd.charAt((h >>> 4) & 15));
			 a.push(hd.charAt(h & 15));
		}
		return a.join('');
	};
	
})(getFastJS('GLOBAL'), getFastJS('Encoding'), getFastJS('features', 'artificials'));
