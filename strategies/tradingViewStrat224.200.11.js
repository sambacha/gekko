// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');

const fs = require("fs");
path = require('path');

// Let's create our own strat
var strat = {};
var fileName_last;

var signal_price_pos;
var signal_price;
var signal_price_int = 0;
//var signal_price_int_last = 0;

var signal_sell_pos;
var signal_sell;
var signal_sell_int = 0;
var signal_sell_int_last = 0;

var signal_total = 28;

var signal_neutral_pos;
var signal_neutral;
var signal_neutral_int = 0;
var signal_neutral_int_last = 0;

var signal_buy_pos;
var signal_buy;
var signal_buy_int = 0;
var signal_buy_int_last = 0;

var historyDeep =201;

var historyB= [historyDeep+1];
var historyBDiff=0;
var historyBDiff_last=0;
var historyBMin=0;

var historyS = [historyDeep+1];
var historySDiff=0;
var historySDiff_last=0;
var historySMin=0;

//var sumB;
//var sumS;

var price_trade_last = 0;
var profit_delta = 0.01;

//var price_panic_buy = 20;
//var price_panic_sell = 20;

var PERSISTENCE_SELL = 25;
var PERSISTENCE_BUY = 25;
var PERSISTENCE_CANDLE_HIGH = 9;//   минимальное значение для подсчета PERSISTENCE

var ATTEMPT_SELL_LIMIT = 4;
var ATTEMPT_BUY_LIMIT = 4;
var attemptSellCnt, attemptBuyCnt;

var persistenceSell_cnt, persistenceBuy_cnt;

var sellIntent, buyIntent, startIntentPrice;

//var sumBH1, sumBH1_last, sumSH1, 
var H1_SUM_SELL, H1_SUM_SELL_LAST, H1_SUM_NEUTRAL,H1_SUM_NEUTRAL_LAST, H1_SUM_BUY,H1_SUM_BUY_LAST;



var bad_data = true;
// Prepare everything our method needs
strat.init = function() {
  log.debug('strat.init');

  this.input = 'candle';
  this.currentTrend = 'long';
  this.requiredHistory = 0;
}

// What happens on every new candle?
strat.update = function(candle) {
  log.debug('strat.update tradingViewStrat224.200.11');
 
  bad_data = true;
var fileOk = false;
var fileName;

var pathName = '../../../tradingView/out';

/*async
fs.access('../../../tradingView/out', function(error){
  if (error) {
    pathName = '../tradingView/out'
    log.debug("Файл не найден");
  } else {
    log.debug("Файл найден");
}
});
*/


try {
    fs.statSync('../../../tradingView/out');
    //console.log('directory exists');
}
catch (err) {
  if (err.code === 'ENOENT') {
    pathName = '../tradingView/out'
   // console.log('directory does not exist');
  }
}

 // log.debug("pathName "+ pathName);



   //win
  /*
   try {
  fileName = 'C:/YandexDisk/tradingview/out/'+ getLatestFile("C:/YandexDisk/tradingview/out");
  log.debug("Синхронное чтение файла "+getLatestFile("C:/YandexDisk/tradingview/out"));
  fileOk = true; 
}
  catch (err) {
    if (err.code === 'ENOENT') {
     // pathName = '../tradingView/out'
     
    }
  }
*/
  
  //nix
  try {
    fileName = pathName+'/'+ getLatestFile(pathName+"/");
    fileOk = true; 
  }
  catch (err) {
    if (err.code === 'ENOENT') {
     // pathName = '../tradingView/out'
     
    }
  }
    log.debug(fileName);

  
  //log.debug(fileContent);
 
  if (fileOk){

  let fileContent = fs.readFileSync(fileName, "utf8");

        signal_price_pos = fileContent.indexOf("PRICE");
        signal_price = fileContent.substring(signal_price_pos+6, signal_price_pos+14); 
        signal_price_int = Number.parseInt(signal_price);
        log.debug("PRICE "+signal_price_int);

        signal_sell_pos = fileContent.indexOf("1H_SUM_SELL");
        signal_sell = fileContent.substring(signal_sell_pos+12, signal_sell_pos+14); 
        H1_SUM_SELL = Number.parseInt(signal_sell);
        log.debug("H1_SUM_SELL "+H1_SUM_SELL);

        signal_neutral_pos = fileContent.indexOf("1H_SUM_NEUTRAL");
        signal_neutral = fileContent.substring(signal_neutral_pos+15, signal_neutral_pos+17); 
        H1_SUM_NEUTRAL = Number.parseInt(signal_neutral);
        log.debug("H1_SUM_NEUTRAL "+H1_SUM_NEUTRAL);

        signal_buy_pos = fileContent.indexOf("1H_SUM_BUY");
        signal_buy = fileContent.substring(signal_buy_pos+11, signal_buy_pos+13); 
        H1_SUM_BUY = Number.parseInt(signal_buy);
        log.debug("H1_SUM_BUY "+H1_SUM_BUY);

        if(H1_SUM_BUY + H1_SUM_NEUTRAL + H1_SUM_SELL == signal_total)
          if (signal_price_int >0){ 
            if (fileName != fileName_last) {
          
              for (let step = historyDeep; step > 1 ;step--){
                historyB[step] = historyB[step-1];
                historyS[step] = historyS[step-1];
              }
            
              historyB[1] = H1_SUM_BUY;
              historyS[1] = H1_SUM_SELL;
            
              historyBMin = 100;
              historySMin = 100;
            
            for (let step = 1; step <= historyDeep; step++) {
              if (historyB[step] > 0); 
                if (historyB[step] < historyBMin )  historyBMin = historyB[step];
              if (historyS[step] > 0) ;
                if (historyS[step] < historySMin ) historySMin = historyS[step];
            }
            
            historyBDiff = H1_SUM_BUY - historyBMin;
            historySDiff = H1_SUM_SELL - historySMin;

            log.debug('historyBDiff '+historyBDiff+'  historySDiff '+historySDiff);

            //historyBDiff = (historyBDiff_last+historyBDiff)/2
            //historySDiff = (historySDiff_last+historySDiff)/2

            if(this.currentTrend === 'long') log.debug('is long');
            if(this.currentTrend === 'short') log.debug('is short');

            log.debug('historyBDiff '+historyBDiff+'  historySDiff '+historySDiff);
            
            if (historyBDiff > PERSISTENCE_CANDLE_HIGH ) {
                persistenceBuy_cnt = persistenceBuy_cnt +1
            } else { 
                persistenceBuy_cnt = 0;
            }
            
            if (historySDiff > PERSISTENCE_CANDLE_HIGH  ) {
                persistenceSell_cnt = persistenceSell_cnt +1
            }else {
                persistenceSell_cnt = 0;
            }

            if (persistenceSell_cnt == PERSISTENCE_SELL) {
              attemptSellCnt = attemptSellCnt +1
              attemptBuyCnt = 0;
            }
        
          if (persistenceBuy_cnt == PERSISTENCE_BUY) {
              attemptBuyCnt = attemptBuyCnt +1
              attemptSellCnt = 0;
          }

/*              if (H1_SUM_BUY > PERSISTENCE_CANDLE_HIGH && H1_SUM_BUY >= H1_SUM_BUY_LAST ) 
                persistenceBuy_cnt = persistenceBuy_cnt +1;
              else persistenceBuy_cnt = 0;
            
          
              if (H1_SUM_SELL > PERSISTENCE_CANDLE_HIGH && H1_SUM_SELL >= H1_SUM_SELL_LAST ) 
                persistenceSell_cnt = persistenceSell_cnt +1;
              else persistenceSell_cnt = 0;
  */        
              log.debug('persistenceBuy_cnt '+persistenceBuy_cnt+'  persistenceSell_cnt '+persistenceSell_cnt);

              H1_SUM_BUY_LAST = H1_SUM_BUY;
              H1_SUM_SELL_LAST = H1_SUM_SELL;

              historyBDiff_last = historyBDiff;
              historySDiff_last = historySDiff;

              fileName_last = fileName;
              bad_data = false;
            }

        } 
        
      } 

}


function getLatestFile(dirpath) {

  // Check if dirpath exist or not right here

  let latest;

  const files = fs.readdirSync(dirpath);
  files.forEach(filename => {
    // Get the stat
    const stat = fs.lstatSync(path.join(dirpath, filename));
    // Pass if it is a directory
    if (stat.isDirectory())
      return;

    // latest default to first file
    if (!latest) {
      latest = {filename, mtime: stat.mtime};
      return;
    }
    // update latest if mtime is greater than the current latest
    if (stat.mtime > latest.mtime) {
      latest.filename = filename;
      latest.mtime = stat.mtime;
    }
  });

  return latest.filename;
}

// For debugging purposes.
strat.log = function() {
  log.debug('strat.log');

 // log.debug('calculated random number:');
  //log.debug('\t', this.randomNumber.toFixed(3));
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
  log.debug('strat.check');
  if (bad_data) log.debug('bad data') 
    else {



          if (attemptBuyCnt == ATTEMPT_BUY_LIMIT ) {
            attemptBuyCnt = 0;
          // log.debug("persistenceBuy_cnt_last "+persistenceBuy_cnt_last)
            log.info('advice short '+signal_price_int);
            this.currentTrend = 'short';
            this.advice('short'); 
            
          }
        
          if (attemptSellCnt == ATTEMPT_SELL_LIMIT ) {
            attemptSellCnt = 0;
          
            // ConsoleWrite("persistenceSell_cnt_last "+persistenceSell_cnt_last)
            log.info('advice long '+signal_price_int);
            this.currentTrend = 'long';
            this.advice('long');
          
          }

  }
}

module.exports = strat;
