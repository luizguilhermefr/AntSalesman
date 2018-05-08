'use strict'

const Ant = class {
  run (alpha, beta) {
    this.coords = require('./airports').nodes
    this.alpha = alpha
    this.beta = beta
    this.makeCostMatrix()
    console.log(this.costMatrix)
  }

  makeCostMatrix () {
    let matrix = []

    for (let i = 0; i < this.coords.length; i++) {
      matrix[ i ] = []
      for (let j = 0; j < this.coords.length; j++) {
        matrix[ i ][ j ] = .0
      }
    }

    for (let i = 0; i < this.coords.length; i++) {
      for (let j = i + 1; j < this.coords.length; j++) {
        const from = this.coords[ i ]
        const to = this.coords[ j ]
        const cost = Ant.distanceBetween(from, to)
        matrix[ i ][ j ] = cost
        matrix[ j ][ i ] = cost
      }
    }

    this.costMatrix = matrix
  }

  static distanceBetween (from, to) {
    const fromX = from[ 1 ]
    const fromY = from[ 2 ]
    const toX = to[ 1 ]
    const toY = to[ 2 ]
    return Math.sqrt(Math.pow(fromX - toX) + Math.pow(fromY - toY))
  }
}

module.exports = Ant