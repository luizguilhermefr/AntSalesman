'use strict'

class Edge {
  constructor (cityFrom, cityTo, initialPheromone, evaporationCoefficient) {
    this.cityFrom = cityFrom
    this.cityTo = cityTo
    this.calculateDistance()
    this.offlinePheromone = initialPheromone
    this.pheromone = 0
    this.evaporationCoefficient = evaporationCoefficient
  }

  useNextOfflinePheromone () {
    this.pheromone += this.offlinePheromone
    this.offlinePheromone = 0
  }

  evaporatePheromone () {
    this.pheromone *= this.evaporationCoefficient
  }

  disposeOfflinePheromone (pheromone) {
    this.offlinePheromone += pheromone
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
    this.citiesLeft = this.citiesLeft.filter((city) => city !== nextCityId)
  }

  hasCitiesToTravel () {
    return this.citiesLeft.length > 0
  }
}

class AntSystem {
  constructor (coords, pheromoneInfluence, distanceInfluence, tauZero, evaporationCoefficient, pheromoneByAnt) {
    this.pheromoneInfluence = pheromoneInfluence
    this.distanceInfluence = distanceInfluence
    this.initialPheromone = tauZero
    this.evaporationCoefficient = evaporationCoefficient
    this.pheromoneByAnt = pheromoneByAnt
    this.initializeCities(coords)
    this.initializeEdgesMatrix()
    this.fillEdgesMatrix()
  }

  initializeCities (coords) {
    this.cities = []
    for (let i = 0; i < coords.length; i++) {
      this.cities[ i ] = {
        id: i,
        x: coords[ i ][ 1 ],
        y: coords[ i ][ 2 ]
      }
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
        this.edgesMatrix[ i ][ j ] = new Edge(this.cities[ i ], this.cities[ j ], this.initialPheromone, this.evaporationCoefficient)
        this.edgesMatrix[ j ][ i ] = new Edge(this.cities[ j ], this.cities[ i ], this.initialPheromone, this.evaporationCoefficient)
      }
    }
  }

  nextIteration () {
    this.updateOffilinePheromoneInEdges()
    this.disposeAnts()
    this.moveAnts()
    this.updateBestSolution()
    this.evaporatePheromoneInEdges()
  }

  updateOffilinePheromoneInEdges () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[ i ][ j ].useNextOfflinePheromone()
      }
    }
  }

  evaporatePheromoneInEdges () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[ i ][ j ].evaporatePheromone()
      }
    }
  }

  disposeAnts () {
    this.ants = []
    const citiesIds = this.cities.map((city) => city.id)
    for (let i = 0; i < this.cities.length; i++) {
      this.ants.push(new Ant(this.cities[ i ].id, citiesIds.slice()))
    }
  }

  moveAnts () {
    for (let i = 0; i < this.ants.length; i++) {
      this.moveAnt(i)
    }
  }

  moveAnt (antIndex) {
    const ant = this.ants[ antIndex ]
    while (ant.hasCitiesToTravel()) {
      // Initialize probabilities
      let probabilitiesSum = .0
      const probabilities = []
      // Populate probabilities of taking each edge from the remaining ones
      for (let i = 0; i < ant.citiesLeft.length; i++) {
        const possibleDestiny = ant.citiesLeft[ i ]
        const edge = this.edgesMatrix[ ant.currentCityId ][ possibleDestiny ]
        const probabilityOfTakingThisEdge = this.edgeProbability(edge)
        probabilities[ i ] = probabilityOfTakingThisEdge
        probabilitiesSum += probabilityOfTakingThisEdge
      }
      // Draw a number between 0 and the sum of probabilities
      const drawn = Math.random() * probabilitiesSum
      // Get which edge should be taken and move using this edge
      for (let i = 0; i < ant.citiesLeft.length - 1; i++) {
        if (probabilities[ i ] >= drawn && drawn < probabilities[ i + 1 ]) {
          const nextDestiny = ant.citiesLeft[ i ]
          const edge = this.edgesMatrix[ ant.currentCityId ][ nextDestiny ]
          ant.move(nextDestiny, edge.distance)
          edge.disposeOfflinePheromone(this.pheromoneByAnt)
          break
        }
      }
      // If for did not return anything, return the last
      const lastCitiesLeftIndex = ant.citiesLeft.length - 1
      const lastCityIndex = ant.citiesLeft[ lastCitiesLeftIndex ]
      const edge = this.edgesMatrix[ ant.currentCityId ][ lastCityIndex ]
      ant.move(lastCityIndex, edge.distance)
      edge.disposeOfflinePheromone(this.pheromoneByAnt)
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