const As = require('./as')

let filepath = null
const resultsInput = document.getElementById('results')
const progressBar = document.getElementById('progressbar')
const btnRun = document.getElementById('btnRun')

document.getElementById('file').addEventListener('change', (e) => {
  if (e.target.files.length !== 0) {
    filepath = e.target.files[0].path
    btnRun.disabled = false
  } else {
    filepath = null
    btnRun.disabled = true
  }
})

btnRun.addEventListener('click', (e) => {
  e.preventDefault()

  // Reset progressbar
  let ran = 0
  progressBar.style.width = ran + '%'
  progressBar.setAttribute('aria-valuenow', ran)
  progressBar.innerHTML = ran + '%'

  // Get Values from inputs
  const alpha = parseFloat(document.getElementById('alpha').value)
  const beta = parseFloat(document.getElementById('beta').value)
  const tauzero = parseFloat(document.getElementById('tauzero').value)
  const ro = parseFloat(document.getElementById('ro').value)
  const q = parseFloat(document.getElementById('q').value)
  const generations = parseFloat(document.getElementById('generations').value)

  // Get input files
  const coords = require(filepath).nodes
  const generationsToRun = generations * coords.length

  // Execute
  const antSystem = new As(coords, alpha, beta, tauzero, ro, q)
  for (let i = 0; i < generationsToRun; i++) {
    antSystem.nextIteration()
    ran = ((i + 1) / generationsToRun) * 100
    progressBar.style.width = ran + '%'
    progressBar.setAttribute('aria-valuenow', ran)
    progressBar.innerHTML = ran + '%'
  }

  // Print results
  resultsInput.value += '\nDistance: ' + antSystem.bestSolutionDistance.toFixed(2)
  resultsInput.value += '\nTour: '
  for (let i = 0; i < antSystem.bestSolutionSequence.length; i++) {
    resultsInput.value += antSystem.bestSolutionSequence[i]
    if (i !== antSystem.bestSolutionSequence.length - 1) {
      resultsInput.value += ', '
    }
  }
})
