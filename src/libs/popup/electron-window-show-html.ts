// import { app, BrowserWindow } from 'electron';

// let mainWindow: BrowserWindow | null = null;

// app.whenReady().then(() => {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });

//   mainWindow.loadFile('electron-window.html');

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (mainWindow === null) {
//     mainWindow = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {
//         nodeIntegration: true,
//       },
//     });

//     // mainWindow.loadFile('src/libs/popup/electron-window.html');
//     mainWindow.loadFile('1.html');

//     mainWindow.on('closed', () => {
//       mainWindow = null;
//     });
//   }
// });


// import { app, BrowserWindow } from 'electron';
//
// let mainWindow: BrowserWindow | null = null;
//
// app.whenReady().then(() => {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });
//
//   mainWindow.loadFile('electron-window.html');
//
//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// });
//
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
//
// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
