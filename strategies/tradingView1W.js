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

var signal_sell_pos;
var signal_sell;
var signal_sell_int = 0;

var signal_total = 28;

var signal_neutral_pos;
var signal_neutral;
var signal_neutral_int = 0;

var signal_buy_pos;
var signal_buy;
var signal_buy_int = 0;


// Prepare everything our method needs
strat.init = function() {
  log.debug('strat.init');

  this.input = 'candle';
  this.currentTrend = 'long';
  this.requiredHistory = 0;
}

// What happens on every new candle?
strat.update = function(candle) {
  log.debug('strat.update');

  // Get a random number between 0 and 1.
 // this.randomNumber = Math.random();

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

        signal_sell_pos = fileContent.indexOf("1W_SUM_SELL");
        signal_sell = fileContent.substring(signal_sell_pos+13, signal_sell_pos+15); 
        signal_sell_int = Number.parseInt(signal_sell);
        log.debug("1W_SUM_SELL "+signal_sell_pos+" "+signal_sell_int);

        signal_neutral_pos = fileContent.indexOf("1W_SUM_NEUTRAL");
        signal_neutral = fileContent.substring(signal_neutral_pos+16, signal_neutral_pos+18); 
        signal_neutral_int = Number.parseInt(signal_neutral);
        log.debug("1W_SUM_NEUTRAL "+signal_neutral_pos+" "+signal_neutral_int);

        signal_buy_pos = fileContent.indexOf("1W_SUM_BUY");
        signal_buy = fileContent.substring(signal_buy_pos+12, signal_buy_pos+14); 
        signal_buy_int = Number.parseInt(signal_buy);
        log.debug("1W_SUM_BUY "+signal_buy_pos+" "+signal_buy_int);

  // There is a 10% chance it is smaller than 0.1
 // this.toUpdate = this.randomNumber < 0.1;

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
  if(signal_buy_int + signal_sell_int + signal_neutral_int == signal_total){  
  if(signal_buy_int < signal_sell_int) {

    //  if(this.currentTrend === 'long') {
    
        // If it was long, set it to short
        log.debug('advice short');
        this.currentTrend = 'short';
        this.advice('short');
    
      }
       if(signal_buy_int > signal_sell_int) {
    
        // If it was short, set it to long
        log.debug('advice long');
        this.currentTrend = 'long';
        this.advice('long');
    
      }
  } else log.debug('bad data');
}

module.exports = strat;
