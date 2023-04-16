# snippets

This commonJS module is ready to use in NodeJS projects that wishes to generate citations


Requires https://github.com/Juris-M/citeproc-js/blob/master/citeproc_commonjs.js as a dependency


The citation tool needs both a locale configuration and a style configuration; The code snippet will attempt to get these configurations locally 
before making http calls to retrieve this info.


The configurations are available at
[styles](https://github.com/citation-style-language/styles.git)
and 
[locales](https://github.com/citation-style-language/locales)



Usage would look like:


const { cite } = require('./citation');
let citation = await cite(records, style, locale)

If the records are in CLS JSON format, then the library can used as is. If the records are not, the user must 
fill in their own conversion function in the generateClsFromRecord section.


This snippet simply packages the demo code and adds a few more capabilities
Credit goes to https://citeproc-js.readthedocs.io/en/latest/deployments.html
