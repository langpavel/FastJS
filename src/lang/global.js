(function(GLOBAL, af) {
	
	var b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	if(typeof GLOBAL.btoa === 'undefined') {
		af['btoa'] = true;
		GLOBAL.btoa = function(data) {
			if(typeof data !== 'string') data = data.toString();
			var o1, o2, o3, h1, h2, h3, h4, b, i=0, a=[];
			var l = data.length;
			while(i<l) {
				o1 = data.charCodeAt(i++);
				o2 = data.charCodeAt(i++);
				o3 = data.charCodeAt(i++);
				b = o1 << 16 | o2 << 8 | o3;
				h1 = b >> 18 & 0x3f;
				h2 = b >> 12 & 0x3f;
				h3 = b >> 6 & 0x3f;
				h4 = b & 0x3f;
				a.push(b64c.charAt(h1), b64c.charAt(h2), 
					b64c.charAt(h3), b64c.charAt(h4));
			}
			i=a.length;
			switch(l % 3)
			{
				case 1:	
					a[i-2] = '=';
					// fall throw down
				case 2:
					a[i-1] = '=';
			}
			return a.join('');
		};
	}

	if(typeof GLOBAL.atob === 'undefined') {
		af['atob'] = true;
		GLOBAL.atob = function(data) {
			if(typeof data !== 'string') data = data.toString();

			var o1, o2, o3, h1, h2, h3, h4, b, i = 0, a = [];
			var l = data.length;
			while (i<l) {
				h1 = b64c.indexOf(data.charAt(i++));
				h2 = b64c.indexOf(data.charAt(i++));
				h3 = b64c.indexOf(data.charAt(i++));
				h4 = b64c.indexOf(data.charAt(i++));
				b = h1 << 18 | h2 << 12 | h3 << 6 | h4;
				o1 = b >> 16 & 0xff;
				o2 = b >> 8 & 0xff;
				o3 = b & 0xff;
				if (h3 === 64) {
					a.push(String.fromCharCode(o1));
				} else if (h4 === 64) {
					a.push(String.fromCharCode(o1, o2));
				} else {
					a.push(String.fromCharCode(o1, o2, o3));
				}
			}

			return a.join('');
		};
	}
	
})(getFastJS('GLOBAL'), getFastJS('features', 'artificials'));
