## model-un

[![Build Status](https://travis-ci.org/mapbox/model-un.svg)](https://travis-ci.org/mapbox/model-un)

A library that provides [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) with English names, and official/common languages/language codes for countries and sovereign states.

![](https://cloud.githubusercontent.com/assets/3952537/9949310/e31e04b0-5d5f-11e5-800e-1252f9f3cb53.png)

### Usage:

```
var mun = require('@mapbox/model-un');

// functions take either:
// a 2-3 letter (ISO 639-1 preferred, 639-2B - 2T fallback) language code or a language name
// or
// a 2 letter (ISO) country code or country name

// language code should conform to the IETF code, but may also be written with an underscore
// e.g. en-US or en_US in order to support postgres column names

mun.hasLanguage('en');
// true
mun.hasLanguage('English');
// true

mun.hasCountry('US');
// true
mun.hasCountry('United States');
// true

mun.getLanguage('ru');
// { type: 'language', subtag: 'ru', description: 'Russian', added: '2005-10-16', 'suppress-script': 'Cyrl', '639_1': 'ru', '639_2B': 'rus', name_en: [ 'Russian' ] }
mun.getLanguage('Russian');
// { type: 'language', subtag: 'ru', description: 'Russian', ...}

// supports IETF subtags
mun.getLanguage('en-US');
// [ 
//   { type: 'language', subtag: 'en', description: 'English', added: '2005-10-16',  'suppress-script': 'Latn', '639_1': 'en', '639_2B': 'eng', name_en: 'English' ] },
//   { type: 'region', subtag: 'US', description: 'United States', added: '2005-10-16' }
// ]

mun.getCountry('us');
// { iso: 'US', iso3: 'USA', country: 'United States', capital: 'Washington',  continent: 'NA', postal_code_format: '#####-####', postal_code_regex: '^\\d{5}(-\\d{4})?$', languages: [ 'en-US', 'es-US', 'haw', 'fr' ] }
mun.getCountry('!!');
// false

mun.getAllLanguagesLike('Chinese');
// [ 'Chinese', 'Achinese', 'Min Dong Chinese'...]
mun.getAllLanguagesLike('Dinosaurese');
// []

mun.getAllCountriesLike('French');
// [ 'French Guiana', 'French Polynesia'...]
mun.getAllCountriesLike('Dinotopia');
// []

mun.getOfficialLanguages('cz');
// [ 'cs', 'sk' ]

mun.getOfficialLanguages('cz', {verbose: true});
// [
//  { type: 'language', subtag: 'cs',  description: 'Czech',  added: '2005-10-16', 'suppress-script': 'Latn', '639_1': 'cs', '639_2B': 'cze', '639_2T': 'ces', name_en: [ 'Czech' ] },
//  { type: 'language', subtag: 'sk', description: 'Slovak', added: '2005-10-16', 'suppress-script': 'Latn', '639_1': 'sk', '639_2B': 'slo', '639_2T': 'slk', name_en: [ 'Slovak' ] } 
// ]

mun.getTwoLetterLanguage('deu');
// 'de'

mun.getTwoLetterCountry('DEU');
// 'DE'

mun.getThreeLetterCountry('DE')
// 'DEU'

/* 
There are ** 2 ** possible three-letter language codes for
20 countries. ISO 639_2B specifies a 'bibliographic'
code that is English-based, while ISO 639_2T specifies a 
'terminological' code derived from the native name for the language.
This latter T-code is generally preferred, including in future ISO
standards. As an example, the language codes for German are:
639_2B == 'ger' (from English 'German')
639_2T == 'deu' (from German 'Deutsch')
By default, this function returns the T-code if available.
However, this can be overridden by adding `true` after the language
code to fill the optional boolean parameter `prefer_b`.
*/

mun.getThreeLetterLanguage('de')
// 'deu'
mun.getThreeLetterLanguage('de',true)
// 'ger'

```

### Test:

`npm test`

### Update indices:

`npm run updateAll`

### Data from: 

[IANA Language Subtag Registry](http://www.iana.org/assignments/language-subtag-registry)

[Geonames](http://creativecommons.org/licenses/by/3.0/) with modification (see `./data/countries.json`)
