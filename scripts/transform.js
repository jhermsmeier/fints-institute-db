var stream = require( 'stream' )
var fs = require( 'fs' )
var path = require( 'path' )
var csvParser = require( 'csv-parser' )

function formatKey( key ) {
  switch( key ) {
    case 'Nr.': return 'number'
    case 'BLZ': return 'blz'
    case 'Institut': return 'institute'
    case 'Ort': return 'location'
    case 'RZ': return 'rz'
    case 'Organisation': return 'organisation'
    case 'HBCI-Zugang DNS': return 'hbciDomain'
    case 'HBCI- Zugang     IP-Adresse': return 'hbciAddress'
    case 'HBCI-Version': return 'hbciVersion'
    case 'DDV': return 'ddv'
    case 'RDH-1': return 'rdh1'
    case 'RDH-2': return 'rdh2'
    case 'RDH-3': return 'rdh3'
    case 'RDH-4': return 'rdh4'
    case 'RDH-5': return 'rdh5'
    case 'RDH-6': return 'rdh6'
    case 'RDH-7': return 'rdh7'
    case 'RDH-8': return 'rdh8'
    case 'RDH-9': return 'rdh9'
    case 'RDH-10': return 'rdh10'
    case 'RAH-7': return 'rah7'
    case 'RAH-9': return 'rah9'
    case 'RAH-10': return 'rah10'
    case 'PIN/TAN-Zugang URL': return 'pinTanURL'
    case 'Version': return 'protocol'
    case 'Datum letzte Änderung': return 'updated'
    case '': return ''
    default:
      throw new Error( `Unknown key "${key}"` )
  }
}

function getDate( value ) {
  var pattern = /(\d{1,2})\.(\d{1,2})\.(\d{4})/
  var match = pattern.exec( value )
  return match == null ? match :
    new Date( Date.UTC( +match[3], +match[2] - 1, +match[1] ) )
}

function Institute( data ) {

  this.number = +data.number

  this.blz = data.blz || null
  this.name = data.institute || null
  this.location = data.location || null
  this.serviceProvider = data.rz === 'eigenes Rechenzentrum' ?
    this.institute : ( data.rz || null )
  this.organisation = data.organisation || null

  this.hbciDomain = data.hbciDomain || null
  this.hbciAddress = data.hbciAddress === 'nicht unterstützt' ?
    null : ( data.hbciAddress || null )
  this.hbciVersion = data.hbciVersion || null

  this.pinTanURL = data.pinTanURL || null
  this.protocol = data.protocol || null
  this.updated = getDate( data.updated )

  this.ddv = data.ddv === 'ja'
  this.rdh1 = data.rdh1 === 'ja'
  this.rdh2 = data.rdh2 === 'ja'
  this.rdh3 = data.rdh3 === 'ja'
  this.rdh4 = data.rdh4 === 'ja'
  this.rdh5 = data.rdh5 === 'ja'
  this.rdh6 = data.rdh6 === 'ja'
  this.rdh7 = data.rdh7 === 'ja'
  this.rdh8 = data.rdh8 === 'ja'
  this.rdh9 = data.rdh9 === 'ja'
  this.rdh10 = data.rdh10 === 'ja'
  this.rah7 = data.rah7 === 'ja'
  this.rah9 = data.rah9 === 'ja'
  this.rah10 = data.rah10 === 'ja'

}

var source = path.join( __dirname, '..', 'src', 'fints_institute.csv' )
var destination = path.join( __dirname, '..', 'fints-institutes.json' )

var readStream = fs.createReadStream( source, { encoding: 'latin1' })
var writeStream = fs.createWriteStream( destination )
var parser = csvParser({
  separator: ';',
})

var mapKeys = new stream.Transform({
  objectMode: true,
  transform( data, _, next ) {

    var keys = Object.keys( data )
    var result = {}

    keys.reduce( function( result, key ) {
      result[ formatKey( key ) ] = data[key]
      return result
    }, result )

    this.push( result )
    next()

  }
})

var transform = new stream.Transform({
  objectMode: true,
  transform( data, _, next ) {
    if( !data.blz ) return next()
    this.push( new Institute( data ) )
    next()
  }
})

var formatter = new stream.Transform({
  objectMode: true,
  transform( institute, _, next ) {
    if( !this.firstRow ) {
      this.firstRow = true
      this.push( '[\n' )
    } else {
      this.push( ',\n' )
    }
    this.push( '  ' + JSON.stringify( institute ) )
    next()
  },
  flush( done ) {
    this.push( '\n]' )
    done()
  }
})

formatter.firstRow = false

readStream
  .pipe( parser )
  .pipe( mapKeys )
  .pipe( transform )
  .pipe( formatter )
  .pipe( writeStream )
