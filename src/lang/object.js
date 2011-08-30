Object.isFunction = function(o) {
	return typeof o === 'function' 
		|| Object.prototype.toString.call(o) === '[object Function]';
};

Object.isString = function(o) {
	return typeof o === 'string' 
		|| Object.prototype.toString.call(o) === '[object String]';
};

Object.isNumber = function(o) {
	return typeof o === 'number' 
		|| Object.prototype.toString.call(o) === '[object Number]';
};

Object.isArray = 
	((typeof Array.isArray === 'function') 
		&& Array.isArray([]) 
		&& !Array.isArray({})) 
	? Array.isArray 
	: function (object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

Object.isDate = function(o) {
	return Object.prototype.toString.call(o) === '[object Date]'; 
};

Object.isUndefined = function(o) {
	return typeof o === 'undefined'; 
};

Object.isElement = function(object) {
	return !!(object && object.nodeType === 1);
};

Object.extend = function(dest, src) {
	var p;
	for(p in src) {
		dest[p] = src[p];
	}
	return dest;
};

Object.values = function(o) {
	var p, r = [];
	for(p in o) {
		r.push(o[p]);
	}
	return r;
};

Object.typeStr = function(o) {
	if(o === null) { return 'null'; }
	if(o === true || o === false) { return 'boolean'; }
	var t = typeof o;
	switch(t)
	{
		case 'undefined':
		case 'boolean':
		case 'number':
		case 'string':
		case 'function':
			return t;
	}
	if(Object.isArray(o)) { return 'array'; }
	if(Object.isDate(o)) { return 'date'; }
	return 'object';
};

if(!Object.keys) {
	Object.keys = function(o) {
		if(Object.typeStr(o) !== 'object')
		{
			throw new TypeError();
		}
		var p, r = [];
		for(p in o)
		{
			if(o.hasOwnProperty(p))
			{
				r.push(p);
			}
		}
		return r;
	};
}

Object.clone = function(o) {
	if(o && Object.isFunction(o.clone)) {
		return o.clone();
	}
	return Object.extend({}, o);
};

if(FastJS.features.hasNativeJSON)
{
	Object.toJSON = function(o) {
		return JSON.stringify(o);
	};
	
	Object.fromJSON = function(str) {
		return JSON.parse(str);
	};
}
else
{
	//only if JSON.stringify is buggy or not supported
	Object.toJSON = (function() {
		
		var sstr = function(str, sb) {
			sb.push('"');
			sb.push(str.replace(/[\x00-\x1f"\\]/g, function(ch) {
				switch(ch)
				{
					case "\b": 
						return "\\b";
					case "\t": 
						return "\\t";
					case "\n": 
						return "\\n";
					case "\r": 
						return "\\r";
					case "\"": 
						return "\\\"";
					case "\\": 
						return "\\\\";
				}
				return '\\u00' + ch.charCodeAt().toPaddedString(2, 16);
			}));
			sb.push('"');
			return sb;
		};
		
		var jsh = function(val, sb) {
			if(val === null) { sb.push('null'); return sb; }
			if(val === true) { sb.push('true'); return sb; }
			if(val === false) { sb.push('false'); return sb; }

			var ot = Object.typeStr(val);
			
			if(ot === 'object' && typeof val.toJSON === 'function')
			{
				var r = val.toJSON(key);
				// TODO: check custom serialization validity
				sb.push(r);
				return sb;
			}

			var i,l;
			
			switch(ot)
			{
				case 'string':
					return sstr(val, sb);
					
				case 'number':
					sb.push(isFinite(val) ? String(val) : 'null');
					return sb;
				
				case 'array':
					sb.push('[');
					i=0, l=val.length;
					if(l>0) {
						while(true) {
							jsh(val[i], sb);
							if(++i >= l)
								break;
							sb.push(',');
						}
					}
					sb.push(']');
					return sb;
					
				case 'object':
					sb.push('{');
					var tv, ttv;
					var first = 1; // faster than bool, really
					for(i in val) {
						tv = val[i];
						ttv = typeof tv;
						if(ttv === 'function' || ttv === 'undefined')
							continue;
						if(first === 1) {
							first = 0;
						} else {
							sb.push(',');
						}
						sstr(i, sb);
						sb.push(':');
						jsh(tv, sb);
					}
					sb.push('}');
					return sb;
				
				case 'date':
					sb.push('"');
					sb.push(val.toISOString());
					sb.push('"');
					return sb;
					
				case 'undefined':
				case 'function':
					sb.push('null');
					return sb;
			}
		};
		
		return function(val) {
			return jsh(val, []).join('');
		};
	})();
	
	Object.fromJSON = function(str) {
		return JSON.parse(str);
	};
}

