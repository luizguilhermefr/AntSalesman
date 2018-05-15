'use strict'

class City {
  constructor (id, x, y) {
    this.id = id
    this.x = x
    this.y = y
  }
}

class Edge {
  constructor (cityFrom, cityTo, initialPheromone) {
    this.cityFrom = cityFrom
    this.cityTo = cityTo
    this.calculateDistance()
    this.pheromone = initialPheromone
  }

  disposePheromone (pheromone) {
    this.pheromone += pheromone
  }

  calculateDistance () {
    this.distance = Math.sqrt(Math.pow(this.cityFrom.x - this.cityTo.x) +
      Math.pow(this.cityFrom.y - this.cityTo.y))
  }
}

class Ant {
  constructor (initialCity, citiesLeft) {
    this.citiesTraveled = []
    this.citiesLeft = citiesLeft
    this.move(initialCity)
  }

  move (nextCity) {
    this.currentCity = nextCity
    this.citiesTraveled.push(nextCity)
    this.citiesLeft = this.citiesLeft.filter((city) => city.id !== nextCity)
  }
}

class AntSystem {
  run (coords, alpha, beta, initialPheromone) {
    this.alpha = alpha
    this.beta = beta
    this.initialPheromone = initialPheromone
    this.initializeCities(coords)
    this.initializeEdgesMatrix()
    this.fillEdgesMatrix()
    this.disposeAnts()
  }

  initializeCities (coords) {
    this.cities = []
    for (let i = 0; i < coords.length; i++) {
      const city = new City(coords[ 0 ], coords[ 1 ], coords[ 2 ])
      this.cities.push(city)
    }
  }

  initializeEdgesMatrix () {
    this.edgesMatrix = []
    for (let i = 0; i < this.cities.length; i++) {
      this.edgesMatrix[ i ] = []
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[ i ][ j ] = null
      }
    }
  }

  fillEdgesMatrix () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = i + 1; j < this.cities.length; j++) {
        this.edgesMatrix[ i ][ j ] = new Edge(this.cities[ i ], this.cities[ j ], this.initialPheromone)
        this.edgesMatrix[ j ][ i ] = new Edge(this.cities[ j ], this.cities[ i ], this.initialPheromone)
      }
    }
  }

  disposeAnts () {
    this.ants = []
    for (let i = 0; i < this.cities.length; i++) {
      this.ants.push(new Ant(i, this.cities.slice()))
    }
  }

  moveAnts () {
    for (let i = 0; i < this.ants.length; i++) {
      this.moveAnt(i)
    }
  }

  moveAnt (antIndex) {
    const ant = this.ants[ antIndex ]
    const currentCity = ant.currentCity
    const probabilities = []
    for (let i = 0; i < ant.citiesLeft.length; i++) {
      const probabilityOfTakingThisEdge = this.edgeProbability(ant, currentCity, i)
      probabilities.push(probabilityOfTakingThisEdge)
    }
  }

  edgeProbability (ant, sourceIndex, destinationIndex) {

  }
}

module.exports = AntSystem