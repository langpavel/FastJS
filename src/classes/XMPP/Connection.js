(function(FJS, XML, XMPP, l10n) {

	var Con = function() {
		this.state = 0;
		this.sid = null;
		this.xhr = null;
		this.rid = Math.ceil(Math.random() * 2147483647);
	};

	Con.prototype.bosh = '/http-bind';
	Con.prototype.bosh_ver = '1.0';
	Con.prototype.jid = null;
	Con.prototype.domain = 'localhost';
	Con.prototype.lang = 'en';
	Con.prototype.hold = 1;
	Con.prototype.wait = 60;
	Con.prototype.route = 'xmpp:localhost:5222';
	
	Con.prototype.toString = function() {
		var sb = [];
		sb.push('[XMPP BOSH Connection to [', this.bosh, '], state ', 
			this.state, ']');
		return sb.join('');
	};

	Con.prototype.createRequest = function() {
		this.xhr = FJS.XHR.createNativeXHR();
		this.xhr.open('POST', this.bosh, true);
		this.xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
		this.xhr.onreadystatechange = this._xhrRSchange.bind(this, this.xhr);
		return this.xhr;
	};
	
	Con.prototype.createXmlDoc = function() {
		return XML.createNativeDoc('http://jabber.org/protocol/httpbind', 'body', null);
	};
	
	Con.prototype.createBodyWrapper = function() {
		var xdoc = XML.createNativeDoc('http://jabber.org/protocol/httpbind', 'body', null);
		var body = xdoc.documentElement;
		body.setAttribute('content', 'text/xml; charset=utf-8');
		if(this.jid !== null) 
			body.setAttribute('from', this.jid);
		body.setAttribute('hold', this.hold);
		body.setAttribute('rid', this.rid);
		body.setAttribute('to', this.domain);
		body.setAttribute('secure', 'true');
		body.setAttribute('wait', this.wait);
		if(this.sid !== null)
			body.setAttribute('sid', this.sid);
		body.setAttribute('xml:lang', this.lang);
		body.setAttribute('xmpp:version', this.bosh_ver);
		body.setAttribute('xmlns', 'http://jabber.org/protocol/httpbind');
		body.setAttribute('xmlns:xmpp', 'urn:xmpp:xbosh');
		return xdoc;
	};

	Con.prototype._xhrRSchange = function(xhr) {
		if(xhr.readyState == 4 && xhr.status == 200) 
			alert('OK!');
		console.debug('Con.prototype._xhrRSchange: ', this, xhr);
	};
	
	Con.prototype.connect = function()
	{
		this.state = 0;

		this.wait = wait || this.wait;
		this.hold = hold || this.hold;

		// parse jid for domain and resource
		this.domain = Strophe.getDomainFromJid(this.jid) || this.domain;

		// build the body tag
		var body = this._buildBody().attrs({
			to: this.domain,
			"xml:lang": "en",
			wait: this.wait,
			hold: this.hold,
			content: "text/xml; charset=utf-8",
			ver: "1.6",
			"xmpp:version": "1.0",
			"xmlns:xmpp": Strophe.NS.BOSH
		});

		this._changeConnectStatus(Strophe.Status.CONNECTING, null);

		this._requests.push(new Strophe.Request(body.tree(),
				this._onRequestStateChange.bind(this, this._connect_cb
						.bind(this)), body.tree().getAttribute("rid")));
		this._throttledRequestHandler();
	};
	
	XMPP.Connection = Con;

})(getFastJS(), getFastJS('XML'), getFastJS('XMPP'), getFastJS('l10n'));
