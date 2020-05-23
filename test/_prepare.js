// overwrite config with test-config

var utils = require(__dirname + '/../src/core/util');
var testConfig = require(__dirname + '/test-config.json');
utils.setConfig(testConfig);