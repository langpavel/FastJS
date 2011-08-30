/**
 * Wrapper for XMLHttpRequest
 */
FastJS.XHttp = function() {
	this._r = FastJS.XHttp.createRequest(); 
};

/*
 * Static method.
 * Returns browser XMLHttpRequest instance
 */
FastJS.XHttp.createRequest = (function()
{
	if(typeof XMLHttpRequest !== 'undefined')
		// for browsers with native support
		return function() { return new XMLHttpRequest(); };
	if(typeof ActiveXObject !== 'undefined')
	{
		// for IE
		return function() {	return new ActiveXObject("Microsoft.XMLHTTP"); };
	}
	return null;
})();

/*

This is XHMHttpRequest Level 2 interface from Editor's Draft 23 August 2011
See http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#interface-xmlhttprequest:

interface XMLHttpRequestEventTarget : EventTarget {
  // event handlers
           attribute Function onloadstart;
           attribute Function onprogress;
           attribute Function onabort;
           attribute Function onerror;
           attribute Function onload;
           attribute Function ontimeout;
           attribute Function onloadend;
};

interface XMLHttpRequestUpload : XMLHttpRequestEventTarget {

};

[Constructor]
interface XMLHttpRequest : XMLHttpRequestEventTarget {
  // event handler
           attribute Function onreadystatechange;

  // states
  const unsigned short UNSENT = 0;
  const unsigned short OPENED = 1;
  const unsigned short HEADERS_RECEIVED = 2;
  const unsigned short LOADING = 3;
  const unsigned short DONE = 4;
  readonly attribute unsigned short readyState;

  // request
  void open(DOMString method, DOMString url, optional boolean async, optional DOMString? user, optional DOMString? password);
  void setRequestHeader(DOMString header, DOMString value);
           attribute unsigned long timeout;
           attribute boolean withCredentials;
  readonly attribute XMLHttpRequestUpload upload;
  void send();
  void send(ArrayBuffer data);
  void send(Blob data);
  void send(Document data);
  void send([AllowAny] DOMString? data);
  void send(FormData data);
  void abort();

  // response
  readonly attribute unsigned short status;
  readonly attribute DOMString statusText;
  DOMString getResponseHeader(DOMString header);
  DOMString getAllResponseHeaders();
  void overrideMimeType(DOMString mime);
           attribute DOMString responseType;
  readonly attribute any response;
  readonly attribute DOMString responseText;
  readonly attribute Document responseXML;
};
 */