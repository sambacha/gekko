/*
 * Linear regression curve
 */
var Indicator = function (settings) {
  this.input = 'price'
  this.depth = settings
  this.result = false
  this.age = 0
  this.history = []
  this.x = []
  /*
   * Do not use array(depth) as it might not be implemented
   */
  for (var i = 0; i < this.depth; i++) {
    this.history.push(0.0)
    this.x.push(i)
  }
}

Indicator.prototype.update = function (price) {
  // We need sufficient history to get the right result.
  if (this.result === false && this.age < this.depth) {
    this.history[this.age] = price
    this.age++
    this.result = false
    return
  }

  this.age++
  // shift history
  for (var i = 0; i < (this.depth - 1); i++) {
    this.history[i] = this.history[i + 1]
  }
  this.history[this.depth - 1] = price

  this.calculate(price)
}

/*
 * Least squares linear regression fitting.
 */
function linreg (valuesX, valuesY) {
  var sumX = 0
  var sumY = 0
  var sumXY = 0
  var sumXX = 0
  var count = 0

  /*
     * We'll use those variables for faster read/write access.
     */
  var x = 0
  var y = 0
  var valuesLength = valuesX.length

  if (valuesLength !== valuesY.length) {
    throw new Error('The parameters values_x and values_y need to have same size!')
  }

  /*
     * Nothing to do.
     */
  if (valuesLength === 0) {
    return [[], []]
  }

  /*
     * Calculate the sum for each of the parts necessary.
     */
  for (var v = 0; v < valuesLength; v++) {
    x = valuesX[v]
    y = valuesY[v]
    sumX += x
    sumY += y
    sumXX += x * x
    sumXY += x * y
    count++
  }

  /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
  var m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX)
  var b = (sumY / count) - (m * sumX) / count

  return [m, b]
}

/*
 * Handle calculations
 */
Indicator.prototype.calculate = function (price) {
  // get the reg
  var reg = linreg(this.x, this.history)

  // y = a * x + b
  this.result = ((this.depth - 1) * reg[0]) + reg[1]
}

module.exports = Indicator
