(function(FJS, XML, af){
	af['FastJS.XML.createNativeDoc'] = true;
	XML.createNativeDoc = (function() {
		// can check of typeof document.implementation do errors?
		if(typeof document.implementation !== 'undefined'
			&& typeof document.implementation.createDocument !== 'undefined')
		{
			af['FastJS.XML.createNativeDoc variant'] = 'document.implementation.createDocument';
			return function(namespace, rootElement, doctype) {
				if(doctype==null) doctype = null;
				return document.implementation.createDocument(namespace, rootElement, doctype);
			};
		}
		
		if(typeof ActiveXObject !== 'undefined')
		{
			af['FastJS.XML.createNativeDoc variant'] = 'ActiveXObject';
			return function(namespace, rootElement, doctype) {
				var axids = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0',
						'Msxml2.DOMDocument', 'MSXML.DOMDocument', 
						'Microsoft.XMLDOM'];
				var i, l, r;
				
				// arter first call right ActiveX object is found;
				// this function replaced body is replaced with one below
				var f = function(ns, rEl, dt) {
					if(dt==null) dt = null;
					var doc = new ActiveXObject(af['FastJS.XML.createNativeDoc ActiveXObject']);
					doc.appendChild((ns == null || ns === '') 
							? doc.createElement(rEl)
							: doc.createNode(1, rEl, ns));
					return doc;
				};
				
				for(i = 0, l = axids.length; i < l; i++) {
					af['FastJS.XML.createNativeDoc ActiveXObject'] = axids[i];
					try {
						r = f(namespace, rootElement, doctype);
						// if succeed, update create function
						XML.createNativeDoc = f;
						return r;
					} catch (ex) { /* continue; */ }
				}
				
				// bad news, corresponding ActiveX object not found 
				
				af['FastJS.XML.createNativeDoc ActiveXObject'] = 'unknown';
				//XML.createXMLDoc = FJS.E;
			};
		}

		return FJS.E;
	})();

})(getFastJS(), getFastJS('XML'), getFastJS('features', 'artificials'));