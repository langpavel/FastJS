// include after Connection.js!
(function(XMPP) {

	XMPP.Connection.status = {
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

})(getFastJS('XMPP'));
