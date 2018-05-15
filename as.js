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
  constructor (initialCityId, citiesLeft) {
    this.citiesTraveled = []
    this.citiesLeft = citiesLeft
    this.move(initialCityId)
  }

  move (nextCityId) {
    this.currentCityId = nextCityId
    this.citiesTraveled.push(nextCityId)
    this.citiesLeft = this.citiesLeft.filter((city) => city.id !== nextCityId)
  }
}

class AntSystem {
  run (coords, alpha, beta, tauZero) {
    this.alpha = alpha
    this.beta = beta
    this.initialPheromone = tauZero
    this.initializeCities(coords)
    this.initializeEdgesMatrix()
    this.fillEdgesMatrix()
    this.disposeAnts()
    this.moveAnts()
    console.log(this.ants)
  }

  initializeCities (coords) {
    this.cities = []
    for (let i = 0; i < coords.length; i++) {
      this.cities[ i ] = new City(i, coords[ i ][ 1 ], coords[ i ][ 2 ])
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
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[ i ][ j ] = new Edge(this.cities[ i ], this.cities[ j ], this.initialPheromone)
        this.edgesMatrix[ j ][ i ] = new Edge(this.cities[ j ], this.cities[ i ], this.initialPheromone)
      }
    }
  }

  disposeAnts () {
    this.ants = []
    for (let i = 0; i < this.cities.length; i++) {
      const city = this.cities[ i ]
      this.ants.push(new Ant(city.id, this.cities.slice()))
    }
  }

  moveAnts () {
    for (let i = 0; i < this.ants.length; i++) {
      this.moveAnt(i)
    }
  }

  moveAnt (antIndex) {
    const ant = this.ants[ antIndex ]
    let probabilitiesSum = .0
    const probabilities = []
    for (let i = 0; i < ant.citiesLeft.length; i++) {
      const probabilityOfTakingThisEdge = this.edgeProbability(ant.currentCityId, i)
      probabilities[ i ] = probabilityOfTakingThisEdge
      probabilitiesSum += probabilityOfTakingThisEdge
    }
    const drawn = Math.random() * probabilitiesSum
    let accumulated = .0
    for (let i = 0; i < ant.citiesLeft.length - 1; i++) {
      if (accumulated[ i ] <= drawn && accumulated[ i + 1 ] >=
        drawn) {
        ant.move(ant.citiesLeft[ i ].id)
        break
      }
      accumulated += probabilities[ i ]
    }
  }

  edgeProbability (sourceIndex, destinationIndex) {
    const edge = this.edgesMatrix[ sourceIndex ][ destinationIndex ]
    const tauFactor = Math.pow(edge.pheromone, this.alpha)
    const etaFactor = Math.pow(1 / edge.distance, this.beta)
    return tauFactor * etaFactor
  }
}

module.exports = AntSystem