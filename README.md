# FinTS Institute DB
[![npm](https://img.shields.io/npm/v/fints-institute-db.svg?style=flat-square)](https://npmjs.com/package/fints-institute-db)
[![npm license](https://img.shields.io/npm/l/fints-institute-db.svg?style=flat-square)](https://npmjs.com/package/fints-institute-db)
[![npm downloads](https://img.shields.io/npm/dm/fints-institute-db.svg?style=flat-square)](https://npmjs.com/package/fints-institute-db)
[![build status](https://img.shields.io/travis/jhermsmeier/fints-institute-db/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/fints-institute-db)

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
    "number": 26,
    "blz": "12030000",
    "name": "Deutsche Kreditbank Berlin (DKB) AG",
    "location": "Berlin ",
    "serviceProvider": "Finanz Informatik GmbH & Co. KG",
    "organisation": "DSGV",
    "hbciDomain": "banking.s-fints-pt-dkb.de",
    "hbciAddress": null,
    "hbciVersion": "3.0",
    "pinTanURL": "https://banking-dkb.s-fints-pt-dkb.de/fints30",
    "protocol": "FinTS V3.0",
    "updated": "2016-07-09T00:00:00.000Z",
    "ddv": true,
    "rdh1": false,
    "rdh2": false,
    "rdh3": false,
    "rdh4": false,
    "rdh5": false,
    "rdh6": false,
    "rdh7": false,
    "rdh8": false,
    "rdh9": false,
    "rdh10": false,
    "rah7": true,
    "rah9": false,
    "rah10": false
  },
  ...
]
```
