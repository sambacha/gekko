const Bitfinex = require('bitfinex-api-node')
const util = require('../../core/util.js')
const _ = require('lodash')
const moment = require('moment')
const log = require('../../core/log')

const config = util.getConfig()

const dirs = util.dirs()

const Fetcher = require(dirs.exchanges + 'bitfinex')
const retry = require(dirs.exchanges + '../exchangeUtils').retry

Fetcher.prototype.getTrades = function (upto, callback, descending) {
  const handle = (err, data) => {
    if (err) return callback(err)

    var trades = []
    if (_.isArray(data)) {
      trades = _.map(data, function (trade) {
        return {
          tid: trade.ID,
          date: moment(trade.MTS).format('X'),
          price: +trade.PRICE,
          amount: +Math.abs(trade.AMOUNT)
        }
      })
    }

    callback(null, descending ? trades : trades.reverse())
  }

  let path = 'trades/t' + this.pair + '/hist'
  if (upto) {
    const start = moment(upto).subtract(1, 'd').valueOf()
    const end = moment(upto).valueOf()
    path += `?limit=1000&start=${start}&end=${end}`
  }

  log.debug('Querying trades with: ' + path)
  const fetch = cb => this.bitfinex.makePublicRequest(path, this.handleResponse('getTrades', cb))
  retry(null, fetch, handle)
}

util.makeEventEmitter(Fetcher)

var end = false
var from = false

var lastTimestamp = false
var lastId = false

var batch = []
var batchStart = false
var batchEnd = false

const SCANNING_STRIDE = 24
const ITERATING_STRIDE = 2
var stride = ITERATING_STRIDE

var fetcher = new Fetcher(config.watch)
fetcher.bitfinex = new Bitfinex(null, null, { version: 2, transform: true }).rest

var fetch = () => {
  fetcher.import = true

  if (lastTimestamp) {
    // We need to slow this down to prevent hitting the rate limits
    setTimeout(() => {
      // make sure we fetch with overlap from last batch
      const since = lastTimestamp - 1000
      fetcher.getTrades(since, handleFetch)
    }, 2500)
  } else {
    lastTimestamp = from.valueOf()
    batchStart = moment(from)
    batchEnd = moment(from).add(stride, 'h')

    fetcher.getTrades(batchEnd, handleFetch)
  }
}

var handleFetch = (err, trades) => {
  if (err) {
    log.error(`There was an error importing from Bitfinex ${err}`)
    fetcher.emit('done')
    return fetcher.emit('trades', [])
  }

  trades = _.filter(trades, t => !lastId || t.tid < lastId)

  if (trades.length) {
    stride = ITERATING_STRIDE
    batch = trades.concat(batch)
    var last = moment.unix(_.first(trades).date)
    lastTimestamp = last.valueOf()
    lastId = _.first(trades).tid
  } else {
    stride = SCANNING_STRIDE
    lastTimestamp = moment(lastTimestamp)
      .subtract(stride, 'h')
      .valueOf()
  }

  // if we're not done the batch we need to refetch
  if (trades.length && moment(lastTimestamp) >= batchStart) {
    return fetch()
  }

  var lastBatch = batch

  // in this case we've finished the last batch and are complete
  if (batchEnd.isSame(end)) {
    fetcher.emit('done')
  } else {
    // the batch if complete, lets advance to the next set
    lastId = false
    batch = []
    batchStart = moment(batchEnd)
    batchEnd = moment(batchEnd).add(stride, 'h')

    if (batchEnd > end) batchEnd = moment(end)

    lastTimestamp = batchEnd.valueOf()
  }

  fetcher.emit('trades', lastBatch)
}

module.exports = function (daterange) {
  from = daterange.from.clone()
  end = daterange.to.clone()

  return {
    bus: fetcher,
    fetch: fetch
  }
}
