(function(af){
	if(typeof Date.prototype.toISOString === 'undefined') {
		af['Date.prototype.toISOString'] = true;
		Date.prototype.toISOString = function() {
			return this.getUTCFullYear() + '-'
				+ (this.getUTCMonth() + 1).toPaddedString(2) + '-'
				+ this.getUTCDate().toPaddedString(2) + 'T'
				+ this.getUTCHours().toPaddedString(2) + ':'
				+ this.getUTCMinutes().toPaddedString(2) + ':'
				+ this.getUTCSeconds().toPaddedString(2) + 'Z';
		};
	}
})(getFastJS('features','artificials'));
