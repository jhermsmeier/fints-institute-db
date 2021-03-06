# FinTS Institute DB [![version](https://flat.badgen.net/npm/v/fints-institute-db?label=)](https://npmjs.com/package/fints-institute-db)
[![npm license](https://flat.badgen.net/npm/license/fints-institute-db)](https://npmjs.com/package/fints-institute-db)
[![npm downloads](https://flat.badgen.net/npm/dm/fints-institute-db)](https://npmjs.com/package/fints-institute-db)
[![build status](https://flat.badgen.net/travis/jhermsmeier/fints-institute-db/master?label=build)](https://travis-ci.org/jhermsmeier/fints-institute-db)

List of German Banks

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save fints-institute-db
```

## Usage

```js
var banks = require( 'fints-institute-db' )
```

```js
var dsgv = banks.filter( function( bank ) {
  return bank.organisation === 'DSGV'
})
```

## Format

```js
[
  ...,
  {
    "number": 11,
    "blz": "10030600",
    "bic": "GENODEF1OGK",
    "name": "Bankhaus Kruber",
    "location": "Berlin",
    "serviceProvider": "Fiducia & GAD IT AG",
    "organisation": "BVR",
    "hbciDomain": "hbci01.fiducia.de",
    "hbciAddress": null,
    "hbciVersion": "3.0",
    "pinTanURL": "https://hbci11.fiducia.de/cgi-bin/hbciservlet",
    "protocol": "FinTS V3.0",
    "updated": null,
    "ddv": false,
    "rdh1": false,
    "rdh2": false,
    "rdh3": false,
    "rdh4": false,
    "rdh5": false,
    "rdh6": false,
    "rdh7": true,
    "rdh8": false,
    "rdh9": true,
    "rdh10": true,
    "rah7": false,
    "rah9": false,
    "rah10": false
  },
  ...
]
```
