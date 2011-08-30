/**
 * Global namespace
 */
var FastJS = {};

/**
 * FastJS features namespace
 */
FastJS.features = {};

/**
 * Empty function
 */
FastJS.E = function() { /* void */ };

/**
 * True function
 */
FastJS.T = function() { return true; };

/**
 * False function
 */
FastJS.F = function() { return false; };

/**
 * Identity function - transparent function
 */
FastJS.K = function(x) { return x; };

FastJS.features.hasNativeJSON = (typeof JSON !== 'undefined'
	&& typeof JSON.stringify === 'function'
	&& JSON.stringify(0) === '0'
	&& typeof JSON.stringify(FastJS.K) === 'undefined');
