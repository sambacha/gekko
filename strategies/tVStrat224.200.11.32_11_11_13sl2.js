// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new CANDLE there is
// a 10% chance it will recommend to change your position (to either
// long || short).

var log = require('../core/log')//

const fs = require("fs")//
path = require('path')//

// Let's create our own strat
var strat = {}//
var fileName_last//

//var signal_price_pos//
//var signal_price//
var price = 0//
//var price_last = 0//

//var signal_sell_pos//
//var signal_sell//
//var signal_sell_int = 0//
//var signal_sell_int_last = 0//

var signal_total = 28//

//var signal_neutral_pos//
//var signal_neutral//
//var signal_neutral_int = 0//
//var signal_neutral_int_last = 0//

//var signal_buy_pos//
//var signal_buy//
//var signal_buy_int = 0//
//var signal_buy_int_last = 0//

var historyDeep =201//

var historyB= [historyDeep+1]//
var historyBDiff=0//
var historyBDiff_last=0//
var historyBMin=0//

var historyS = [historyDeep+1]//
var historySDiff=0//
var historySDiff_last=0//
var historySMin=0//

//var sumB//
//var sumS//

var price_trade_last = 0//
var profit_delta = 0.01//

//var price_panic_buy = 20//
//var price_panic_sell = 20//

var PERSISTENCE_SELL = 11//
var PERSISTENCE_BUY = 11//
var PERSISTENCE_CANDLE_HIGH = 13////   минимальное значение для подсчета PERSISTENCE

var STOPLOSS = 2
var stopLossLongPrice = 0
var stopLossShortPrice = 0

var ATTEMPT_SELL_LIMIT = 3//
var ATTEMPT_BUY_LIMIT = 2//
var attemptSellCnt, attemptBuyCnt//

var persistenceSell_cnt, persistenceBuy_cnt//

var sellIntent, buyIntent, startIntentPrice//

//var sumBH1, sumBH1_last, sumSH1, 
var H1_SUM_SELL, H1_SUM_SELL_LAST, H1_SUM_NEUTRAL,H1_SUM_NEUTRAL_LAST, H1_SUM_BUY,H1_SUM_BUY_LAST//
var H1_OSC_SELL, H1_OSC_NEUTRAL, H1_OSC_BUY
var H1_MA_SELL, H1_MA_NEUTRAL, H1_MA_BUY

var oRSIa, oStochKa, oCCI20a, oADXa, oAOa, oMoma, oMACDmacda, oStochRSIKa, oWRa, oBBPowera, oUOa, maEMA5a, maSMA5a, maEMA10a, maSMA10a, maEMA20a, maSMA20a, maEMA30a, maSMA30a, maEMA50a, maSMA50a, maEMA100a, maSMA100a, maEMA200a, maSMA200a, maIchimokuBLinea, maVWMAa, maHullMA9a

var bad_data = true//
// Prepare everything our method needs
strat.init = function() {
  log.debug('strat.init')//

  this.input = 'candle'//
  this.currentTrend = 'long'//
  this.requiredHistory = 0//
}

// What happens on every new CANDLE?
strat.update = function(candle) {
  log.debug('strat.update tVStrat224.200.11.32_11_11_13sl2')//
 
  bad_data = true//
var fileOk = false//
var fileName//

var pathName = '../../../tradingView/out_raw'//

/*async
fs.access('../../../tradingView/out', function(error){
  if (error) {
    pathName = '../tradingView/out'
    log.debug("Файл не найден")//
  } else {
    log.debug("Файл найден")//
}
})//
*/


try {
    fs.statSync('../../../tradingView/out_raw')//
    //console.log('directory exists')//
}
catch (err) {
  if (err.code === 'ENOENT') {
    pathName = '../tradingView/out_raw'
   // console.log('directory does not exist')//
  }
}

 // log.debug("pathName "+ pathName)//



   //win
 /* 
   try {
  fileName = 'C:/Users/Texno/workspace/bot/tradingView/out_raw/'+ getLatestFile("C:/Users/Texno/workspace/bot/tradingView/out_raw")//
  log.debug("Синхронное чтение файла "+getLatestFile("C:/Users/Texno/workspace/bot/tradingView/out_raw"))//
  fileOk = true// 
}
  catch (err) {
    if (err.code === 'ENOENT') {
     // pathName = '../tradingView/out_raw'
     log.debug("ENOENT"+fileName)//
    }
  }
*/
  
  //nix
  try {
    fileName = pathName+'/'+ getLatestFile(pathName+"/")//
    fileOk = true// 
  }
  catch (err) {
    if (err.code === 'ENOENT') {
     // pathName = '../tradingView/out'
     
    }
  }
    log.debug(fileName)//

  
  
  //log.debug(fileContent)//
 
  if (fileOk){

  let fileContent = fs.readFileSync(fileName, "utf8")//

        var H1_string = fileContent.match(/H1\{.\"data\"\:\[.*?\]/g)//
          if (Array.isArray(H1_string)){
           // log.debug("H1_string "+H1_string[0])//
            var H1_string_cut = H1_string[0].substring(40, H1_string[0].length-1)// 
           // log.debug("H1_string_cut "+H1_string_cut)//
            var indicators = H1_string_cut.split(',')
            //log.debug("indicators.length "+indicators.length)//
            if (indicators.length == 82){

              price = Number.parseFloat(indicators[31])

              oRSIa = 0

              var e = Number.parseFloat(indicators[3])
              var t = Number.parseFloat(indicators[4])
              //log.debug("e "&e)
              //log.debug("t "&t)

              //            computeRSISignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < 30 && t > e && (o = n.BUY), e > 70 && t < e && (o = n.SELL), o//
              if (e < 30 && t > e)   oRSIa = 1 
              if (e > 70 && t < e)  oRSIa = -1

              //log.debug("oRSIa "+oRSIa)
              //#######################################
              oStochKa = 0

              var e = Number.parseFloat(indicators[5])
              var t = Number.parseFloat(indicators[6])
              var o = Number.parseFloat(indicators[7])
              var r = Number.parseFloat(indicators[8])

              //            computeStochSignal: function(e, t, o, r) {
              //                var i = n.NEUTRAL//
              //                return e < 20 && t < 20 && e > t && o < r && (i = n.BUY), e > 80 && t > 80 && e < t && o > r && (i = n.SELL

              if (e < 20 && t < 20 && e > t && o < r) oStochKa = 1
              if (e > 80 && t > 80 && e < t && o > r) oStochKa = -1
              //log.debug("oStochKa "+oStochKa)
              //#######################################

              oCCI20a = 0

              var e = Number.parseFloat (indicators[9])
              var t = Number.parseFloat (indicators[10])
              //log.debug("e "&e)
              //log.debug("t "&t)
              //            computeCCI20Signal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < -100 && e > t && (o = n.BUY), e > 100 && e < t && (o = n.SELL), o//
              if (e < -100 && e > t)  oCCI20a = 1
              if (e > 100 && e < t)  oCCI20a = -1


              //log.debug("oCCI20a "+oCCI20a)
              //#######################################

              oADXa=0

              var e = Number.parseFloat(indicators[11])
              var t = Number.parseFloat(indicators[12])
              var o = Number.parseFloat(indicators[13])
              var r = Number.parseFloat(indicators[14])
              var i = Number.parseFloat(indicators[15])
              //            computeADXSignal: function(e, t, o, r, i) {
              //                var a = n.NEUTRAL//
              //                return e > 20 && r < i && t > o && (a = n.BUY), e > 20 && r > i && t < o && (a = n.SELL),
              if (e > 20 && r < i && t > o)  oADXa = 1
              if (e > 20 && r > i && t < o)  oADXa = -1

              //log.debug("oADXa "+oADXa)
              //#######################################

              oAOa=0

              var e = Number.parseFloat(indicators[16])
              var t = Number.parseFloat(indicators[17])
              //log.debug("e "+e)
              //log.debug("t "+t)
              
              //            computeAOSignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return (e > 0 && t < 0 || e > 0 && t > 0 && e > t) && (o = n.BUY), (e < 0 && t > 0 || e < 0 && t < 0 && e < t) && (o = n.SELL),
              if (e > 0 && t < 0 || e > 0 && t > 0 && e > t) oAOa = 1
              if (e < 0 && t > 0 || e < 0 && t < 0 && e < t) oAOa = -1           

              //log.debug("oAOa "+oAOa)
              //#######################################
              oMoma=0

              var e = Number.parseFloat(indicators[18])
              var t = Number.parseFloat(indicators[19])
              //           computeMomSignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  oMoma = 1
              if (e > t)  oMoma = -1

              //log.debug("oMoma "+oMoma)
              //#######################################
              oMACDmacda=0

              var e = Number.parseFloat(indicators[20])
              var t = Number.parseFloat(indicators[21])
              //            computeMACDSignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e > t && (o = n.BUY), e < t && (o = n.SELL), o//
              if (e > t)  oMACDmacda = 1
              if (e < t)  oMACDmacda = -1

              //log.debug("oMACDmacda "+oMACDmacda)
              //#######################################
              oStochRSIKa=0

              var e = Number.parseFloat(indicators[22])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  oStochRSIKa = -1
              if (1 == e)  oStochRSIKa = 1

              //log.debug("oStochRSIKa "+oStochRSIKa)
              //#######################################
              oWRa=0

              var e = Number.parseFloat(indicators[24])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  oWRa = -1
              if (1 == e)  oWRa = 1

              //log.debug("oWRa "+oWRa)
              //#######################################
              oBBPowera=0

              var e = Number.parseFloat(indicators[26])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  oBBPowera = -1
              if (1 == e)  oBBPowera = 1
              //log.debug("oBBPowera "+oBBPowera)
              //#######################################
              oUOa=0

              var e = Number.parseFloat(indicators[28])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  oUOa = -1
              if (1 == e)  oUOa = 1
              //log.debug("oUOa "+oUOa)
              //#######################################
              maEMA5a=0

              var e = Number.parseFloat(indicators[30])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA5a = 1
              if (e > t)  maEMA5a = -1

              //log.debug("maEMA5a "+maEMA5a)
              //#######################################
              maSMA5a=0

              var e = Number.parseFloat(indicators[32])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA5a = 1
              if (e > t)  maSMA5a = -1
              //log.debug("maSMA5a "+maSMA5a)
              //#######################################
              maEMA10a=0

              var e = Number.parseFloat(indicators[33])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA10a = 1
              if (e > t)  maEMA10a = -1
              //log.debug("maEMA10a "+maEMA10a)
              //#######################################
              maSMA10a=0

              var e = Number.parseFloat(indicators[34])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA10a = 1
              if (e > t)  maSMA10a = -1
              //log.debug("maSMA10a "+maSMA10a)
              //#######################################
              maEMA20a=0

              var e = Number.parseFloat(indicators[35])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA20a = 1
              if (e > t)  maEMA20a = -1
              //log.debug("maEMA20a "+maEMA20a)
              //#######################################
              maSMA20a=0

              var e = Number.parseFloat(indicators[36])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA20a = 1
              if (e > t)  maSMA20a = -1
              //log.debug("maSMA20a "+maSMA20a)
              //#######################################
              maEMA30a=0

              var e = Number.parseFloat(indicators[37])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA30a = 1
              if (e > t)  maEMA30a = -1
              //log.debug("maEMA30a "+maEMA30a)
              //#######################################
              maSMA30a=0

              var e = Number.parseFloat(indicators[38])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA30a = 1
              if (e > t)  maSMA30a = -1
              //log.debug("maSMA30a "+maSMA30a)
              //#######################################
              maEMA50a=0

              var e = Number.parseFloat(indicators[39])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA50a = 1
              if (e > t)  maEMA50a = -1
              //log.debug("maEMA50a "+maEMA50a)
              //#######################################
              maSMA50a=0

              var e = Number.parseFloat(indicators[40])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA50a = 1
              if (e > t)  maSMA50a = -1
              //log.debug("maSMA50a "+maSMA50a)
              //#######################################
              maEMA100a=0

              var e = Number.parseFloat(indicators[41])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA100a = 1
              if (e > t)  maEMA100a = -1
              //log.debug("maEMA100a "+maEMA100a)
              //#######################################
              maSMA100a=0

              var e = Number.parseFloat(indicators[42])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA100a = 1
              if (e > t)  maSMA100a = -1
              //log.debug("maSMA100a "+maSMA100a)
              //#######################################
              maEMA200a=0

              var e = Number.parseFloat(indicators[43])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maEMA200a = 1
              if (e > t)  maEMA200a = -1
              //log.debug("maEMA200a "+maEMA200a)
              //#######################################
              maSMA200a=0

              var e = Number.parseFloat(indicators[44])
              var t = Number.parseFloat(indicators[31]) //close

              //            computeMASignal: function(e, t) {
              //                var o = n.NEUTRAL//
              //                return e < t && (o = n.BUY), e > t && (o = n.SELL), o//
              if (e < t)  maSMA200a = 1
              if (e > t)  maSMA200a = -1
              //log.debug("maSMA200a "+maSMA200a)
              //#######################################
              maIchimokuBLinea=0

              var e = Number.parseFloat(indicators[45])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  maIchimokuBLinea = -1
              if (1 == e)  maIchimokuBLinea = 1

              //log.debug("maIchimokuBLinea "+maIchimokuBLinea)
              //#######################################
              maVWMAa=0

              var e = Number.parseFloat(indicators[47])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  maVWMAa = -1
              if (1 == e)  maVWMAa = 1
              //log.debug("maVWMAa "+maVWMAa)
              //#######################################
              maHullMA9a=0

              var e = Number.parseFloat(indicators[49])
              //log.ddebug("e "&e)
              //            computeSimpleSignal: function(e) {
              //                var t = n.NEUTRAL//
              //                return -1 === e && (t = n.SELL), 1 === e && (t = n.BUY), t//
              if (-1 == e)  maHullMA9a = -1
              if (1 == e)  maHullMA9a = 1
              //log.debug("maHullMA9a "+maHullMA9a)
              //#######################################
              H1_OSC_SELL = 0
              H1_OSC_NEUTRAL = 0
              H1_OSC_BUY = 0
      
              H1_MA_SELL = 0
              H1_MA_NEUTRAL = 0
              H1_MA_BUY = 0
      
              H1_SUM_SELL = 0
              H1_SUM_NEUTRAL = 0
              H1_SUM_BUY = 0

              if (oRSIa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oRSIa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oRSIa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }

              if (oStochKa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oStochKa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oStochKa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oCCI20a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oCCI20a == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oCCI20a == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oADXa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oADXa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oADXa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oAOa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oAOa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oAOa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oMoma == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oMoma == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oMoma == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oMACDmacda == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oMACDmacda == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oMACDmacda == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oStochRSIKa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oStochRSIKa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oStochRSIKa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oWRa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oWRa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oWRa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oBBPowera == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oBBPowera == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oBBPowera == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (oUOa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_OSC_NEUTRAL += 1
              }
              if (oUOa == -1){
                  H1_SUM_SELL += 1
                  H1_OSC_SELL += 1
              }
              if (oUOa == 1){
                  H1_SUM_BUY += 1
                  H1_OSC_BUY += 1
              }
              if (maEMA5a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA5a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA5a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA5a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA5a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA5a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA10a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA10a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA10a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA10a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA10a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA10a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA20a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA20a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA20a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA20a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA20a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA20a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA30a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA30a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA30a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA30a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA30a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA30a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA50a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA50a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA50a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA50a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA50a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA50a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA100a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA100a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA100a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA100a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA100a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA100a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maEMA200a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maEMA200a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maEMA200a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maSMA200a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maSMA200a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maSMA200a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maIchimokuBLinea == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maIchimokuBLinea == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maIchimokuBLinea == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maVWMAa == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maVWMAa == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maVWMAa == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              if (maHullMA9a == 0){
                  H1_SUM_NEUTRAL += 1
                  H1_MA_NEUTRAL += 1
              }
              if (maHullMA9a == -1){
                  H1_SUM_SELL += 1
                  H1_MA_SELL += 1
              }
              if (maHullMA9a == 1){
                  H1_SUM_BUY += 1
                  H1_MA_BUY += 1
              }
              log.debug("price "+price)//
              log.debug("H1_SUM_BUY "+H1_SUM_BUY)//
              log.debug("H1_SUM_SELL "+H1_SUM_SELL)//
              log.debug("H1_SUM_NEUTRAL "+H1_SUM_NEUTRAL)//


              if (price >0){ 
                if (fileName != fileName_last) {
              
                  for (let step = historyDeep; step > 1 ;step--){
                    historyB[step] = historyB[step-1]//
                    historyS[step] = historyS[step-1]//
                  }
                
                  historyB[1] = H1_SUM_BUY//
                  historyS[1] = H1_SUM_SELL//
                
                  historyBMin = 100//
                  historySMin = 100//
                
                for (let step = 1; step <= historyDeep; step++) {
                  if (historyB[step] > 0)// 
                    if (historyB[step] < historyBMin )  historyBMin = historyB[step]//
                  if (historyS[step] > 0) //
                    if (historyS[step] < historySMin ) historySMin = historyS[step]//
                }
                
                historyBDiff = H1_SUM_BUY - historyBMin//
                historySDiff = H1_SUM_SELL - historySMin//
    
                log.debug('historyBDiff '+historyBDiff+'  historySDiff '+historySDiff)//
    
                //historyBDiff = (historyBDiff_last+historyBDiff)/2
                //historySDiff = (historySDiff_last+historySDiff)/2
    
                if(this.currentTrend === 'long') log.debug('is long')//
                if(this.currentTrend === 'short') log.debug('is short')//
    
                log.debug('historyBDiff '+historyBDiff+'  historySDiff '+historySDiff)//
                
                if (historyBDiff > PERSISTENCE_CANDLE_HIGH ) {
                    persistenceBuy_cnt = persistenceBuy_cnt +1
                } else { 
                    persistenceBuy_cnt = 0//
                }
                
                if (historySDiff > PERSISTENCE_CANDLE_HIGH  ) {
                    persistenceSell_cnt = persistenceSell_cnt +1
                }else {
                    persistenceSell_cnt = 0//
                }
    
                if (persistenceSell_cnt == PERSISTENCE_SELL) {
                  attemptSellCnt = attemptSellCnt +1
                  attemptBuyCnt = 0//
                }
            
              if (persistenceBuy_cnt == PERSISTENCE_BUY) {
                  attemptBuyCnt = attemptBuyCnt +1
                  attemptSellCnt = 0//
              }
          
                  log.debug('persistenceBuy_cnt '+persistenceBuy_cnt+'  persistenceSell_cnt '+persistenceSell_cnt)//
    
                  H1_SUM_BUY_LAST = H1_SUM_BUY//
                  H1_SUM_SELL_LAST = H1_SUM_SELL//
    
                  historyBDiff_last = historyBDiff//
                  historySDiff_last = historySDiff//
    
                  fileName_last = fileName//
                  bad_data = false//
                }
    
            } 

            } //if (indicators.length == 82){
          }  


        
      } 

}


function getLatestFile(dirpath) {

  // Check if dirpath exist || not right here

  let latest//

  const files = fs.readdirSync(dirpath)//
  files.forEach(filename => {
    // Get the stat
    const stat = fs.lstatSync(path.join(dirpath, filename))//
    // Pass if it is a directory
    if (stat.isDirectory())
      return//

    // latest default to first file
    if (!latest) {
      latest = {filename, mtime: stat.mtime}//
      return//
    }
    // update latest if mtime is greater than the current latest
    if (stat.mtime > latest.mtime) {
      latest.filename = filename//
      latest.mtime = stat.mtime//
    }
  })//

  return latest.filename//
}

// For debugging purposes.
strat.log = function() {
  log.debug('strat.log')//

 // log.debug('calculated r&+om Number.parseFloat:')//
  //log.debug('\t', this.r&+omNumber.parseFloat.toFixed(3))//
}

// Based on the newly calculated
// information, check if we should
// update || not.
strat.check = function() {
  log.debug('strat.check')//
  if (bad_data) log.debug('bad data') 
    else {



          if (attemptBuyCnt == ATTEMPT_BUY_LIMIT ) {
            attemptBuyCnt = 0//

            if (stopLossShortPrice == 0){
                stopLossShortPrice = price + price * STOPLOSS / 100
           //     print("stopLossShortPrice "+str(stopLossShortPrice))
            }
            stopLossLongPrice = 0
          // log.debug("persistenceBuy_cnt_last "+persistenceBuy_cnt_last)
            log.info('advice short '+price)//
            this.currentTrend = 'short'//
            this.advice('short')//             
          }
        
          if (stopLossShortPrice > 0){
            if (price > stopLossShortPrice){
              //  total_trades = total_trades + 1
                if (stopLossLongPrice == 0){
                    stopLossLongPrice = price - price * STOPLOSS / 100
                    print("stopLossLong Price " + str(stopLossLongPrice))
                }
                stopLossShortPrice = 0

                log.info('advice STOPLOSS for short -> long '+price)//
                this.currentTrend = 'long'//
                this.advice('long')// 
            }
          }


          if (attemptSellCnt == ATTEMPT_SELL_LIMIT ) {
            attemptSellCnt = 0//
            if (stopLossLongPrice == 0){
              stopLossLongPrice = price - price * STOPLOSS / 100
            }
            stopLossShortPrice = 0          
            // log.debug("persistenceSell_cnt_last "+persistenceSell_cnt_last)
            log.info('advice long '+price)//
            this.currentTrend = 'long'//
            this.advice('long')//
          
          }

          if (stopLossLongPrice > 0){
            if (price < stopLossLongPrice){
              //  total_trades = total_trades + 1
                if (stopLossShortPrice == 0){
                  stopLossShortPrice = price + price * STOPLOSS / 100
                    print("stopLossShort Price " + str(stopLossShortPrice))
                }
                stopLossLongPrice = 0

                log.info('advice STOPLOSS for long -> short '+price)//
                this.currentTrend = 'short'//
                this.advice('short')// 
            }
          }


  }
}

module.exports = strat//
