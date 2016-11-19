var languages = require('./data/languages');
var language_ref = require('./data/languageref');
var countries = require('./data/countries');
var country_ref = require('./data/countryref');
var fallback = require('./data/fallback');

module.exports = {};

module.exports.hasLanguage = function(str) {
    if (language_ref[str]) return true;

    str = str.replace(/_/g, '-').split('-');
    if (str.length > 1) {
        var match = true;
        str.forEach(function(d) {
            if (!language_ref[d]) match = false;
        });
        return match;
    }
    return false;
}

module.exports.hasCountry = function(str) {
    return void(0) !== country_ref[str.toLowerCase()];
}

module.exports.getLanguage = function(str) {
    var match;
    match = language_ref[str];
    if (match) return languages[match];

    str = str.replace(/_/g, '-').split('-');
    if (str.length > 1) {
        match = [];
        str.forEach(function(d, i) {
            var obj = languages[language_ref[d]];
            if (obj) match.push(obj);
        });
        return match;
    }
    return false;
}

module.exports.getCountry = function(str) {
    str = country_ref[str.toLowerCase()];
    if (str) return countries[str];
    return false;
}

module.exports.getAllLanguagesLike = function(str) {
    str = str.toLowerCase();
    var keys = Object.keys(language_ref);
    var length = keys.length;
    var matches = [];
    for (var i = 0; i < length; i++) {
        if (keys[i].toLowerCase().indexOf(str) >= 0) matches.push(keys[i]);
    }
    return matches;
}

module.exports.getAllCountriesLike = function(str) {
    str = str.toLowerCase();
    var keys = Object.keys(country_ref);
    var length = keys.length;
    var matches = [];
    for (var i = 0; i < length; i++) {
        if (keys[i].indexOf(str) >= 0) matches.push(camelcase(keys[i]));
    }
    return matches;
}

// A 2 digit country code will return an array of language codes
// or false if invalid cc or no value for that cc
module.exports.getOfficialLanguages = function(cc, options) {
    if (!options) options = {};    

    var val = country_ref[cc.toLowerCase()];
    val = val ? countries[val] : null;

    if (!val) return false;

    val = val.languages;

    if (options.verbose) {
        var response = [];
        var length = val.length;
        for (var i = 0; i < length; i ++) {
            if (language_ref[val[i]]) {
                response.push(languages[language_ref[val[i]]]);
            } else {
                var lan = val[i].replace(/_/g, '-').split('-');
                var nested = [];
                lan.forEach(function(d, i) {
                    var obj = languages[language_ref[d]];
                    if (obj) nested.push(obj);
                });
                response.push(nested);
            }
        }
        val = response;
    }
    if (val && val.length) return val;
    return false;
}

module.exports.fallback(str) {
    return fallback[str] || fallback[str.split('-')[0]] || null;
}

function camelcase(str) {
    if (str.length == 2) return str;
    return str.split(' ').map(function(d, i) {
        if (['and', 'the', 'of'].indexOf(d) >= 0) return d;
        return d.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return letter.toUpperCase();
        });
    }).join(' ');
}
