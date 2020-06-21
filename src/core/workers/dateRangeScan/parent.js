var ForkTask = require('relieve').tasks.ForkTask
var fork = require('child_process').fork
const path = require('path')

module.exports = function (config, done) {
  var debug = typeof v8debug === 'object'
  if (debug) {
    process.execArgv = []
  }

  const task = new ForkTask(fork(path.join(__dirname, '/child')))

  task.send('start', config)

  task.once('ranges', ranges => {
    return done(false, ranges)
  })
  task.on('exit', code => {
    if (code !== 0) { done('ERROR, unable to scan dateranges, please check the console.') }
  })
}
