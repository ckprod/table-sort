(function () {
    "use strict";

    // This simple and small javascript solution for sorting html tables
    // is based on tristen's Tablesort
    // http://tristen.ca/tablesort/demo/
    function TableSort(table, options) {
        if (table && table.tagName !== 'TABLE') {
            return '';
        }
(function () {
    "use strict";

    // This simple and small javascript solution for sorting html tables
    // is based on tristen's Tablesort
    // http://tristen.ca/tablesort/demo/
    function TableSort(table, options) {
        if (table && table.tagName !== 'TABLE') {
            return '';
        }

        var time = new Date();
        this.init(table, options || {});
    }

    TableSort.prototype = {
        init: function (table, options) {
            var ts = this;

            // check empty table
            if (!(table && table.rows && table.rows.length > 0)) {
                return '';
            }

            // header row
            var hr = table.rows[0];

            // attach a click handler to each cell of the header row.
            for (var i = 0; i < hr.cells.length; i++) {
                var cell = hr.cells[i];
				// check and set space for sort order image
                var paddingTop = parseInt(window.getComputedStyle(cell, null).getPropertyValue("padding-top"));
                cell.style.paddingTop=(paddingTop>6?paddingTop:6)+'px';
                cell.className += ' sort-header';
                addEvent(cell, 'click', function () {
                    for (var j = 0; j < this.parentNode.cells.length; j++) {
                        if (hasClass(this.parentNode.cells[j], 'sort-up') || hasClass(this.parentNode.cells[j], 'sort-down')) {
                            if (this.parentNode.cells[j] !== this) {
                                this.parentNode.cells[j].className = this.parentNode.cells[j].className.replace(' sort-down', '')
                                    .replace(' sort-up', '');
                            }
                        }
                    }

                    ts.sort(this, table);
                });
            }
        },

        sort: function (cell, table) {
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
        }
    };

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
    }

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 280 - 282
    var hasClass = function (el, c) {
        return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
    };

    // http://ejohn.org/apps/jselect/event.html
    function addEvent( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function () {
            obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    }

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 297 - 301
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TableSort;
    } else {
        window.TableSort = TableSort;
    }
})();
        this.init(table, options || {});
    }

    TableSort.prototype = {
        init: function (table, options) {
            var ts = this;

            // check empty table
            if (!(table && table.rows && table.rows.length > 0)) {
                return '';
            }

            // header row
            var hr = table.rows[0];

            // attach a click handler to each cell of the header row.
            for (var i = 0; i < hr.cells.length; i++) {
                var cell = hr.cells[i];
				// check and set space for sort order image
                var paddingTop = parseInt(window.getComputedStyle(cell, null).getPropertyValue("padding-top"));
                cell.style.paddingTop=(paddingTop>6?paddingTop:6)+'px';
                cell.className += ' sort-header';
                addEvent(cell, 'click', function () {
                    for (var j = 0; j < this.parentNode.cells.length; j++) {
                        if (hasClass(this.parentNode.cells[j], 'sort-up') || hasClass(this.parentNode.cells[j], 'sort-down')) {
                            if (this.parentNode.cells[j] !== this) {
                                this.parentNode.cells[j].className = this.parentNode.cells[j].className.replace(' sort-down', '')
                                    .replace(' sort-up', '');
                            }
                        }
                    }

                    ts.sort(this, table);
                });
            }
        },

        sort: function (cell, table) {
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
        }
    };

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
    }

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 280 - 282
    var hasClass = function (el, c) {
        return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
    };

    // http://ejohn.org/apps/jselect/event.html
    function addEvent( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function () {
            obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    }

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 297 - 301
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TableSort;
    } else {
        window.TableSort = TableSort;
    }
})();