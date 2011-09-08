(function(XMPP) {

	XMPP.NS = {
		HTTPBIND: "http://jabber.org/protocol/httpbind",
		XBOSH: "urn:xmpp:xbosh",
		CLIENT: "jabber:client",
	//	SERVER: "jabber:server",
		AUTH: "jabber:iq:auth",
		ROSTER: "jabber:iq:roster",
		PROFILE: "jabber:iq:profile",
		DISCO_INFO: "http://jabber.org/protocol/disco#info",
		DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
		MUC: "http://jabber.org/protocol/muc",
		SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
		STREAM: "http://etherx.jabber.org/streams",
		BIND: "urn:ietf:params:xml:ns:xmpp-bind",
		SESSION: "urn:ietf:params:xml:ns:xmpp-session",
		VERSION: "jabber:iq:version",
		STANZAS: "urn:ietf:params:xml:ns:xmpp-stanzas",
		add: function(name, uri) {
			this[name] = uri;
		}
	};

})(getFastJS('XMPP'));
