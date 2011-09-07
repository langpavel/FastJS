(function(Hash) {

	/**
	 * Circular rotate left 
	 */
	Hash.crl = function(n, s) { 
		return (n << s) | (n >>> (32 - s));	
	};

	
})(getFastJS('Hash'));
