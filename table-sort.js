;(function () {
    "use strict";

    // This simple and small javascript solution for sorting html tables
    // is based on tristen's Tablesort
    // http://tristen.ca/tablesort/demo/
    function TableSort(table, options) {
		// check input
        if (table && table.tagName !== 'TABLE') {
			console.log('ERROR: DOM element/input is not a table!');
            return;
        }
		
        // check empty table
        if (!(table && table.rows && table.rows.length > 0)) {
			console.log('WARNING: Empty table.');
            return;
        }

        this._init(table, options || {});
    }

	TableSort.prototype = (function () {
		
		// helper functions
		
		// Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
		// Author: Jim Palmer (based on chunking idea from Dave Koelle)
		// http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/
		function naturalSort(a, b) {
			var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
				sre = /(^[ ]*|[ ]*$)/g,
				dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
				hre = /^0x[0-9a-f]+$/i,
				ore = /^0/,
				i = function (s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
				// convert all to strings strip whitespace
				x = i(a).replace(sre, '') || '',
				y = i(b).replace(sre, '') || '',
				// chunk/tokenize
				xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
				yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
				// numeric, hex or date detection
				xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
				yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
				oFxNcL, oFyNcL;
			// first try and sort Hex codes or Dates
			if (yD)
				if (xD < yD) return -1;
				else if (xD > yD) return 1;
			// natural sorting through split numeric strings and default strings
			for (var cLoc = 0, numS = Math.max(xN.length, yN.length) ; cLoc < numS; cLoc++) {
				// find floats not starting with '0', string or 0 if not defined (Clint Priest)
				oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
				oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
				// handle numeric vs string comparison - number < string - (Kyle Adams)
				if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
					// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
				else if (typeof oFxNcL !== typeof oFyNcL) {
					oFxNcL += '';
					oFyNcL += '';
				}
				if (oFxNcL < oFyNcL) return -1;
				if (oFxNcL > oFyNcL) return 1;
			}
			return 0;
		};
		
        function sort(cell, table) {		
            // store rows for sorting
            var sortRows = [];
            for (var i = 1; i < table.rows.length; i++) {
                sortRows.push(table.rows[i]);
            }

            // sort
            sortRows.sort(function (a, b) {
                var x = a.cells[cell.cellIndex].textContent,
                    y = b.cells[cell.cellIndex].textContent;

                return naturalSort(x, y);
            });

            if (hasClass(cell, 'sort-down')) {
                cell.className = cell.className.replace(/ sort-down/, '');
                cell.className += ' sort-up';
            } else {
                cell.className = cell.className.replace(/ sort-up/, '');
                cell.className += ' sort-down';
            }

            // before we append should we reverse the new array or not?
            if (hasClass(cell, 'sort-down')) {
                sortRows.reverse();
            }

            for (i = 0; i < sortRows.length; i++) {
                // appendChild(x) moves x if already present somewhere else in the DOM
                table.tBodies[0].appendChild(sortRows[i]);
            }
        };
		
		// https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
		// line 280 - 282
		var hasClass = function (el, c) {
			return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
		};
		
		// storage functions
		// load state and returns the array
		function loadState(key) {
			var state = localStorage.getItem(key);

			if (state != null) {
				try {
					state = JSON.parse(state);
				} catch (e) {
					state = new Array();
				}
			} else {
				state = new Array();
			}

			return state;
		}
		function findIndex(state, searchId) {
			//find element
			for (var i = 0; i < state.length; i++) {
				var id = state[i].id;
				if (id == searchId) {
					return i;
				}
			}
			return -1;
		}
		function saveState(key, table /* name, prop*/) {
			// ie in offline mode can't use localStorage,
			// use alternative storage like
			// https://github.com/andris9/simpleStorage
			// or many more alternatives on
			// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
			if (!localStorage) {
                console.log('localStorage not supported or not usable (i.e. ie in offline mode).');
				return; 
			}
			
			var state = loadState(key),
				id = table.getAttribute('id'),
				element = {id: id},
				index = findIndex(state, id);
				
			for (var i = 2; i < arguments.length; i+=2) {
				element[arguments[i]] = arguments[i+1];
			}

			// place element
			if (index < 0) {
				state.push(element);
			} else {
				state.splice(index, 1, element);
			}

			localStorage.setItem(key, JSON.stringify(state));
		}
		function restoreState(key, table, name) {
			// ie in offline mode can't use localStorage,
			// use alternative storage like
			// https://github.com/andris9/simpleStorage
			// or many more alternatives on
			// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
			if (!localStorage) {
                console.log('localStorage not supported or not usable (i.e. ie in offline mode).');
				return; 
			}
			
			var state = loadState(key),
				id = table.getAttribute('id'),
				index = findIndex(state, id);
		
			if (index >= 0) {
				var element = state[index],
					memory = element[name],
					cell = table.rows[0].cells[memory.index];
		
				cell.className += ' ' + memory.order;
				
				sort(cell, table);
			}			
		}

		// private functions
	
		function _init(table, options) {
			// set options
			var newOptions = {};
			for (var opt in this.options) {
				newOptions[opt] = (typeof options[opt] == 'undefined') ?  this.options[opt] : options[opt];
			}
			this.options = newOptions;
			
			// table
			this.table = table;
			// header row
			this.hr = table.rows[0];
			// number of columns
			this.nc = this.hr.cells.length;
			
			// to keep context
			var _this = this;

            // attach a click handler to each cell of the header row.
            for (var i = 0; i < this.nc; i++) {
                var cell = this.hr.cells[i];
				// check and set space for sort order image
                var paddingTop = parseInt(window.getComputedStyle(cell, null).getPropertyValue("padding-top"));
                cell.style.paddingTop=(paddingTop>6?paddingTop:6)+'px';
                cell.className += ' sort-header';
                addEvent(cell, 'click', function () {
					var index = 0;
                    for (var j = 0; j < _this.nc; j++) {
						var c = _this.hr.cells[j];
                        if (c !== this) {
							if (hasClass(c, 'sort-up') || hasClass(c, 'sort-down')) {
								c.className = c.className.replace(' sort-down', '')
														 .replace(' sort-up', '');
							}
                        } else {
							index = j;
						}
                    }

					_this.cell = this;
                    sort(this, _this.table);
					
					if (_this.options.restoreState)
						saveState('table-sort', _this.table, 'sort', {index: index, order: ((hasClass(this, 'sort-down')) ? 'sort-up' : 'sort-down')});
                });
            }
			
			if (this.options.restoreState)
				restoreState('table-sort', this.table, 'sort');
        };
		
		function refresh() {
			if (typeof this.cell != 'undefined')
				sort(this.cell, this.table);
		};

		return {
			constructor: TableSort,
			options: {
                restoreState: true
			},
			_init: _init,
			refresh: refresh
		};
	})();
	
	// export

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 297 - 301
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TableSort;
    } else {
        window.TableSort = TableSort;
    }
	
	// polyfills and public code snippets
	
    // http://ejohn.org/apps/jselect/event.html
    function addEvent(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](window.event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else
            obj.addEventListener(type, fn, false);
    }

})();