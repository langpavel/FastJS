"use strict";

/**
 * Global namespace
 */
var FastJS = {};

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

