const util = require('../../core/util.js')
const _ = require('lodash')
const moment = require('moment')
const log = require('../../core/log')

const config = util.getConfig()

const dirs = util.dirs()

const QUERY_DELAY = 350
const BATCH_SIZE = 100
const SCAN_ITER_SIZE = 50000
const BATCH_ITER_SIZE = BATCH_SIZE * 10

const Fetcher = require(dirs.exchanges + 'gdax')
const retry = require(dirs.exchanges + '../exchangeUtils').retry

Fetcher.prototype.getTrades = function (sinceTid, callback) {
  const handle = (err, data) => {
    if (err) return callback(err)

    const result = _.map(data, function (trade) {
      return {
        tid: trade.trade_id,
        amount: parseFloat(trade.size),
        date: moment.utc(trade.time).format('X'),
        price: parseFloat(trade.price)
      }
    })

    callback(null, result.reverse())
  }

  const fetch = cb => this.gdax_public.getProductTrades(this.pair, { after: sinceTid, limit: BATCH_SIZE }, this.processResponse('getTrades', cb))
  retry(null, fetch, handle)
}

Fetcher.prototype.findFirstTrade = function (sinceTs, callback) {
  let currentId = 0
  const sinceM = moment(sinceTs).utc()

  log.info('Scanning for the first trade ID to start batching requests, may take a few minutes ...')

  const handle = (err, data) => {
    if (err) return callback(err)

    const m = moment.utc(_.first(data).time)
    const ts = m.valueOf()
    if (ts < sinceTs) {
      log.info(`First trade ID for batching found ${currentId - SCAN_ITER_SIZE}`)
      return callback(undefined, currentId - SCAN_ITER_SIZE)
    }

    currentId = _.first(data).trade_id
    log.debug(`Have trade id ${currentId} for date ${_.first(data).time} ${sinceM.from(m, true)} to scan`)

    const nextScanId = currentId - SCAN_ITER_SIZE
    if (nextScanId <= SCAN_ITER_SIZE) {
      currentId = BATCH_ITER_SIZE
      log.info(`First trade ID for batching found ${currentId}`)
      return callback(undefined, currentId)
    }

    setTimeout(() => {
      const fetch = cb => this.gdax_public.getProductTrades(this.pair, { after: nextScanId, limit: 1 }, this.processResponse('getTrades', cb))
      retry(null, fetch, handle)
    }, QUERY_DELAY)
  }

  const fetch = cb => this.gdax_public.getProductTrades(this.pair, { limit: 1 }, this.processResponse('getTrades', cb))
  retry(null, fetch, handle)
}

util.makeEventEmitter(Fetcher)

let end = false
let from = false

let batch = []
let batchId = false // Lowest ID for the current a batch

let lastId = false

let latestId = false
let latestMoment = false

const fetcher = new Fetcher(config.watch)

const fetch = () => {
  fetcher.import = true

  // We are in the sub-iteration step for a given batch
  if (lastId) {
    setTimeout(() => {
      fetcher.getTrades(lastId, handleFetch)
    }, QUERY_DELAY)
  } else {
    // We are running the first query, and need to find the starting batch
    const process = (err, firstBatchId) => {
      if (err) return handleFetch(err)

      batchId = firstBatchId
      fetcher.getTrades(batchId + 1, handleFetch)
    }
    fetcher.findFirstTrade(from.valueOf(), process)
  }
}

const handleFetch = (err, trades) => {
  if (err) {
    log.error(`There was an error importing from GDAX ${err}`)
    fetcher.emit('done')
    return fetcher.emit('trades', [])
  }

  if (trades.length) {
    batch = trades.concat(batch)

    const last = moment.unix(_.first(trades).date).utc()
    lastId = _.first(trades).tid

    const latestTrade = _.last(trades)
    if (!latestId || latestTrade.tid > latestId) {
      latestId = latestTrade.tid
      latestMoment = moment.unix(latestTrade.date).utc()
    }

    // still doing sub-iteration in the batch
    if (lastId >= (batchId - BATCH_ITER_SIZE) && last >= from) { return fetch() }
  }

  batchId += BATCH_ITER_SIZE
  lastId = batchId + 1

  if (latestMoment >= end) {
    fetcher.emit('done')
  }

  const endUnix = end.unix()
  const startUnix = from.unix()
  batch = _.filter(batch, t => t.date >= startUnix && t.date <= endUnix)

  fetcher.emit('trades', batch)
  batch = []
}

module.exports = function (daterange) {
  from = daterange.from.utc().clone()
  end = daterange.to.utc().clone()

  return {
    bus: fetcher,
    fetch: fetch
  }
}
