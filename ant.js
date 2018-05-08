'use strict'

const Ant = class {
  run () {
    this.coords = require('./airports').nodes
    console.log(this.coords)
  }
}

module.exports = Ant