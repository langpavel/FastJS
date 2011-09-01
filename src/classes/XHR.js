/*
 * XMLHttpRequest.js Copyright (C) 2010 Sergey Ilinsky (http://www.ilinsky.com)
 * 
 * Modified by Pavel Lang 2011
 * 
 * Original file from subversion repository at 
 * http://xmlhttprequest.googlecode.com/svn/
 * trunk/source/XMLHttpRequest.js 
 * @ revision 45
 * 
 * This work is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 * 
 * This work is distributed in the hope that it will be useful,
 * but without any warranty; without even the implied warranty of
 * merchantability or fitness for a particular purpose. See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with this library; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

(function (context) {

	// Constructor
	var XHR = function() {
		this._r	= XHR.createXMLHttpRequest();
		this._listeners	= [];
		this._headers = {};
	};

	// Constants
	XHR.UNSENT = 0;
	XHR.OPENED = 1;
	XHR.HEADERS_RECEIVED = 2;
	XHR.LOADING = 3;
	XHR.DONE = 4;

	// Static functions
	XHR.createXMLHttpRequest = (function() {
		// for browsers with native support
		if(typeof XMLHttpRequest !== 'undefined' && !FastJS.features.browser.isIE7) {
			return function() { return new XMLHttpRequest(); };
		}

		// stuff for IE
		if(typeof ActiveXObject !== 'undefined') {
			return function() {	
				try { return new ActiveXObject("MSXML2.XMLHTTP.6.0"); } catch (ex) { /* try next*/ }
				try { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch (ex) { /* try next*/ }
				try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (ex) { /* try next*/ }
			};
		}
		return FastJS.E;
	})();

	// Public Properties
	XHR.prototype.readyState = XHR.UNSENT;
	XHR.prototype.responseText = '';
	XHR.prototype.responseXML = null;
	XHR.prototype.status = 0;
	XHR.prototype.statusText = '';

	// Priority proposal
	XHR.prototype.priority = "NORMAL";

	// Instance-level Events Handlers
	XHR.prototype.onreadystatechange = null;

	// Class-level Events Handlers
	XHR.onreadystatechange = null;
	XHR.onopen = null;
	XHR.onsend = null;
	XHR.onabort = null;

	// Public Methods
	XHR.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
		// Delete headers, required when object is reused
		this._headers = { };

		// When bAsync parameter value is omitted, use true as default
		if (arguments.length < 3)
			bAsync = true;

		// Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
		this._async = bAsync;

		// Set the onreadystatechange handler
		var oRequest = this,
			nState = this.readyState,
			fOnUnload;

		// BUGFIX: IE - memory leak on page unload (inter-page leak)
		if (FastJS.features.browser.isIE && bAsync) {
			fOnUnload = function() {
				if (nState != XHR.DONE) {
					fCleanTransport(oRequest);
					// Safe to abort here since onreadystatechange handler removed
					oRequest.abort();
				}
			};
			window.attachEvent("onunload", fOnUnload);
		}

		// Add method sniffer
		if (XHR.onopen)
			XHR.onopen.apply(this, arguments);

		if (arguments.length === 5)
			this._r.open(sMethod, sUrl, bAsync, sUser, sPassword);
		else if (arguments.length === 4)
			this._r.open(sMethod, sUrl, bAsync, sUser);
		else
			this._r.open(sMethod, sUrl, bAsync);

		this.readyState	= XHR.OPENED;
		fReadyStateChange(this);

		this._r.onreadystatechange = function() {
			if (FastJS.features.browser.isGecko && !bAsync)
				return;

			// Synchronize state
			oRequest.readyState		= oRequest._r.readyState;

			//
			fSynchronizeValues(oRequest);

			// BUGFIX: Firefox fires unnecessary DONE when aborting
			if (oRequest._aborted) {
				// Reset readyState to UNSENT
				oRequest.readyState	= XHR.UNSENT;

				// Return now
				return;
			}

			if (oRequest.readyState == XHR.DONE) {
				// Free up queue
				delete oRequest._data;
				if (bAsync)
					fQueue_remove(oRequest);
				//
				fCleanTransport(oRequest);
// Uncomment this block if you need a fix for IE cache
/*
				// BUGFIX: IE - cache issue
				if (!oRequest._r.getResponseHeader("Date")) {
					// Save object to cache
					oRequest._cached	= oRequest._r;

					// Instantiate a new transport object
					XHR.call(oRequest);

					// Re-send request
					if (sUser) {
					 	if (sPassword)
							oRequest._r.open(sMethod, sUrl, bAsync, sUser, sPassword);
						else
							oRequest._r.open(sMethod, sUrl, bAsync, sUser);
					}
					else
						oRequest._r.open(sMethod, sUrl, bAsync);
					oRequest._r.setRequestHeader("If-Modified-Since", oRequest._cached.getResponseHeader("Last-Modified") || new window.Date(0));
					// Copy headers set
					if (oRequest._headers)
						for (var sHeader in oRequest._headers)
							if (typeof oRequest._headers[sHeader] == "string")	// Some frameworks prototype objects with functions
								oRequest._r.setRequestHeader(sHeader, oRequest._headers[sHeader]);

					oRequest._r.onreadystatechange	= function() {
						// Synchronize state
						oRequest.readyState		= oRequest._r.readyState;

						if (oRequest._aborted) {
							//
							oRequest.readyState	= XHR.UNSENT;

							// Return
							return;
						}

						if (oRequest.readyState == XHR.DONE) {
							// Clean Object
							fCleanTransport(oRequest);

							// get cached request
							if (oRequest.status == 304)
								oRequest._r	= oRequest._cached;

							//
							delete oRequest._cached;

							//
							fSynchronizeValues(oRequest);

							//
							fReadyStateChange(oRequest);

							// BUGFIX: IE - memory leak in interrupted
							if (FastJS.features.browser.isIE && bAsync)
								window.detachEvent("onunload", fOnUnload);
						}
					};
					oRequest._r.send(null);

					// Return now - wait until re-sent request is finished
					return;
				};
*/
				// BUGFIX: IE - memory leak in interrupted
				if (FastJS.features.browser.isIE && bAsync)
					window.detachEvent("onunload", fOnUnload);
			}

			// BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
			if (nState != oRequest.readyState)
				fReadyStateChange(oRequest);

			nState	= oRequest.readyState;
		}
	};

	function fXMLHttpRequest_send(oRequest) {
		oRequest._r.send(oRequest._data);

		// BUGFIX: Gecko - missing readystatechange calls in synchronous requests
		if (FastJS.features.browser.isGecko && !oRequest._async) {
			oRequest.readyState	= XHR.OPENED;

			// Synchronize state
			fSynchronizeValues(oRequest);

			// Simulate missing states
			while (oRequest.readyState < XHR.DONE) {
				oRequest.readyState++;
				fReadyStateChange(oRequest);
				// Check if we are aborted
				if (oRequest._aborted)
					return;
			}
		}
	};

	XHR.prototype.send	= function(vData) {
		// Add method sniffer
		if (XHR.onsend)
			XHR.onsend.apply(this, arguments);

		if (!arguments.length)
			vData	= null;

		// BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
		// BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
		// BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
		if (vData && vData.nodeType) {
			vData	= window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
			if (!oRequest._headers["Content-Type"])
				oRequest._r.setRequestHeader("Content-Type", "application/xml");
		}

		this._data	= vData;

		// Add to queue
		if (this._async)
			fQueue_add(this);
		else
			fXMLHttpRequest_send(this);
	};

	XHR.prototype.abort	= function() {
		// Add method sniffer
		if (XHR.onabort)
			XHR.onabort.apply(this, arguments);

		// BUGFIX: Gecko - unnecessary DONE when aborting
		if (this.readyState > XHR.UNSENT)
			this._aborted	= true;

		this._r.abort();

		// BUGFIX: IE - memory leak
		fCleanTransport(this);

		this.readyState	= XHR.UNSENT;

		delete this._data;
		if (this._async)
			fQueue_remove(this);
	};

	XHR.prototype.getAllResponseHeaders	= function() {
		return this._r.getAllResponseHeaders();
	};

	XHR.prototype.getResponseHeader	= function(sName) {
		return this._r.getResponseHeader(sName);
	};

	XHR.prototype.setRequestHeader	= function(sName, sValue) {
		this._headers[sName] = sValue;
		return this._r.setRequestHeader(sName, sValue);
	};

	// EventTarget interface implementation
	XHR.prototype.addEventListener = function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
				return;
		// Add listener
		this._listeners.push([sName, fHandler, bUseCapture]);
	};

	XHR.prototype.removeEventListener	= function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
				break;
		// Remove listener
		if (oListener)
			this._listeners.splice(nIndex, 1);
	};

	XHR.prototype.dispatchEvent	= function(oEvent) {
		var oEventPseudo	= {
			'type':			oEvent.type,
			'target':		this,
			'currentTarget':this,
			'eventPhase':	2,
			'bubbles':		oEvent.bubbles,
			'cancelable':	oEvent.cancelable,
			'timeStamp':	oEvent.timeStamp,
			'stopPropagation':	function() {},	// There is no flow
			'preventDefault':	function() {},	// There is no default action
			'initEvent':		function() {}	// Original event object should be initialized
		};

		// Execute onreadystatechange
		if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
			(this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);

		// Execute listeners
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == oEventPseudo.type && !oListener[2])
				(oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
	};

	/*
	XHR.prototype.toString	= function() {
		return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
	};

	XHR.toString = function() {
		return '[' + "XMLHttpRequest" + ']';
	};
	*/

	// Helper function
	function fReadyStateChange(oRequest) {
		// Sniffing code
		if (XHR.onreadystatechange)
			XHR.onreadystatechange.apply(oRequest);

		// Fake event
		oRequest.dispatchEvent({
			'type':			"readystatechange",
			'bubbles':		false,
			'cancelable':	false,
			'timeStamp':	new Date + 0
		});
	};

	function fGetDocument(oRequest) {
		var oDocument	= oRequest.responseXML,
			sResponse	= oRequest.responseText;
		// Try parsing responseText
		if (FastJS.features.browser.isIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
			oDocument	= new window.ActiveXObject("Microsoft.XMLDOM");
			oDocument.async				= false;
			oDocument.validateOnParse	= false;
			oDocument.loadXML(sResponse);
		}
		// Check if there is no error in document
		if (oDocument)
			if ((FastJS.features.browser.isIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
				return null;
		return oDocument;
	};

	function fSynchronizeValues(oRequest) {
		try {	oRequest.responseText	= oRequest._r.responseText;	} catch (e) {}
		try {	oRequest.responseXML	= fGetDocument(oRequest._r);	} catch (e) {}
		try {	oRequest.status			= oRequest._r.status;			} catch (e) {}
		try {	oRequest.statusText		= oRequest._r.statusText;		} catch (e) {}
	};

	function fCleanTransport(oRequest) {
		// BUGFIX: IE - memory leak (on-page leak)
		oRequest._r.onreadystatechange	= new window.Function;
	};

	// Queue manager
	var oQueuePending	= {"CRITICAL":[],"HIGH":[],"NORMAL":[],"LOW":[],"LOWEST":[]},
		aQueueRunning	= [];
	function fQueue_add(oRequest) {
		oQueuePending[oRequest.priority in oQueuePending ? oRequest.priority : "NORMAL"].push(oRequest);
		//
		setTimeout(fQueue_process);
	};

	function fQueue_remove(oRequest) {
		for (var nIndex = 0, bFound	= false; nIndex < aQueueRunning.length; nIndex++)
			if (bFound)
				aQueueRunning[nIndex - 1]	= aQueueRunning[nIndex];
			else
			if (aQueueRunning[nIndex] == oRequest)
				bFound	= true;
		if (bFound)
			aQueueRunning.length--;
		//
		setTimeout(fQueue_process);
	};

	function fQueue_process() {
		if (aQueueRunning.length < 6) {
			for (var sPriority in oQueuePending) {
				if (oQueuePending[sPriority].length) {
					var oRequest	= oQueuePending[sPriority][0];
					oQueuePending[sPriority]	= oQueuePending[sPriority].slice(1);
					//
					aQueueRunning.push(oRequest);
					// Send request
					fXMLHttpRequest_send(oRequest);
					break;
				}
			}
		}
	};

	context.XHR	= XHR;
})(FastJS);
