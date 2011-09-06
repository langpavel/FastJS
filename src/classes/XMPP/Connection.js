(function(FJS, XML, XMPP, l10n) {

	var Con = function() {
		this.xhr = new FJS.XHR();
		this.xdoc = null;
		this.state = 0;
	};

	Con.prototype.bosh = '/http-bind';
	Con.prototype.domain = 'localhost';
	
	Con.prototype.toString = function() {
		var sb = [];
		sb.push('[XMPP BOSH Connection to [');
		sb.push(this.bosh);
		sb.push('], state ');
		sb.push(this.state);
		sb.push(']');
		return sb.join('');
	};

	// enum
	Con.status = {
		ERROR: 0,
		CONNECTING: 1,
		CONNFAIL: 2,
		AUTHENTICATING: 3,
		AUTHFAIL: 4,
		CONNECTED: 5,
		DISCONNECTED: 6,
		DISCONNECTING: 7,
		ATTACHED: 8
	};

	Con.prototype.createXmlDoc = function() {
		this.xdoc = XML.createNativeDoc('http://jabber.org/protocol/httpbind', 'body', null);
	};

	XMPP.Connection = Con;

})(getFastJS(), getFastJS('XML'), getFastJS('XMPP'), getFastJS('l10n'));
