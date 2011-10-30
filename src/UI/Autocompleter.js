(function(GLOBAL, FJS, UI, af){
	
	af['FastJS.UI.Autocompleter'] = true;
	
	var AC = function(control) {
		if(typeof control !== 'undefined')
			this.setControl(control);
	};

	AC.prototype.lastRequest = '';
	AC.prototype.minValueLength = 2;
	AC.prototype.updatingHtml = '<div class="spinner"></div>';
	
	AC.prototype.setControl = function(control)
	{
		if(typeof control === 'string')
			this.control = document.getElementById(control);
	
		this.control.onkeyup = this.handleKeyUp.bind(this);
		this.wrapControl(this.control);
		this.hide();
		return this;
	};
	
	AC.prototype.wrapControl = function(control) {
		this.div_wrapper = GLOBAL.document.createElement('div');
		this.div_results = GLOBAL.document.createElement('div');
		
		this.div_wrapper.setAttribute('class', 'autocompleter-wrapper');
		this.div_results.setAttribute('class', 'autocompleter-results');
		
		control.parentElement.insertBefore(this.div_wrapper, control);
		this.div_wrapper.appendChild(control);
		this.div_wrapper.appendChild(this.div_results);
	};

	AC.prototype.hide = function() {
		this.div_results.setAttribute('style', 'display:none;');
	};
	
	AC.prototype.show = function() {
		this.div_results.setAttribute('style', '');
	};
	
	AC.prototype.filterValue = function(value) {
		return value;
	};
	
	AC.prototype.shouldRequestNew = function(nval, oval) {
		return (nval.trim() != oval.trim()) 
			&& (nval.length >= this.minValueLength);
	};
	
	AC.prototype.handleKeyUp = function() {
		var value = this.filterValue(this.control.value);
		//if(value.trim() != this.lastRequest)
		//	this.cancel();
		if(!this.shouldRequestNew(value, this.lastRequest))
			return;
		this.beginUpdate();
		this.handleRequest(value);
		this.lastRequest = value;
	};

	AC.prototype.handleRequest = function() {
		throw new Error("You must ovveride FastJS.UI.Autocompleter.handleRequest method");
	};
	
	AC.prototype.beginUpdate = function() {
		this.results = [];
		this.div_results.innerHTML = this.updatingHtml;
		this.show();
	};
	
	AC.prototype.addResult = function(value, html) {
		var div = GLOBAL.document.createElement('div');
		if(typeof html === 'undefined')
			html = value;
		div.innerHTML = html;
		div.onmouseover = this.handleResultMouseOver.bind(this, div, value);
		div.onmouseout = this.handleResultMouseOut.bind(this, div, value);
		div.onmousedown = this.handleResultMouseDown.bind(this, div, value);
		this.results.push(div);
		return div; 
	};
	
	AC.prototype.endUpdate = function() {
		this.div_results.innerHTML = '';
		var i,l = this.results.length;
		for(i=0; i<l; i++)
			this.div_results.appendChild(this.results[i]);
		this.show();
	};
	
	AC.prototype.handleResultMouseOver = function(div, value, ev) { /* */ };
	
	AC.prototype.handleResultMouseOut = function(div, value, ev) { /* */ };
	
	AC.prototype.handleResultMouseDown = function(div, value, ev) { 
		this.control.value = value;
		this.hide();
	};
	
	UI.Autocompleter = AC;
	
})(getFastJS('GLOBAL'), getFastJS(), getFastJS('UI'), getFastJS('features', 'artificials'));
