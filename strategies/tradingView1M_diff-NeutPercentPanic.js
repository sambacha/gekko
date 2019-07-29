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

var sumB;
var sumS;

var price_trade_last = 0;
var profit_delta = 0.01;

var price_panic_buy = 20;
var price_panic_sell = 20;

// Prepare everything our method needs
strat.init = function() {
  log.debug('strat.init');

  this.input = 'candle';
  this.currentTrend = 'long';
  this.requiredHistory = 0;
}

// What happens on every new candle?
strat.update = function(candle) {
  log.debug('strat.update tradingView1M_diff-neutPercentPanic');

  // Get a random number between 0 and 1.
 // this.randomNumber = Math.random();

  /*
  Data = new Date();
  Year = Data.getFullYear();
  Month = Data.getMonth();
  Day = Data.getDate();
  Hour = Data.getHours();
  Minutes = Data.getMinutes();
  Seconds = Data.getSeconds();


  var SMonth = Month+1+"";
  if (SMonth.length==1) SMonth = "0"+SMonth;

  var SDay = Day+"";
  if (SDay.length==1) SDay = "0"+SDay;

  var SHour = Hour+"";
  if (SHour.length==1) SHour = "0"+SHour;

  var SMinutes = Minutes-1+"";
  if (SMinutes.length==1) SMinutes = "0"+SMinutes;
*/
  
  var fileName = 'C:/YandexDisk/tradingview/out/'+ getLatestFile("C:/YandexDisk/tradingview/out");
  log.debug("Синхронное чтение файла "+getLatestFile("C:/YandexDisk/tradingview/out"));

  /*
  fs.access(fileName, function(error){
    if (error) {
        console.log("Файл не найден");
    } else {
        console.log("Файл найден");
       
}
});
*/
  //log.debug(fileContent);
 
  
  let fileContent = fs.readFileSync(fileName, "utf8");

        signal_price_pos = fileContent.indexOf("PRICE");
        signal_price = fileContent.substring(signal_price_pos+7, signal_price_pos+15); 
        signal_price_int = Number.parseInt(signal_price);
        log.debug("PRICE "+signal_price_pos+" "+signal_price_int);

        signal_sell_pos = fileContent.indexOf("1M_SUM_SELL");
        signal_sell = fileContent.substring(signal_sell_pos+13, signal_sell_pos+15); 
        signal_sell_int = Number.parseInt(signal_sell);
        log.debug("1M_SUM_SELL "+signal_sell_pos+" "+signal_sell_int);

        signal_neutral_pos = fileContent.indexOf("1M_SUM_NEUTRAL");
        signal_neutral = fileContent.substring(signal_neutral_pos+16, signal_neutral_pos+18); 
        signal_neutral_int = Number.parseInt(signal_neutral);
        log.debug("1M_SUM_NEUTRAL "+signal_neutral_pos+" "+signal_neutral_int);

        signal_buy_pos = fileContent.indexOf("1M_SUM_BUY");
        signal_buy = fileContent.substring(signal_buy_pos+12, signal_buy_pos+14); 
        signal_buy_int = Number.parseInt(signal_buy);
        log.debug("1M_SUM_BUY "+signal_buy_pos+" "+signal_buy_int);

        if(signal_buy_int + signal_sell_int + signal_neutral_int == signal_total)
          if (signal_price_int >0){ 
            if (fileName != fileName_last) {
          //    log.debug('signal_buy_int '+signal_buy_int);
          //    log.debug('signal_buy_int_last '+signal_buy_int_last);
          //    log.debug('signal_sell_int '+signal_sell_int);
          //    log.debug('signal_sell_int_last '+signal_sell_int_last);

              sumB = (signal_buy_int - signal_buy_int_last)+(signal_sell_int_last - signal_sell_int)
              sumS = (signal_buy_int_last - signal_buy_int)+(signal_sell_int - signal_sell_int_last)

              log.debug('sumB '+sumB);
              log.debug('sumS '+sumS);
          
              signal_buy_int_last = signal_buy_int;
              signal_sell_int_last = signal_sell_int;
              fileName_last = fileName;
            }

        } else log.debug('bad data');

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

  // Only continue if we have a new update.
  if (signal_price_int >0){

   // log.debug("sumS-signal_neutral_int "+(sumS-signal_neutral_int));

    if(this.currentTrend === 'long') {
      if(sumS-signal_neutral_int >=11 ) 
        if (signal_price_int > (price_trade_last + price_trade_last*profit_delta)) {
          
          price_trade_last = signal_price_int;
          // If it was long, set it to short
          log.debug('advice short');
          this.currentTrend = 'short';
          this.advice('short');
        } else log.debug("wait price > "+(price_trade_last + price_trade_last*profit_delta));
      if (signal_sell_int >= price_panic_sell) {
        price_trade_last = signal_price_int;
        log.debug('PANIC advice short');
        this.currentTrend = 'short';
        this.advice('short');
      }
    }    


    if(this.currentTrend === 'short'){
      if(sumB-signal_neutral_int >=11) 
        if (signal_price_int < (price_trade_last - price_trade_last*profit_delta)){

            price_trade_last = signal_price_int;
            // If it was short, set it to long
            log.debug('advice long');
            this.currentTrend = 'long';
            this.advice('long');
        
          } else log.debug("wait price < "+(price_trade_last - price_trade_last*profit_delta));
      if (signal_buy_int >= price_panic_buy) {
        price_trade_last = signal_price_int;
        log.debug('PANIC advice long');
        this.currentTrend = 'long';
        this.advice('long');
      }
    }
  }
}

module.exports = strat;
