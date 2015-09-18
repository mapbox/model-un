var fs = require('fs');

module.exports = {
    update_languages: update_languages,
    update_countries: update_countries
}

function update_languages() {
    var language_ref = {};

    var ietf = require('./data/languages');
    var len = ietf.length;
    for (var i = 0; i < len; i ++) {
        var record = ietf[i];
        language_ref[record.description] = i;
        if (record.subtag) language_ref[record.subtag] = i;
        if (record.tag) language_ref[record.tag] = i;
    }

    var file = './data/languageref.json';
    fs.writeFile(file, JSON.stringify(language_ref, null, 2), function(err) {
        if (err) console.log(err);
        else console.log(file, 'saved');
    });
};

function update_countries() {
    var country_ref = {};

    var countries = require('./data/countries');
    var len = countries.length;
    for (var i = 0; i < len; i ++) {
        record = countries[i];
        country_ref[record.country.toLowerCase()] = i;
        country_ref[record.iso.toLowerCase()] = i;
    }

    var file = './data/countryref.json';
    fs.writeFile(file, JSON.stringify(country_ref, null, 2), function(err) {
        if (err) console.log(err);
        else console.log(file, 'saved');
    });
};

if (process.argv[2] == 'languages') update_languages();
if (process.argv[2] == 'countries') update_countriess();
if (process.argv[2] == 'all' || !process.argv[2]) { 
    update_languages();
    update_countries();
}