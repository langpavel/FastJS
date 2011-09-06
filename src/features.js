(function(FastJS, features, af){

	features.hasNativeJSON = (typeof JSON !== 'undefined'
		&& typeof JSON.stringify === 'function'
		&& JSON.stringify(0) === '0'
		&& typeof JSON.stringify(FastJS.K) === 'undefined');
	
	// most of these code is copied from http://www.quirksmode.org/js/detect.html
	features.browser = (function() {
		var b = {
			init: function () {
				this.browser = this.searchString(this.dataBrowser);
				this.version = this.searchVersion(navigator.userAgent)
					|| this.searchVersion(navigator.appVersion);
				this.OS = this.searchString(this.dataOS);
			},
			searchString: function (data) {
				for (var i=0;i<data.length;i++)	{
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					this.versionSearchString = data[i].versionSearch || data[i].identity;
					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1)
							return data[i].identity;
					}
					else if (dataProp)
						return data[i].identity;
				}
				return 'unknown';
			},
			searchVersion: function (dataString) {
				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1) return;
				return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
			},
			dataBrowser: [
				{
					string: navigator.userAgent,
					subString: "Chrome",
					identity: "Chrome"
				},
				{ 	string: navigator.userAgent,
					subString: "OmniWeb",
					versionSearch: "OmniWeb/",
					identity: "OmniWeb"
				},
				{
					string: navigator.vendor,
					subString: "Apple",
					identity: "Safari",
					versionSearch: "Version"
				},
				{
					prop: window.opera,
					identity: "Opera",
					versionSearch: "Version"
				},
				{
					string: navigator.vendor,
					subString: "iCab",
					identity: "iCab"
				},
				{
					string: navigator.vendor,
					subString: "KDE",
					identity: "Konqueror"
				},
				{
					string: navigator.userAgent,
					subString: "Firefox",
					identity: "Firefox"
				},
				{
					string: navigator.vendor,
					subString: "Camino",
					identity: "Camino"
				},
				{	// for newer Netscape (6+)
					string: navigator.userAgent,
					subString: "Netscape",
					identity: "Netscape"
				},
				{
					string: navigator.userAgent,
					subString: "MSIE",
					identity: "Explorer",
					versionSearch: "MSIE"
				},
				{
					string: navigator.userAgent,
					subString: "Gecko",
					identity: "Mozilla",
					versionSearch: "rv"
				},
				{ 	// for older Netscapes (4-)
					string: navigator.userAgent,
					subString: "Mozilla",
					identity: "Netscape",
					versionSearch: "Mozilla"
				}
			],
			dataOS : [
				{
					string: navigator.platform,
					subString: "Win",
					identity: "Windows"
				},
				{
					string: navigator.platform,
					subString: "Mac",
					identity: "Mac"
				},
				{
					string: navigator.userAgent,
					subString: "iPhone",
					identity: "iPhone/iPod"
				},
				{
					string: navigator.platform,
					subString: "Linux",
					identity: "Linux"
				}
			]
		};
		b.init();
		return { 
			name: b.browser, 
			version: b.version,
			OS: b.OS,
			isIE: (b.browser === 'Explorer'),
			isIE7: (b.browser === 'Explorer' && b.version >= 7 && b.version < 8),
			isGecko: (b.browser === 'Firefox'),
			toString: function() { 
				return this.name + ' ' + this.version + ' on ' + this.OS; 
			}
		};
	})();
})(getFastJS(), getFastJS('features'), getFastJS('features', 'artificials'));
