const As = require('./as')

const resultsInput = document.getElementById('results')
const progressBar = document.getElementById('progressbar')

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault()

  // Reset progressbar
  let ran = 0
  progressBar.style.width = ran + '%'
  progressBar.setAttribute('aria-valuenow', ran)
  progressBar.innerText = ran + '%'

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
  const as = new As(coords, alpha, beta, tauzero, ro, q)
  for (let i = 0; i < generations; i++) {
    as.nextIteration()
    ran = ((i + 1) * 100) / generations
    progressBar.style.width = ran + '%'
    progressBar.setAttribute('aria-valuenow', ran)
    progressBar.innerText = ran + '%'
  }

  // Print results
  resultsInput.value += '\nDistance: ' + as.bestSolutionDistance
})
