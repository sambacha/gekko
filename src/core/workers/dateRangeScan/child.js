const path = require('path')
var util = require(path.join(__dirname, '/../../util'))
var log = require('../../log.js')

var dirs = util.dirs()
var ipc = require('relieve').IPCEE(process)

ipc.on('start', config => {
  // force correct gekko env
  util.setGekkoEnv('child-process')

  // force disable debug
  config.debug = false

  // persist config
  util.setConfig(config)

  var scan = require(dirs.tools + 'dateRangeScanner')
  scan(
    (err, ranges, reader) => {
      if (err) {
        log.error(err)
        return util.die(err.message)
      }
      reader.close()
      ipc.send('ranges', ranges)
      process.exit(0)
    }
  )
})
