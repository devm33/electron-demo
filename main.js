// Modules to control application life and create native browser window
const {app, BrowserWindow, utilityProcess, MessageChannelMain, net, session} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true
    }
  })

  app.on('child-process-gone', (ev, details) => {
    console.log(details.type)
    console.log(details.exitCode)
  })

  app.on('login', (event, webContents, details, callback) => {
    // Signal we handle this event on our own, otherwise
		// Electron will ignore our provided credentials.
		event.preventDefault();

    console.log('app received login event',
      '\nevent', event,
      '\nwebConents', webContents,
      '\ndetails', details,
      // '\nauthInfo', authInfo,
      '\ncallback', callback
    );
    callback('user', 'pass');
  })
  mainWindow.webContents.on('login', (event, webContents, details, authInfo, callback) => {
    console.log('webContents received login event',event, webContents, req, authInfo);
  })

  const proxyRules = 'http://localhost:8080';
  const proxy = { proxyRules, proxyBypassRules: '<local>', pacScript: '' };
  mainWindow.webContents.session.setProxy(proxy)
  session.defaultSession.setProxy(proxy);
  app.setProxy(proxy);

  mainWindow.webContents.session.fetch('https://github.com').then((response) => {
    console.log("main session.fetch status", response.status);
  });

  // net.fetch('http://httpbin.org/basic-auth/foo/bar').then((response) => {
  //   console.log("main net.fetch status", response.status);
  // });

  net.fetch('https://example.com').then((response) => {
    console.log("main net.fetch status", response.status);
  });

  // net.resolveHost('github.com').then((result) => {
  //   console.log("net.resolveHost(github.com)", result);
  // }).catch((err) => {
  //   console.log("ERROR in net.resolveHost(github.com)", err, err.message);
  // });

  const { port1, port2 } = new MessageChannelMain()
  const child = new utilityProcess.fork(path.join(__dirname, 'net-test.js'), 
        ['--test', '--test2', '--test3'], {
        // execArgv: ['--inspect-brk=9229'],
        respondToAuthRequestsFromMainProcess: true,
        stdio: ['ignore', 'pipe', 'pipe'] // ignore, inherit, pipe
  })
  if (child.stdout) {
    child.stdout.on('data', (data) => {
      console.log(`From MAIN process : ${data}`)
    })
  }
  if (child.stderr) {
    child.stderr.on('data', (data) => {
      console.log(`From MAIN process STDERR : ${data}`)
    })
  }
  child.postMessage(null, [port2])

  child.on('spawn', () => {
    console.log(`child spawned : ${child.pid}`)
  })

  child.on('exit', (event, code) => {
    exited = true
    console.log(`child exited with ${code} : ${child.pid}`);
    app.quit();
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  // and load the index.html of the app.
  mainWindow.loadURL('data:text/html,<html><body><h1>Hello World!</h1></body></html>')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') 
  app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
