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
 * Transparent function
 */
FastJS.K = function(x) { return x; };

FastJS.features.hasNativeJSON = (typeof JSON !== 'undefined'
	&& typeof JSON.stringify === 'function'
	&& JSON.stringify(0) === '0'
	&& typeof JSON.stringify(FastJS.K) === 'undefined');
