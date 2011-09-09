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

	Con.prototype.createXmlDoc = function() {
		return XML.createNativeDoc('http://jabber.org/protocol/httpbind', 'body', null);
	};
	
	Con.prototype.createRequestBody = function(attrs) {
		var xdoc = XML.createNativeDoc(XMPP.NS.HTTPBIND, 'body', null);
		var body = xdoc.documentElement;
		XML.setAttrs(body, {
			'rid': this.props.getRid(),
			'sid': this.props.sid,
			'xmlns': XMPP.NS.HTTPBIND,
		});
		if(typeof attrs === 'object')
			XML.setAttrs(body, attrs);
		return xdoc;
	};

	Con.prototype.sendXDoc = function(xdoc, okcallback, failcallback, stateCallback) {
		var xhr = FJS.XHR.createNativeXHR();
		xhr.onreadystatechange = this._xhrRSchange.bind(this, 
				xhr, okcallback, failcallback, stateCallback);
		xhr.open('POST', this.props.bosh, true);
		xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
		xhr.send(xdoc);
		console.debug("send ", xdoc);
		return xhr;
	};
	
	Con.prototype._xhrRSchange = function(xhr, okcallback, failcallback, stateCallback) {
		if(typeof stateCallback === 'function')
			if(stateCallback(xhr.readyState, xhr) === true)
				return;
		
		switch(xhr.readyState) {
			//case 0: break; // UNSET
			//case 1: break; // OPENED
			//case 2: break; // HEADERS_RECEIVED
			//case 3: // LOADING
			case 4: // DONE
				if(xhr.status == 200) {
					if(typeof okcallback === 'function') {
						if(okcallback(xhr.responseXML.documentElement, xhr) === true)
							return;
						this.documentReceived(xhr.responseXML);
					}
				} else {
					if(typeof failcallback === 'function')
						if(failcallback(xhr) === true)
							return;
					this.xhrerror(xhr);
				}
			break;
		}
	};
	
	Con.prototype.documentReceived = function(xdoc) {
		console.debug("received ", xdoc);
	};
	
	Con.prototype.login = function(pass, okcallback, failcallback) {
		return new Con.Login(this, pass, okcallback, failcallback);
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
