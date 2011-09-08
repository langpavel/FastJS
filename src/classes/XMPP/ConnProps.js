(function(XMPP) {

	var Props = function() { 
		this.newRid();
	};

	Props.prototype.bosh = '/http-bind';
	Props.prototype.bosh_ver = '1.0';
	Props.prototype.jid = null;
	Props.prototype.domain = 'localhost';
	Props.prototype.lang = 'en';
	Props.prototype.hold = 1;
	Props.prototype.wait = 60;
	Props.prototype.route = 'xmpp:localhost:5222';
	Props.prototype.sid = null;
	
	Props.prototype.newRid = function() {
		this.rid = Math.ceil(Math.random() * 1073741824); 
	};

	Props.prototype.getRid = function() {
		return this.rid++; 
	};

	XMPP.ConnProps = Props;
	
})(getFastJS('XMPP'));
