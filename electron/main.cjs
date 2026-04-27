const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Global reference to prevent garbage collection
let mainWindow = null

// Determine if we're in development or production
// Use multiple checks for robustness:
// 1. NODE_ENV=development (set by electron:dev script)
// 2. ELECTRON_IS_DEV=1 (set by Electron internally in some cases)
// 3. process.defaultApp is true when running `electron .` directly (not packaged)
const isDev = process.env.NODE_ENV === 'development' ||
              process.env.ELECTRON_IS_DEV === '1' ||
              process.defaultApp === true

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    frame: false,
    autoHideMenuBar: true,
    width: 540,
    height: 960,
    minWidth: 360,
    minHeight: 640,
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Hide menu bar explicitly
  mainWindow.setMenuBarVisibility(false)

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    // Production: Use HTTP server to serve static files (file:// doesn't work with absolute paths)
    const port = 3847
    const staticPath = path.join(__dirname, '..', '.output', 'public')
    
    require('http').createServer((req, res) => {
      let filePath = path.join(staticPath, req.url === '/' ? 'index.html' : req.url)
      
      // Handle SPA routes - serve index.html for non-file paths
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(staticPath, 'index.html')
      }
      
      const ext = path.extname(filePath)
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
      }[ext] || 'text/plain'
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      })
    }).listen(port, () => {
      mainWindow.loadURL(`http://localhost:${port}`)
    })
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  // macOS: recreate window if dock icon clicked and no windows
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Windows/Linux: quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})