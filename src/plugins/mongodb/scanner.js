const async = require('async')
var _ = require('lodash')

var util = require('../../core/util.js')
var handle = require('./handle')

module.exports = done => {
  this.db = handle

  const markets = []
  async.waterfall([
    (cb) => {
      handle.getCollectionNames(cb)
    },
    (collections, cb) => {
      async.each(collections, (collection, cb) => {
        const [exchange, type] = collection.split('_')
        if (type === 'candles') {
          handle.collection(collection).distinct('pair', {}, (err, pairs) => {
            if (err) {
              console.error(err)
              return util.die(err.message)
            }
            console.log(exchange)
            pairs.forEach((pair) => {
              pair = pair.split('_')
              markets.push({
                exchange: exchange,
                currency: _.first(pair),
                asset: _.last(pair)
              })
            })
            cb()
          })
        } else {
          cb()
        }
      }, () => {
        cb(null, markets)
      })
    }
  ], done)
}
