var fs = require('fs');
var tape = require('tape');

var mun = require('./../index.js');
var en, ru, US, Russia;
var language_ref, country_ref;

tape('Load data', function(assert) {
    var languages = require('../data/languages');
    language_ref = require('../data/languageref');
    var countries = require('../data/countries');
    country_ref = require('../data/countryref');
    assert.ok(languages);
    assert.ok(language_ref);
    assert.ok(countries);
    assert.ok(country_ref);

    ru = languages[140];
    Russia = countries[191];
    en = languages[37];
    US = countries[233];

    assert.equal(ru.description, 'Russian');
    assert.equal(Russia.country, 'Russia');
    assert.equal(en.description, 'English');
    assert.equal(US.country, 'United States');

    assert.end();
});

tape('update script', function(assert) {
    var update = require('../update.js');

    // wait for update script to run
    setTimeout(function(){
        var keys, equal;
        var updated_countries = require('../data/countryref');
        assert.ok(updated_countries);
        keys = Object.keys(updated_countries);
        equal = true;
        for (var i = 0; i < keys.length; i ++) {
            if (country_ref[keys[i]].country !== updated_countries[keys[i]].country) equal = false;
        }
        assert.ok(equal, 'country index up to date');

        var updated_languages = require('../data/languageref');
        assert.ok(updated_languages);
        keys = Object.keys(updated_languages);
        equal = true;
        for (var i = 0; i < keys.length; i ++) {
            if (language_ref[keys[i]].description !== updated_languages[keys[i]].description) equal = false;
        }
        assert.ok(equal, 'language index up to date');
        assert.end();
    }, 3000);
});

tape('hasLanguage', function(assert) {
    assert.equal(mun.hasLanguage('en'), true, 'en');
    assert.equal(mun.hasLanguage('EN'), false, 'EN');

    assert.equal(mun.hasLanguage('en-US'), true, 'en-US');
    assert.equal(mun.hasLanguage('en-US-Latn'), true, 'en-US-Latn');
    assert.equal(mun.hasLanguage('en-Fake'), false, 'en-Fake');

    assert.equal(mun.hasLanguage('en_US'), true, 'en_US');
    assert.equal(mun.hasLanguage('en_US_Latn'), true, 'en_US_Latn');
    assert.equal(mun.hasLanguage('en_Fake'), false, 'en_Fake');

    assert.equal(mun.hasLanguage('English'), true, 'English');
    assert.equal(mun.hasLanguage('english'), false, 'english');

    assert.equal(mun.hasLanguage('Eldarin'), false, 'Eldarin');
    assert.equal(mun.hasLanguage('!!'), false, '!!');

    assert.end();
});

tape('hasCountry', function(assert) {
    assert.equal(mun.hasCountry('US'), true, 'US');
    assert.equal(mun.hasCountry('us'), true, 'us');

    assert.equal(mun.hasCountry('United States'), true, 'United States');
    assert.equal(mun.hasCountry('united states'), true, 'united states');

    assert.equal(mun.hasCountry('Dinotopia'), false, 'Dinotopia');
    assert.equal(mun.hasCountry('DT'), false, 'DT');
    assert.end();
});

tape('getAllLanguagesLike', function(assert) {
    assert.equal(mun.getAllLanguagesLike('Malay').length, 38, 'Malay -> 38 languages');
    assert.equal(mun.getAllLanguagesLike('Kurdish')[0], 'Kurdish', 'Kurdish -> Kurdish');
    assert.equal(mun.getAllLanguagesLike('kurdish')[0], 'Kurdish', 'kurdish -> Kurdish');

    var french = mun.getAllLanguagesLike('French');
    assert.equal(french.length, 23, 'French -> 23 languages');
    assert.equal(french[0], 'French', 'French -> French');

    assert.equal(mun.getAllLanguagesLike('!!').length, 0, '!! -> []');

    assert.end();
});

tape('getAllCountriesLike', function(assert) {
    assert.equal(mun.getAllCountriesLike('malay')[0], 'Malaysia', 'malay -> Malaysia');
    assert.equal(mun.getAllCountriesLike('Malay')[0], 'Malaysia', 'Malay -> Malaysia');
    assert.equal(mun.getAllCountriesLike('China')[0], 'China', 'China -> China');

    var french = mun.getAllCountriesLike('French');
    assert.equal(french.length, 3, 'french -> 3 results');
    assert.equal(french[0], 'French Guiana', 'french -> French Guiana');

    assert.equal(mun.getAllCountriesLike('!!').length, 0, '!! -> []');

    assert.end();
});

tape('getLanguage -- by code', function(assert) {
    var en = mun.getLanguage('en');
    assert.equal(en.type, 'language', 'en');
    assert.equal(en.description, 'English', 'en');
    assert.equal(en.subtag, 'en', 'en');
    assert.equal(en['639_1'], 'en', 'en');
    assert.equal(en['639_2B'], 'eng', 'en');
    assert.equal(en.name_en[0], 'English', 'en');

    var ru = mun.getLanguage('ru');
    assert.equal(ru.type, 'language', 'ru');
    assert.equal(ru.description, 'Russian', 'ru');
    assert.equal(ru.subtag, 'ru', 'ru');
    assert.equal(ru['639_1'], 'ru', 'ru');
    assert.equal(ru['639_2B'], 'rus', 'ru');
    assert.equal(ru.name_en[0], 'Russian', 'ru');

    var us = mun.getLanguage('US');
    assert.equal(us.type, 'region', 'us');
    assert.equal(us.description, 'United States', 'us');
    assert.equal(us.subtag, 'US', 'us');

    // will construct an array for language codes
    // with IETF subtags
    var enUS = mun.getLanguage('en-US');
    assert.equal(enUS.length, 2, 'en-US');
    assert.equal(enUS[0].type, 'language', 'en-US');
    assert.equal(enUS[0].description, 'English', 'en-US');
    assert.equal(enUS[0].subtag, 'en', 'en-US');
    assert.equal(enUS[1].type, 'region', 'en-US');
    assert.equal(enUS[1].description, 'United States', 'en-US');
    assert.equal(enUS[1].subtag, 'US', 'en-US');

    // will construct an array for language codes
    // with IETF subtags
    var enUS = mun.getLanguage('en_US');
    assert.equal(enUS.length, 2, 'en_US');
    assert.equal(enUS[0].type, 'language', 'en_US');
    assert.equal(enUS[0].description, 'English', 'en_US');
    assert.equal(enUS[0].subtag, 'en', 'en_US');
    assert.equal(enUS[1].type, 'region', 'en_US');
    assert.equal(enUS[1].description, 'United States', 'en_US');
    assert.equal(enUS[1].subtag, 'US', 'en_US');
    

    var boont = mun.getLanguage('en-boont');
    assert.equal(boont.type, 'redundant', 'en-boont');
    assert.equal(boont.description, 'Boontling', 'en-boont');
    assert.equal(boont.tag, 'en-boont', 'en-boont');

    assert.end();
});

tape('getLanguage -- by name', function(assert) {
    var en = mun.getLanguage('English');
    assert.equal(en.type, 'language', 'English');
    assert.equal(en.description, 'English', 'English');
    assert.equal(en.subtag, 'en', 'English');
    assert.equal(en['639_1'], 'en', 'English');
    assert.equal(en['639_2B'], 'eng', 'English');
    assert.equal(en.name_en[0], 'English', 'English');

    assert.notOk(mun.getLanguage('english'), 'english');

    var ru = mun.getLanguage('Russian');
    assert.equal(ru.type, 'language', 'Russian');
    assert.equal(ru.description, 'Russian', 'Russian');
    assert.equal(ru.subtag, 'ru', 'Russian');
    assert.equal(ru['639_1'], 'ru', 'Russian');
    assert.equal(ru['639_2B'], 'rus', 'Russian');
    assert.equal(ru.name_en[0], 'Russian', 'Russian');

    var us = mun.getLanguage('United States');
    assert.equal(us.type, 'region', 'United States');
    assert.equal(us.description, 'United States', 'United States');
    assert.equal(us.subtag, 'US', 'United States');

    assert.notOk(mun.getLanguage('united states'), 'united states')
    
    assert.end();
});

tape('getCountry', function(assert) {
    var gb;

    assert.notOk(mun.getCountry('Great Britain'), 'Great Britain');
    assert.notOk(mun.getCountry('England'), 'England');
    gb = mun.getCountry('United Kingdom');
    assert.equal(gb.country, 'United Kingdom', 'United Kingdom');
    assert.equal(gb.capital, 'London', 'United Kingdom');
    assert.equal(gb.continent, 'EU', 'United Kingdom');
    assert.equal(gb.iso, 'GB', 'United Kingdom');
    assert.equal(gb['iso3'], 'GBR', 'United Kingdom');


    assert.notOk(mun.getCountry('UK'), 'UK');
    gb = mun.getCountry('GB');
    assert.equal(gb.country, 'United Kingdom', 'GB');
    assert.equal(gb.capital, 'London', 'GB');
    assert.equal(gb.continent, 'EU', 'GB');
    assert.equal(gb.iso, 'GB', 'GB');
    assert.equal(gb['iso3'], 'GBR', 'GB');
    
    assert.end();
});

tape('getOfficialLanguages', function(assert) {
    var l = mun.getOfficialLanguages('AM');
    assert.equal(l.length, 1);
    assert.equal(l[0], 'hy');

    l = mun.getOfficialLanguages('AM', {verbose: true});
    assert.equal(l.length, 1);
    assert.equal(l[0].type, 'language');
    assert.equal(l[0].subtag, 'hy');
    assert.equal(l[0]['suppress-script'], 'Armn');
    assert.equal(l[0].description, 'Armenian');

    l = mun.getOfficialLanguages('Angola', {verbose: true});
    assert.equal(l.length, 1);
    assert.equal(l[0].length, 2);
    assert.equal(l[0][0].type, 'language');
    assert.equal(l[0][0].subtag, 'pt');
    assert.equal(l[0][0]['suppress-script'], 'Latn');
    assert.equal(l[0][0].description, 'Portuguese');
    assert.equal(l[0][1].type, 'region');
    assert.equal(l[0][1].subtag, 'AO');
    assert.equal(l[0][1].description, 'Angola');

    assert.end();
});
