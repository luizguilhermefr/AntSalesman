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
    this.pheromone *= (1 - this.evaporationCoefficient)
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
  constructor (
    coords, pheromoneInfluence, distanceInfluence, tauZero,
    evaporationCoefficient, pheromoneByAnt) {
    this.pheromoneInfluence = pheromoneInfluence
    this.distanceInfluence = distanceInfluence
    this.initialPheromone = tauZero
    this.evaporationCoefficient = evaporationCoefficient
    this.pheromoneByAnt = pheromoneByAnt
    this.bestSolutionSequence = null
    this.bestSolutionDistance = null
    this.bestSolutionGeneration = null
    this.initializeCities(coords)
    this.initializeEdgesMatrix()
    this.fillEdgesMatrix()
  }

  initializeCities (coords) {
    this.cities = []
    for (let i = 0; i < coords.length; i++) {
      this.cities[i] = {
        id: i,
        name: coords[i][0],
        x: coords[i][1],
        y: coords[i][2],
      }
    }
  }

  initializeEdgesMatrix () {
    this.edgesMatrix = []
    for (let i = 0; i < this.cities.length; i++) {
      this.edgesMatrix[i] = []
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[i][j] = null
      }
    }
  }

  fillEdgesMatrix () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[i][j] = new Edge(this.cities[i], this.cities[j],
          this.initialPheromone, this.evaporationCoefficient)
        this.edgesMatrix[j][i] = new Edge(this.cities[j], this.cities[i],
          this.initialPheromone, this.evaporationCoefficient)
      }
    }
  }

  nextIteration (currentGeneration) {
    this.updateOffilinePheromoneInEdges()
    this.disposeAnts()
    this.moveAnts()
    this.updateBestSolution(currentGeneration)
    this.evaporatePheromoneInEdges()
  }

  updateOffilinePheromoneInEdges () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[i][j].useNextOfflinePheromone()
      }
    }
  }

  evaporatePheromoneInEdges () {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        this.edgesMatrix[i][j].evaporatePheromone()
      }
    }
  }

  disposeAnts () {
    this.ants = []
    const citiesIds = this.cities.map((city) => city.id)
    this.cities.forEach((city) => {
      this.ants.push(new Ant(city.id, citiesIds.slice()))
    })
  }

  moveAnts () {
    this.ants.forEach((ant) => {
      this.moveAnt(ant)
    })
  }

  moveAnt (ant) {
    while (ant.hasCitiesToTravel()) {
      // Initialize probabilities
      let probabilitiesSum = .0
      const probabilities = []
      // Populate probabilities of taking each edge from the remaining ones
      ant.citiesLeft.forEach((possibleDestiny, index) => {
        const edge = this.edgesMatrix[ant.currentCityId][possibleDestiny]
        const probabilityOfTakingThisEdge = this.edgeProbability(edge)
        probabilities[index] = probabilityOfTakingThisEdge
        probabilitiesSum += probabilityOfTakingThisEdge
      })
      // Draw a number between 0 and the sum of probabilities
      const drawn = Math.random() * probabilitiesSum
      // Get which edge should be taken and move using this edge
      let probabilityRan = 0
      for (let i = 0; i < ant.citiesLeft.length; i++) {
        const probabilityBeforeSum = probabilityRan
        probabilityRan += probabilities[i]
        if (probabilityBeforeSum < drawn && probabilityRan >= drawn) {
          const nextDestiny = ant.citiesLeft[i]
          const edge = this.edgesMatrix[ant.currentCityId][nextDestiny]
          ant.move(nextDestiny, edge.distance)
          edge.disposeOfflinePheromone(this.pheromoneByAnt)
          break
        }
      }
    }
  }

  edgeProbability (edge) {
    const tauFactor = Math.pow(edge.pheromone, this.pheromoneInfluence)
    const etaFactor = Math.pow(1 / edge.distance, this.distanceInfluence)
    return tauFactor * etaFactor
  }

  updateBestSolution (generation) {
    let bestSolutionSequence = this.ants[0].citiesTraveled
    let bestSolutionDistance = this.ants[0].distanceTraveled
    for (let i = 1; i < this.ants.length; i++) {
      if (this.ants[i].distanceTraveled < bestSolutionDistance) {
        bestSolutionDistance = this.ants[i].distanceTraveled
        bestSolutionSequence = this.ants[i].citiesTraveled
      }
    }
    if (this.bestSolutionDistance === null || this.bestSolutionDistance >
      bestSolutionDistance) {
      this.bestSolutionDistance = bestSolutionDistance
      this.bestSolutionSequence = bestSolutionSequence
      this.bestSolutionGeneration = generation
    }
  }
}

module.exports = AntSystem