(function(l10n){

	if(typeof l10n.translate === 'undefined') {
		// this is blind function
		l10n.translate = function(text) {
			if(arguments.length === 1)
				return text.toString();
			// TODO: return via formatter
		};
	}
	
})(getFastJS('l10n'));
