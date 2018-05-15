const Ant = require('./as')

const ant = new Ant()

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault()
  const alpha = document.getElementById('beta').value
  const beta = document.getElementById('alpha').value
  const tauzero = document.getElementById('tauzero').value
  const coords = require('./airports').nodes
  ant.run(coords, alpha, beta, tauzero)
})
