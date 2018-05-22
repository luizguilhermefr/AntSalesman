const As = require('./as')

const as = new As()

const resultsInput = document.getElementById('results')

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault()

  // Get Values from inputs
  const alpha = parseFloat(document.getElementById('alpha').value)
  const beta = parseFloat(document.getElementById('beta').value)
  const tauzero = parseFloat(document.getElementById('tauzero').value)
  const ro = parseFloat(document.getElementById('ro').value)
  const q = parseFloat(document.getElementById('q').value)
  const generations = parseFloat(document.getElementById('generations').value)

  // Get input files
  const coords = require('./airports').nodes

  // Execute
  const result = as.run(coords, alpha, beta, tauzero, ro, q, generations)

  // Print results
  resultsInput.value += '\nDistance: ' + result.distance
})
