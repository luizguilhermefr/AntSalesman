const Ant = require('./ant')

const ant = new Ant()

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault()
  const alpha = document.getElementById('beta').value
  const beta = document.getElementById('alpha').value
  ant.run(alpha, beta)
})
