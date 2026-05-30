/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-boot local express helper
let serverInstance;

// 1. Add Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException');
  console.error(err);
  console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('[FATAL] unhandledRejection');
  console.error(err);
});

function startBackendServer() {
  console.log('[BOOT] Electron started');
  console.log('[BOOT] Calling import(server.cjs)...');

  import('./dist/server.cjs')
    .then(() => {
      console.log('[BOOT] Backend module loaded');
    })
    .catch((err) => {
      console.error('[BOOT] Backend module load failed');
      console.error(err);
      console.error(err.stack);
    });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    title: 'Rebase Overlord — Local Control Center',
    backgroundColor: '#060814',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Diagnostics: Open developer tools to debug black screens
  mainWindow.webContents.openDevTools();

  // Diagnostics: Track loading failures
  mainWindow.webContents.on('did-fail-load', (...args) => {
    console.error('did-fail-load', args);
  });

  // Load the running localhost app (served by the express static layer on 3000)
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000').catch((e) => {
      console.log('HTTP 3000 is still warming up. Retrying load...', e.message);
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000').catch((re) => {
          console.error('Failed to load local viewport. Make sure backend is running.', re);
        });
      }, 1500);
    });
  }, 1000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Set NODE_ENV according to packaging state to prevent development Vite middleware in bundled builds
  process.env.NODE_ENV = app.isPackaged ? 'production' : 'development';
  console.log('App isPackaged:', app.isPackaged, '-> NODE_ENV set to:', process.env.NODE_ENV);

  // Spin up local Node Express server thread
  startBackendServer();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
