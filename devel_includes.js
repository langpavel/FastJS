(function(){
	/*
	 * This file is also readed by Makefile to query __import files in order
	 */
	var __import = function(path)
	{
		var e = document.createElement("script");
		e.setAttribute("type", "text/javascript");
		e.setAttribute("src", "/js/FastJS/"+path);
		document.getElementsByTagName('head')[0].appendChild(e);
	};
	
	__import('src/boot.js');
	__import('src/features.js');
	__import('src/lang/global.js');
	__import('src/lang/object.js');
	__import('src/lang/function.js');
	__import('src/lang/array.js');
	__import('src/lang/string.js');
	__import('src/lang/date.js');
	__import('src/classes/Encoding/utf8.js');
	__import('src/classes/Encoding/Hex.js');
	__import('src/classes/Encoding/B64.js');
	__import('src/classes/Hash/utils.js');
	__import('src/classes/Hash/SHA1.js');
	__import('src/classes/XHR.js');
	__import('src/classes/XML.js');
	__import('src/classes/XMPP/NS.js');
	__import('src/classes/XMPP/ConnProps.js');
	__import('src/classes/XMPP/Connection.js');
	__import('src/classes/XMPP/Enums.js');

	__import('src/end.js');
})();
