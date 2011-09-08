(function(FJS, XML, XMPP, l10n) {

	var Con = function() {
		this.state = 0;
		this.sid = null;
		this.xhr = null;
		this.props = new XMPP.ConnProps();
	};

	Con.prototype.toString = function() {
		var sb = [];
		sb.push('[XMPP BOSH Connection to [', this.props.bosh, '], state ', 
			this.state, ']');
		return sb.join('');
	};

	Con.prototype.createXHR = function() {
		this.xhr = FJS.XHR.createNativeXHR();
		this.xhr.open('POST', this.props.bosh, true);
		this.xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
		this.xhr.onreadystatechange = this._xhrRSchange.bind(this, this.xhr);
		return this.xhr;
	};
	
	Con.prototype.createXmlDoc = function() {
		return XML.createNativeDoc('http://jabber.org/protocol/httpbind', 'body', null);
	};
	
	Con.prototype.createRequestBody = function(attrs) {
		var xdoc = XML.createNativeDoc(XMPP.NS.HTTPBIND, 'body', null);
		var body = xdoc.documentElement;
		XML.setAttrs(body, {
			'content': 'text/xml; charset=utf-8',
			'rid': this.props.getRid(),
			'to': this.props.domain,
			'secure': 'true',
			'wait': this.props.wait,
			'hold': this.props.hold,
			'xml:lang': this.props.lang,
			'xmpp:version': this.props.bosh_ver,
			'xmlns': XMPP.NS.HTTPBIND,
			'xmlns:xmpp': XMPP.NS.XBOSH
		});
		if(this.jid !== null) 
			body.setAttribute('from', this.jid);
		if(this.sid !== null)
			body.setAttribute('sid', this.sid);
		if(typeof attrs === 'object')
			XML.setAttrs(body, attrs);
		return xdoc;
	};

	Con.prototype._xhrRSchange = function(xhr) {
		switch(xhr.readyState) {
			//case 0: break; // UNSET
			//case 1: break; // OPENED
			//case 2: break; // HEADERS_RECEIVED
			//case 3: // LOADING
			case 4: // DONE
				if(xhr.status == 200)
					this.documentReceived(xhr.responseXML);
				else
					this.xhrerror(xhr);
			break;
		}
	};
	
	Con.prototype.documentReceived = function(xdoc) {
		console.debug("received ", xdoc);
	};
	
	Con.prototype.xhrerror = function(xhr) {
		console.debug("XHR error ", xhr);
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
