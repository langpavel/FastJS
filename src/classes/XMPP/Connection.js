(function(FJS, XMPP) {
	
	var Con = function() {
		this.xhr = new FJS.XHR();
	};
	
	Con.prototype.bosh = '/http-bind';

	XMPP.Connection = Con;
})(getFastJS(), getFastJS('XMPP'));
