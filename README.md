## model-un

A library that provides IETF language tags with English names, and official/common languages/language codes for countries and sovereign states.

![]https://cloud.githubusercontent.com/assets/3952537/9949310/e31e04b0-5d5f-11e5-800e-1252f9f3cb53.png

### Usage:

```
var mun = require('model-un');

// functions take either:
// a 2-3 letter (ISO 639-1 preferred, 639-2B - 2T fallback) language code or a language name
// or
// a 2 letter (ISO) country code or country name

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


```

### Test:

`npm test`

### Update indices:

`npm run updateAll`

### Data from: 

[IANA Language Subtag Registry](http://www.iana.org/assignments/language-subtag-registry)

[Geonames](http://creativecommons.org/licenses/by/3.0/) with modification (see `./data/countries.json`)
