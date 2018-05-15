const Ant = require('./as')

const ant = new Ant()

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault()
  const alpha = document.getElementById('alpha').value
  const beta = document.getElementById('beta').value
  const tauzero = document.getElementById('tauzero').value
  const ro = document.getElementById('ro').value
  const q = document.getElementById('q').value
  const generations = document.getElementById('generations').value
  const resultsInput = document.getElementById('results')
  const coords = require('./airports').nodes
  const result = ant.run(coords, alpha, beta, tauzero, ro, q, generations)
  resultsInput.value = 'Distance: ' + result.distance
})
