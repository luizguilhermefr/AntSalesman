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
    this.distance = Math.sqrt(Math.pow(this.cityFrom.x - this.cityTo.x, 2) +
      Math.pow(this.cityFrom.y - this.cityTo.y, 2))
  }
}

class Ant {
  constructor (initialCityId, citiesLeft) {
    this.citiesTraveled = []
    this.citiesLeft = citiesLeft
    this.distanceTraveled = 0
    this.move(initialCityId, 0)
  }

  move (nextCityId, distance) {
    this.currentCityId = nextCityId
    this.citiesTraveled.push(nextCityId)
    this.distanceTraveled += distance
    this.citiesLeft = this.citiesLeft.filter((city) => city.id !== nextCityId)
  }
}

class AntSystem {
  run (coords, pheromoneInfluence, distanceInfluence, tauZero, evaporationPerIteration, pheromoneByAnt, generations) {
    this.pheromoneInfluence = pheromoneInfluence
    this.distanceInfluence = distanceInfluence
    this.initialPheromone = tauZero
    this.evaporationCoefficient = evaporationPerIteration
    this.pheromoneByAnt = pheromoneByAnt
    this.generations = generations
    this.initializeCities(coords)
    this.initializeEdgesMatrix()
    this.fillEdgesMatrix()
    this.runByGenerations()
    return {
      distance: this.bestSolutionDistance,
      sequence: this.bestSolutionSequence
    }
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

  runByGenerations () {
    for (let i = 0; i < this.generations; i++) {
      this.disposeAnts()
      this.moveAnts()
      this.updateBestSolution()
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
      const edge = this.edgesMatrix[ ant.currentCityId ][ i ]
      const probabilityOfTakingThisEdge = this.edgeProbability(edge)
      probabilities[ i ] = probabilityOfTakingThisEdge
      probabilitiesSum += probabilityOfTakingThisEdge
    }
    const drawn = Math.random() * probabilitiesSum
    let accumulated = .0
    for (let i = 0; i < ant.citiesLeft.length - 1; i++) {
      if (accumulated[ i ] <= drawn && accumulated[ i + 1 ] >=
        drawn) {
        const edge = this.edgesMatrix[ ant.currentCityId ][ i ]
        ant.move(ant.citiesLeft[ i ].id, edge.distance)
        break
      }
      accumulated += probabilities[ i ]
    }
  }

  edgeProbability (edge) {
    const tauFactor = Math.pow(edge.pheromone, this.pheromoneInfluence)
    const etaFactor = Math.pow(1 / edge.distance, this.distanceInfluence)
    return tauFactor * etaFactor
  }

  updateBestSolution () {
    this.bestSolutionSequence = this.ants[ 0 ].citiesTraveled
    this.bestSolutionDistance = this.ants[ 0 ].distanceTraveled
    for (let i = 1; i < this.ants.length; i++) {
      if (this.ants[ i ].distanceTraveled < this.bestSolutionDistance) {
        this.bestSolutionDistance = this.ants[ i ].distanceTraveled
        this.bestSolutionSequence = this.ants[ i ].citiesTraveled
      }
    }
  }
}

module.exports = AntSystem