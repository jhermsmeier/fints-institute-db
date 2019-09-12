var path = require( 'path' )
var fs = require( 'fs' )
var stream = require( 'stream' )
var { StringDecoder } = require( 'string_decoder' )

function formatKey( key ) {
  switch( key ) {
    case 'Nr.': return 'number'
    case 'BLZ': return 'blz'
    case 'BIC': return 'bic'
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

class Institute {
  constructor( data ) {

    this.number = +data.number

    this.blz = data.blz || null
    this.bic = data.bic || null
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
}

class Parser extends stream.Transform {

  constructor( options ) {

    options = options || {}
    options.readableObjectMode = true

    super( options )

    this.header = null
    this.decoder = new StringDecoder( 'utf8' )
    this.lineBuffer = ''

  }

  _splitLines() {

    var eol = '\r\n'
    var index = -1
    var offset = 0
    var row = null
    var data = null

    while( ( index = this.lineBuffer.indexOf( eol, offset ) ) >= 0 ) {

      row = this.lineBuffer.slice( offset, index ).split( '\t' )

      if( this.header == null ) {
        this.header = row
      } else {
        data = new Institute( row.reduce(( data, value, i ) => {
          data[ formatKey( this.header[i] ) ] = value
          return data
        }, {}) )
        this.push( data )
      }

      offset = index + eol.length

    }

    return offset

  }

  _transform( chunk, encoding, next ) {
    this.lineBuffer += this.decoder.write( chunk )
    this.lineBuffer = this.lineBuffer.slice( this._splitLines() )
    next()
  }

  _flush( done ) {
    if( !this.lineBuffer.length ) return done()
    this.lineBuffer += this.decoder.end()
    this.lineBuffer = this.lineBuffer.slice( this._splitLines() )
    done()
  }

}

class Formatter extends stream.Transform {

  constructor( options ) {

    options = options || {}
    options.writableObjectMode = true

    super( options )

    this.firstRow = true

  }

  _transform( value, _, next ) {
    this.push( this.firstRow ? '[\n' : ',\n' )
    this.firstRow = false
    this.push( '  ' + JSON.stringify( value ) )
    next()
  }

  _flush( done ) {
    this.push( '\n]\n' )
    done()
  }

}

var source = path.join( __dirname, '..', 'src', 'fints_institute.tsv' )
var destination = path.join( __dirname, '..', 'fints-institutes.json' )

fs.createReadStream( source )
  .pipe( new Parser() )
  .pipe( new Formatter() )
  .pipe( fs.createWriteStream( destination ) )
