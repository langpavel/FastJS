(function(FJS, XML, XMPP, Enc) {

	var readattrs = function(target, source, names) {
		var i, atrname, valname, l=names.length;
		for(i=0; i<l; i++) {
			atrname = valname = names[i];
			if(typeof atrname !== 'string') {
				valname = atrname[0];
				atrname = atrname[1];
			}
			if(source.hasAttribute(atrname)) {
				target[valname] = source.getAttribute(atrname);
			} else if (typeof target[valname] === 'undefined') {
				target[valname] = null;
			} 
		}
	};
	
	var Login = function(con, pass, okcallback, failcallback) {
		this.con = con;
		this.pass = pass;
		this.okcallback = okcallback;
		this.failcallback = failcallback;
		this.login();
	};

	Login.prototype.login = function() {
		var p = this.con.props;
		var d = this.con.createRequestBody({
			'content': 'text/xml; charset=utf-8',
			'from': p.jid,
			'to': p.domain,
			'secure': 'true',
			'wait': p.wait,
			'hold': p.hold,
			'xml:lang': p.lang,
			'xmpp:version': p.bosh_ver,
			'xmlns:xmpp': XMPP.NS.XBOSH
		});
		this.con.sendXDoc(d, this._l1.bind(this), this.failcallback);
	};
	
	Login.prototype._l1 = function(body, xhr) {
		var p = this.con.props;
		readattrs(p, body, ['sid', 'wait', 'requests', 'inactivity',
			'maxpause', ['httpbind_ver', 'ver'], 'authid']);
		
		this._plain(body, xhr);
		
		return true;
	};

	Login.prototype._plain = function(body, xhr) {
		var p = this.con.props;
		
		var passwd = this.pass;
		if(typeof passwd === 'function')
			passwd = passwd();
		
		var authstr = Enc.strToB64([p.jid, p.user, passwd].join("\0"));
		
		var d = this.con.createRequestBody();
		
		var auth = XML.createElement(d, 'auth', {
			'xmlns': XMPP.NS.SASL,
			'mechanism':'PLAIN'
			}, authstr);
		d.documentElement.appendChild(auth);
		
		this.con.sendXDoc(d, this._plain_response.bind(this), this.failcallback);
		return true;
	};
	
	Login.prototype._restart = function(body, xhr) {
		var p = this.con.props;
		
		var d = this.con.createRequestBody({
			'to': p.domain,
			'xml:lang': p.lang,
			'xmpp:restart': 'true',
			'xmlns:xmpp': XMPP.NS.XBOSH,
		});
		
		this.con.sendXDoc(d, this._restart_done.bind(this), this.failcallback);
		return true;
	};

	Login.prototype._restart_done = function(body, xhr) {
		console.debug('restart done', body);
		return true;
	};
	
	Login.prototype._plain_response = function(body, xhr) {
		var e = body.firstChild;
		if(e.nodeName === 'success')
			this._restart(body, xhr);
		else
			this.failcallback(xhr, e.nodeName);
		return true;
	};
	
	XMPP.Connection.Login = Login;
	
})(getFastJS(), getFastJS('XML'), getFastJS('XMPP'), getFastJS('Encoding'));
