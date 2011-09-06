(function(GLOBAL, Enc, af) {

	af['FastJS.Encoding.strToB64'] = true;
	af['FastJS.Encoding.b64ToStr'] = true;
	Enc.strToB64 = function(x) { return GLOBAL.btoa(x); };
	Enc.b64ToStr = function(x) { return GLOBAL.atob(x); };

})(getFastJS('GLOBAL'), getFastJS('Encoding'), getFastJS('features', 'artificials'));
