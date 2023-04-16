// Node JS implementation for citation

// NOTE:
// You can use this code directly but you must first implement the conversion method from your own record type to a CSL JSON
// ********** !!!! The implementation must be done in generateClsFromRecord  !!!!!! ***********

// Example code from a js file that plans to use this library
// const { cite } = require('./citation');
// let citation = await cite(records, types.style, types.locale)
// console.log(citation);


// Uses the citeproc file from https://github.com/Juris-M/citeproc-js/blob/master/citeproc_commonjs.js
// ***********   This file must be in the project
const CSL = require('./citeproc_commonjs');

// If using style and locale configurations stored locally
// Assumes there's two folders
// a folder named styles containing csl files from https://github.com/citation-style-language/styles.git
// a folder named locales containing xml files from https://github.com/citation-style-language/locales.git
const fs = require('fs');

// Backup method of obtaining style and locale configurations online
// Requires node package "xmlhttprequest": "^1.8.0" to be installed
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


/////////////////////////////////////////////////////////////////////////////
// Mapping Your Record to CSL JSON
/////////////////////////////////////////////////////////////////////////////

function generateClsFromRecord(records) {
    let convertedRecords = records;

    // If original records is already in CLS JSON format, ignore this message
    // Feel free to delete it :)

    // ************* CONVERT YOUR RECORDS TO CSL JSON ****************** //
    // Follow the following schema
    // https://github.com/citation-style-language/schema/blob/master/schemas/input/csl-data.json

    // Further instructions
    // https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html

    return convertedRecords;

}

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
// Processing CLS JSON to create bibliographies
/////////////////////////////////////////////////////////////////////////////

function retrieveLocale(locale) {
    let localeAsText;
    try {
        // Assumes there's a locale folder with xmls from https://github.com/citation-style-language/locales.git
        localeAsText = fs.readFileSync(`./locales/locales-${locale}.xml`, 'utf8');
    } catch { }

    // If cannot find the locale configuration locally, try online
    if (!localeAsText) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-' + locale + '.xml', false);
        xhr.send(null);
        localeAsText = xhr.responseText;
    }

    if (!localeAsText) {
        throw new Error(`${style} is not an accepted style.`);
    }

    return localeAsText;
}

function generateClsJsonMap(clsRecord) {
    let citations = {}
    for (var i = 0, ilen = clsRecord.items.length; i < ilen; i++) {
        var item = clsRecord.items[i];
        if (!item.issued) continue;
        if (item.URL) delete item.URL;
        var id = item.id;
        citations[id] = item;
    }
    return citations;
}

async function getProcessor(citeprocSys, style) {
    let styleAsText
    try {
        // Assumes there's a local folder called styles with the CLS from https://github.com/citation-style-language/styles.git
        styleAsText = fs.readFileSync(`./styles/${style}.csl`, 'utf8');
    } catch { }

    if (!styleAsText) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/' + style + '.csl', false);
        xhr.open('GET', './citation_styles/' + style + '.csl', false);
        xhr.send(null);
        styleAsText = xhr.responseText;
    }

    if (!styleAsText) {
        throw new Error(`${style} is not an accepted style.`);
    }

    var citeproc = new CSL.Engine(citeprocSys, styleAsText);
    return citeproc;
};

async function processorOutput(citeprocSys, style, ids) {
    ret = '';
    var citeproc = await getProcessor(citeprocSys, style);
    citeproc.updateItems(ids);
    var result = citeproc.makeBibliography();
    return result[1].join('\n');
}

module.exports.cite = async function (records, style, locale) {
    if (!records) {
        return new Error(`No available records to cite.`);
    }

    // If it's a single record, convert to an array
    let isArray = Array.isArray(records);
    let clsRecords = generateClsFromRecord(isArray ? records : [records]);

    if (!clsRecords?.items?.length) {
        return new Error(`No valid records to cite.`);
    }

    let clsMappedRecords = generateClsJsonMap(clsRecords)
    citeprocSys = {
        retrieveLocale: function () {
            return retrieveLocale(locale);
        },
        retrieveItem: function (id) {
            return clsMappedRecords[id];
        }
    };

    try {
        let result = await processorOutput(citeprocSys, style, Object.keys(clsMappedRecords));
        return result;
    } catch (ex) {
        return new Error(`Something went wrong while generating citations. ${ex}`);
    }
}