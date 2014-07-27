table-sort
==========

Adds basic functionality to html tables: sorting.

###Sample

See [here](http://irhc.github.io/table-sort) for some samples.

###Description

table-sort is one of the smallest javascript component out on the web which adds basic functionality to html tables: sorting. It is completely independent from other javascript libraries but should work side-by-side with libraries like jQuery, etc.

Any html tables which have at least one tr tag can be used (a thead or tbody tag is not mandatory), e.g.

```html
<table id="example">
    <tbody>
        <tr>
            <th>Name</th>
            <th>&Auml;nderungsdatum</th>
            <th>Typ</th>
            <th>Gr&ouml;&szlig;e</th>
        </tr>
        <tr>
            <td>libraries</td>
            <td>08.10.2013 12:38</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>views</td>
            <td>08.10.2013 12:38</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>css</td>
            <td>18.05.2014 11:08</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>.htaccess</td>
            <td>03.06.2013 14:29</td>
            <td>HTACCESS-Datei</td>
            <td>1 KB</td>
        </tr>
        <tr>
            <td>config.php</td>
            <td>03.06.2013 14:29</td>
            <td>PHP-Datei</td>
            <td>3 KB</td>
        </tr>
        <tr>
            <td>blank.html</td>
            <td>18.05.2014 11:08</td>
            <td>HTLM-Datei</td>
            <td>1 KB</td>
        </tr>
    </tbody>
</table>
```

#####Supported sorting types

Many different column types can be sorted: numbers, text, web addresses, dates and many more.
See [Javascript Natural Sort Algorithm With Unicode Support](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/) for a detailed description of supported sorting types.

###How to use

In the head section of your html file put

```html
<link href='table-sort.css' rel='stylesheet'>
```

Just before the end of your body section put

```html
<script src='table-sort.min.js'></script>
<script>
  new TableSort(document.getElementById('example'));
</script>
```

###References

This small javascript component uses or is based on other javascript projects and code snippets:

- [tablesort by tristen](http://tristen.ca/tablesort/demo/)
- [Javascript Natural Sort Algorithm With Unicode Support](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/)
- [addEvent() recoding contest entry](http://ejohn.org/apps/jselect/event.html)

### Licence

MIT

