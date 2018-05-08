const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')
const url = require('url')
const ant = require('./ant')

let mainWindow
let menu
let runItem

function createWindow () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // menu
  menu = new Menu()
  runItem = new MenuItem({
    label: 'Run',
    click: ant.run
  })
  menu.append(runItem)
  mainWindow.setMenu(menu)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
