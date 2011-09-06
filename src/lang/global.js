(function(context, af) {
	
	var b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	if(typeof context.btoa === 'undefined') {
		af['btoa'] = true;
		context.btoa = function(data) {
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
				a.push(b64c.charAt(h1));
				a.push(b64c.charAt(h2));
				a.push(b64c.charAt(h3));
				a.push(b64c.charAt(h4));
			}
			switch(l % 3)
			{
				case 1:	
					a[l-2] = '=';
					// fall throw down
				case 2:
					a[l-1] = '=';
			}
			return a.join('');
		};
	}

	if(typeof context.atob === 'undefined') {
		af['atob'] = true;
	}
	
})(this /* window */, getFastJS('features', 'artificials'));
