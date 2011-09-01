if(typeof Array.prototype.indexOf === 'undefined')
{
	FastJS.features.artificials['Array.prototype.indexOf'] = true;
	/*
	 * i - item
	 * o - offset, if less than zero, start search from end
	 */
	Array.prototype.indexOf = function indexOf(i, o) {
		o = (Object.isNumber(o)) ? o : 0;
		var l = this.length;
		if(o < 0) o = l + o;
		if(o < 0) o = 0;
		while(o < l) {
			if(this[o] === i)
				return o;
			o++;
		}
		return -1;
	};
}

if(typeof Array.isArray === 'undefined')
{
	FastJS.features.artificials['Array.isArray'] = true;
	Array.prototype.isArray = function() {
		return Object.prototype.toString.call(this) === '[object Array]';
	};
}
