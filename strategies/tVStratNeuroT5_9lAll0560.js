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
var path = require('path');
var scriptName = path.basename(__filename);
scriptName = scriptName.substring(0,scriptName.length -3)
////////////////////////neuro////////////////////////////////////
var {PythonShell} = require('python-shell');
var neuroData=[210]
var predictionResult
var predictionAction = 0
//import {PythonShell} from 'python-shell';

var minMax = [[-0.55, 0.55], [-0.7, 0.7], [-1, 1], [0, 100],
[0, 100], [0, 100], [0, 100], [0, 100], [0, 100],
[-667, 667], [-667, 667], [0, 100], [0, 100], [0, 100],
[0, 100], [0, 100], [-3500, 4500], [-3500, 4500], [-5000, 7000],
[-4500, 5500], [-1200, 1700], [-1000, 1500], [-1, 1], [0, 100],
[-1, 1], [-100, 0], [-1, 1], [-6500, 7500], [-1, 1],
[0, 100]]

////////////////////////////////////////////////////////////



const fs = require("fs")//
path = require('path')//

// Let's create our own strat
var strat = {}//
var fileName_last//

var price = 0//

var STOPLOSS = 1
var TRAILING = 0.3
var PREDICT_PERCENT = -0.9
var sellPrice = 0
var trailingPrice = 0

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
  log.debug('strat.update '+scriptName)//
 
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

    if (predictionResult != null) {
        //log.debug("predictionResult "+predictionResult.prediction)//
        log.debug("action "+predictionResult.action)//
        predictionAction = 0
        predictionAction = Number.parseFloat(predictionResult.action)
        if (predictionAction != 0) {
            bad_data = false//
        }
        predictionResult = null//console.log(predictionResult);
    }
 


if (fileOk){
    
    if (fileName != fileName_last) {
        fileName_last = fileName//
        let fileContent = fs.readFileSync(fileName, "utf8")//

        var M5_string = fileContent.match(/M5\{.\"data\"\:\[.*?\]/g)//
        var M15_string = fileContent.match(/M15\{.\"data\"\:\[.*?\]/g)//
        var H1_string = fileContent.match(/H1\{.\"data\"\:\[.*?\]/g)//
        var H4_string = fileContent.match(/H4\{.\"data\"\:\[.*?\]/g)//
        var D1_string = fileContent.match(/D1\{.\"data\"\:\[.*?\]/g)//
        var W1_string = fileContent.match(/W1\{.\"data\"\:\[.*?\]/g)//
        var MON1_string = fileContent.match(/MON1\{.\"data\"\:\[.*?\]/g)//

        if (Array.isArray(M5_string) && Array.isArray(M15_string) && Array.isArray(H1_string) && Array.isArray(H4_string) && Array.isArray(D1_string) && Array.isArray(W1_string) && Array.isArray(MON1_string)){
//            log.debug("M15_string "+M15_string[0])//
            var M5_string_cut = M5_string[0].substring(40, M5_string[0].length-1)// 
            var M15_string_cut = M15_string[0].substring(41, M15_string[0].length-1)// 
            var H1_string_cut = H1_string[0].substring(40, H1_string[0].length-1)// 
            var H4_string_cut = H4_string[0].substring(40, H4_string[0].length-1)// 
            var D1_string_cut = D1_string[0].substring(40, D1_string[0].length-1)// 
            var W1_string_cut = W1_string[0].substring(40, W1_string[0].length-1)// 
            var MON1_string_cut = MON1_string[0].substring(42, MON1_string[0].length-1)// 


            // log.debug("M5_string "+M5_string_cut)//
            // log.debug("M15_string "+M15_string_cut)//
            // log.debug("H1_string "+H1_string_cut)//
            // log.debug("H4_string "+H4_string_cut)//
            // log.debug("D1_string "+D1_string_cut)//
            // log.debug("W1_string "+W1_string_cut)//
            // log.debug("MON1_string "+MON1_string_cut)//
    

            // log.debug("M15_string_cut "+M15_string_cut)//
            var indicatorsM5 = M5_string_cut.split(',')
            var indicatorsM15 = M15_string_cut.split(',')
            var indicatorsH1 = H1_string_cut.split(',')
            var indicatorsH4 = H4_string_cut.split(',')
            var indicatorsD1 = D1_string_cut.split(',')
            var indicatorsW1 = W1_string_cut.split(',')
            var indicatorsMON1 = MON1_string_cut.split(',')
            if (indicatorsM5.length == 82 && indicatorsM15.length == 82 && indicatorsH1.length == 82 && indicatorsH4.length == 82 && indicatorsD1.length == 82 && indicatorsW1.length == 82 && indicatorsMON1.length == 82){
                price = Number.parseFloat(indicatorsH1[32]) //THIS IS WRONG PRICE SMA5
                
                for (let cnt = 0; cnt <= 29; cnt++) {
                    indicatorsM5[cnt] = (indicatorsM5[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsM15[cnt] = (indicatorsM15[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsH1[cnt] = (indicatorsH1[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsH4[cnt] = (indicatorsH4[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsD1[cnt] = (indicatorsD1[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsW1[cnt] = (indicatorsW1[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                    indicatorsMON1[cnt] = (indicatorsMON1[cnt] -minMax[cnt][0]) / (minMax[cnt][1] - minMax[cnt][0])
                }

                cnt = 0
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsM5[step]
                    //log.debug("indicatorsM5[step] "+indicatorsM5[step])//
                }
                cnt = 1
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsM15[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                cnt = 2
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsH1[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                cnt = 3
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsH4[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                cnt = 4
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsD1[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                cnt = 5
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsW1[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                cnt = 6
                for (let step = 0; step <= 29; step++) {
                    neuroData[step+cnt*30] = indicatorsMON1[step]
                    //log.debug("indicatorsM15[step] "+indicatorsM15[step])//
                }
                        

                //getPythonData(neuroData)
                let options = {
                    mode: 'text',
                    pythonPath: '/home/administrator/test/gekko0419-git/neuro/venv/bin/python3',
                    //pythonPath: 'C:/Users/Texno/workspace/bot/gekko0419-git/neuro/venv/Scripts',
                    pythonOptions: ['-u'], // get print results in real-time
                    scriptPath: '/home/administrator/test/gekko0419-git/neuro/'+scriptName,
                    args: neuroData
                  };

                log.debug("starting magic..."+price)//
                PythonShell.run('neuro.py', options, function (err, results) {
                    if (err) throw err;
                    // results is an array consisting of messages collected during execution
                    predictionResult = null
                    console.log('results: %j', results);
                    predictionResult = JSON.parse(results);
                    //console.log(predictionResult);
                    
                  });

                if(this.currentTrend === 'long') log.debug('is long')//
                if(this.currentTrend === 'short') log.debug('is short')//
                    

            } //if (indicators.length == 82){
              else log.debug('bad data')//
        }  //if (Array.isArray(M15_string))
        
    } //if (fileName != fileName_last
}//if (fileOk

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
  if (!bad_data)  {
    //else {
      //log.debug('new prediction')
            if (predictionAction < PREDICT_PERCENT) {
                if (sellPrice == 0) {
                    sellPrice = price
                    trailingPrice = price
                    log.info('advice short '+price)//
                    this.currentTrend = 'short'//
                    this.advice('short')//             
                }
            }          

            if (sellPrice > 0) {
                if (price < trailingPrice){
                    trailingPrice = price                    
                }
                if (predictionAction >= 0)
                    if (price < sellPrice){
                        if (price > trailingPrice + trailingPrice * TRAILING / 100){
                            //total_trades = total_trades + 1
                            sellPrice = 0
                            //attemptBuyCnt = 0 // обнуляем чтобы не продавал сразу после покупки
                            log.info('advice trailing long '+price)//
                            this.currentTrend = 'long'//
                            this.advice('long')//
                        }
                    } 
              }
              if (sellPrice > 0) {    
                if (price > sellPrice + sellPrice * STOPLOSS / 100){
                    //total_trades = total_trades + 1
                    //stopLossTotal_trades = stopLossTotal_trades + 1
                    sellPrice = 0
                    //attemptBuyCnt = 0 //# обнуляем чтобы не продавал сразу после покупки
                    log.info('advice STOPLOSS for short -> long '+price)//
                    this.currentTrend = 'long'//
                    this.advice('long')// 
                }
              }//if (sellPrice > 0) {

  }
}

module.exports = strat//
