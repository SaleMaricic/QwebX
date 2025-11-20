const { app, BrowserWindow, ipcMain, BrowserView, Menu, clipboard, session, dialog, net, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// ========== DODATAK ZA GLOBALNI USER AGENT ==========
app.on('ready', () => {
  const defaultSession = session.defaultSession;
  const customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15';

  defaultSession.setUserAgent(customUserAgent);
  console.log('🌐 Globalni User Agent postavljen:', customUserAgent);
});
// ========== KRAJ DODATKA ==========

// Linux-specific optimizations
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('--enable-features', 'UseOzonePlatform');
  app.commandLine.appendSwitch('--ozone-platform', 'x11');
}

// Handle GPU errors
app.commandLine.appendSwitch('--ignore-gpu-blocklist');
app.commandLine.appendSwitch('--enable-gpu-rasterization');
app.commandLine.appendSwitch('--enable-zero-copy');
app.commandLine.appendSwitch('--disable-gpu-sandbox');

let mainWindow;

// ========== GLOBALNE PREČICE ==========
function registerGlobalShortcuts() {
    console.log('🔧 Registrujem globalne prečice...');

    // Globalne prečice koje rade u celom browseru
    const { globalShortcut } = require('electron');

    // Ukloni sve postojeće prečice prvo
    globalShortcut.unregisterAll();

    // CTRL+T - Novi tab
    globalShortcut.register('CommandOrControl+T', () => {
        console.log('📌 Prečica: Ctrl+T - Novi tab');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'new-tab');
        }
    });

    // CTRL+W - Zatvori tab
    globalShortcut.register('CommandOrControl+W', () => {
        console.log('📌 Prečica: Ctrl+W - Zatvori tab');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'close-tab');
        }
    });

    // CTRL+N - Novi prozor (ne podržano trenutno, redirect na novi tab)
    globalShortcut.register('CommandOrControl+N', () => {
        console.log('📌 Prečica: Ctrl+N - Novi tab (umesto novog prozora)');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'new-tab');
        }
    });

    // CTRL+R - Osveži
    globalShortcut.register('CommandOrControl+R', () => {
        console.log('📌 Prečica: Ctrl+R - Osveži');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'reload');
        }
    });

    // F5 - Osveži
    globalShortcut.register('F5', () => {
        console.log('📌 Prečica: F5 - Osveži');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'reload');
        }
    });

    // CTRL+L - Fokus na adresnu traku
    globalShortcut.register('CommandOrControl+L', () => {
        console.log('📌 Prečica: Ctrl+L - Fokus na adresnu traku');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'focus-address-bar');
        }
    });

    // CTRL+H - Istorija (otvara about stranicu kao placeholder)
    globalShortcut.register('CommandOrControl+H', () => {
        console.log('📌 Prečica: Ctrl+H - Istorija');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'show-history');
        }
    });

    // CTRL+J - Preuzimanja
    globalShortcut.register('CommandOrControl+J', () => {
        console.log('📌 Prečica: Ctrl+J - Preuzimanja');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'show-downloads');
        }
    });

    // CTRL+D - Dodaj u omiljene (placeholder)
    globalShortcut.register('CommandOrControl+D', () => {
        console.log('📌 Prečica: Ctrl+D - Dodaj u omiljene');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'add-bookmark');
        }
    });

    // CTRL+P - Štampanje
    globalShortcut.register('CommandOrControl+P', () => {
        console.log('📌 Prečica: Ctrl+P - Štampanje');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'print');
        }
    });

    // CTRL+Tab - Sledeći tab
    globalShortcut.register('Control+Tab', () => {
        console.log('📌 Prečica: Ctrl+Tab - Sledeći tab');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'next-tab');
        }
    });

    // CTRL+Shift+Tab - Prethodni tab
    globalShortcut.register('Control+Shift+Tab', () => {
        console.log('📌 Prečica: Ctrl+Shift+Tab - Prethodni tab');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'previous-tab');
        }
    });

    // F12 - Developer Tools
    globalShortcut.register('F12', () => {
        console.log('📌 Prečica: F12 - Developer Tools');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'devtools');
        }
    });

    // F11 - Ceo ekran
    globalShortcut.register('F11', () => {
        console.log('📌 Prečica: F11 - Ceo ekran');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'toggle-fullscreen');
        }
    });

    // Alt+Left - Nazad
    globalShortcut.register('Alt+Left', () => {
        console.log('📌 Prečica: Alt+Left - Nazad');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'go-back');
        }
    });

    // Alt+Right - Napred
    globalShortcut.register('Alt+Right', () => {
        console.log('📌 Prečica: Alt+Right - Napred');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-shortcut', 'go-forward');
        }
    });

    console.log('✅ Globalne prečice registrovane');
}

// Registruj prečice kada je app ready
app.whenReady().then(() => {
    createWindow();
    registerGlobalShortcuts();
});

let views = new Map();
let nextViewId = 1;
let activeViewId = null;


// Download management
let downloadInProgress = false;
let processedDownloadUrls = new Set();

// Image download management
let lastImageSavePath = null;

// Custom download folder management
let customDownloadFolder = null;

// Helper funkcija za bezbedno slanje event-a
function safeSend(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents && !mainWindow.webContents.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

// Helper funkcija za proveru da li je URL slika
function isImageUrl(url) {
  if (!url) return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const imagePatterns = ['/images/', 'image/', 'img/', 'phot', 'picture'];

  const lowerUrl = url.toLowerCase();

  // Proveri ekstenzije
  for (const ext of imageExtensions) {
    if (lowerUrl.includes(ext)) {
      return true;
    }
  }

  // Proveri pattern-e u putanji
  for (const pattern of imagePatterns) {
    if (lowerUrl.includes(pattern)) {
      return true;
    }
  }

  return false;
}

// Helper funkcija za ekstrakciju imena fajla iz URL-a
function getFilenameFromUrl(url) {
  if (!url) return 'image';

  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1];

  // Ukloni query parametre
  filename = filename.split('?')[0];
  filename = filename.split('#')[0];

  // Osiguraj ekstenziju
  if (!filename.includes('.')) {
    filename += '.jpg';
  }

  return filename;
}

// Funkcija za postavljanje custom download foldera
async function setCustomDownloadFolder() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Odredi Folder za Snimanje',
      buttonLabel: 'Odaberi Folder',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: customDownloadFolder || app.getPath('downloads')
    });

    if (!result.canceled && result.filePaths.length > 0) {
      customDownloadFolder = result.filePaths[0];
      console.log('✅ Custom download folder set to:', customDownloadFolder);

      // Obavesti frontend da je folder postavljen
      safeSend('custom-folder-set', {
        path: customDownloadFolder,
        folderName: path.basename(customDownloadFolder)
      });
    }
  } catch (error) {
    console.error('Error setting custom folder:', error);
  }
}

// Automatski download slike u custom folder
async function downloadImageAuto(imageUrl, suggestedFilename = null) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.log('Main window not available for image download');
    return;
  }

  try {
    // Odredi ime fajla
    let fileName = suggestedFilename;
    if (!fileName) {
      const urlParts = imageUrl.split('/');
      fileName = urlParts[urlParts.length - 1] || 'image.jpg';
      if (!fileName.includes('.')) {
        fileName += '.jpg';
      }
    }

    // Odredi putanju - koristi custom folder ako je postavljen, inace default downloads
    const downloadPath = customDownloadFolder || app.getPath('downloads');
    const filePath = path.join(downloadPath, fileName);

    console.log('📸 Auto-downloading image to:', filePath);

    // Ručno preuzimanje slike
    const request = net.request(imageUrl);
    const fileStream = fs.createWriteStream(filePath);
    let downloadStarted = false;

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        console.log('Image download failed with status:', response.statusCode);
        safeSend('download-failed', {
          id: Date.now(),
          state: `HTTP ${response.statusCode}`
        });
        return;
      }

      if (!downloadStarted) {
        safeSend('download-start', {
          id: Date.now(),
          filename: fileName,
          totalBytes: parseInt(response.headers['content-length']) || 0,
          path: filePath,
          auto: true
        });
        downloadStarted = true;
      }

      let receivedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length']) || 0;
      let lastProgressUpdate = 0;

      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        fileStream.write(chunk);

        const now = Date.now();
        if (now - lastProgressUpdate > 100) {
          const progress = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;

          safeSend('download-progress', {
            id: Date.now(),
            filename: fileName,
            receivedBytes: receivedBytes,
            totalBytes: totalBytes,
            progress: progress,
            auto: true
          });

          lastProgressUpdate = now;
        }
      });

      response.on('end', () => {
        fileStream.end();
        safeSend('download-complete', {
          id: Date.now(),
          path: filePath,
          auto: true
        });
        console.log('✅ Image auto-downloaded successfully:', filePath);
      });
    });

    request.on('error', (error) => {
      fileStream.end();
      safeSend('download-failed', {
        id: Date.now(),
        state: error.message
      });
      console.log('❌ Image auto-download error:', error);
    });

    request.end();

  } catch (error) {
    console.error('❌ Error auto-downloading image:', error);
    safeSend('download-failed', {
      id: Date.now(),
      state: error.message
    });
  }
}

// Automatski download fajlova u custom folder
async function handleAutoDownload(downloadUrl, fileName) {
  if (downloadInProgress) {
    console.log('Download already in progress, skipping:', downloadUrl);
    return;
  }

  const downloadKey = downloadUrl;
  if (processedDownloadUrls.has(downloadKey)) {
    console.log('Download already processed, skipping:', downloadUrl);
    return;
  }

  downloadInProgress = true;
  processedDownloadUrls.add(downloadKey);

  const downloadId = Date.now();

  try {
    // Odredi putanju - koristi custom folder ako je postavljen, inace default downloads
    const downloadPath = customDownloadFolder || app.getPath('downloads');
    const filePath = path.join(downloadPath, fileName);

    console.log('Auto-downloading to:', filePath);

    const request = net.request(downloadUrl);
    let downloadStarted = false;

    request.on('response', (response) => {
      const totalBytes = parseInt(response.headers['content-length']) || 0;
      let receivedBytes = 0;

      console.log('Auto-download started, status:', response.statusCode);

      if (response.statusCode !== 200) {
        safeSend('download-failed', {
          id: downloadId,
          state: `HTTP ${response.statusCode}`
        });
        downloadInProgress = false;
        processedDownloadUrls.delete(downloadKey);
        return;
      }

      if (!downloadStarted) {
        safeSend('download-start', {
          id: downloadId,
          filename: fileName,
          totalBytes: totalBytes,
          path: filePath,
          auto: true
        });
        downloadStarted = true;
      }

      const fileStream = fs.createWriteStream(filePath);
      let lastProgressUpdate = 0;

      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        fileStream.write(chunk);

        const now = Date.now();
        if (now - lastProgressUpdate > 100) {
          const progress = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;

          safeSend('download-progress', {
            id: downloadId,
            filename: fileName,
            receivedBytes: receivedBytes,
            totalBytes: totalBytes,
            progress: progress,
            auto: true
          });

          lastProgressUpdate = now;
        }
      });

      response.on('end', () => {
        fileStream.end();
        safeSend('download-complete', {
          id: downloadId,
          path: filePath,
          auto: true
        });
        console.log('Auto-download completed successfully');
        downloadInProgress = false;
        processedDownloadUrls.delete(downloadKey);
      });

      response.on('error', (error) => {
        fileStream.end();
        safeSend('download-failed', {
          id: downloadId,
          state: error.message
        });
        console.log('Auto-download failed:', error);
        downloadInProgress = false;
        processedDownloadUrls.delete(downloadKey);
      });
    });

    request.on('error', (error) => {
      safeSend('download-failed', {
        id: downloadId,
        state: error.message
      });
      console.log('Auto-download request failed:', error);
      downloadInProgress = false;
      processedDownloadUrls.delete(downloadKey);
    });

    request.end();

  } catch (error) {
    console.error('Error in auto download handler:', error);
    downloadInProgress = false;
    processedDownloadUrls.delete(downloadKey);
  }
}

// Manualni download sa dijalogom
async function handleManualDownload(downloadUrl, fileName) {
  if (downloadInProgress) {
    console.log('Download already in progress, skipping:', downloadUrl);
    return;
  }

  const downloadKey = downloadUrl;
  if (processedDownloadUrls.has(downloadKey)) {
    console.log('Download already processed, skipping:', downloadUrl);
    return;
  }

  downloadInProgress = true;
  processedDownloadUrls.add(downloadKey);

  const downloadId = Date.now();

  try {
    console.log('Showing save dialog for:', fileName);

    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(app.getPath('downloads'), fileName),
      title: 'Sačuvaj fajl',
      buttonLabel: 'Sačuvaj',
      properties: ['createDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Svi fajlovi', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      const filePath = result.filePath;
      console.log('User selected path:', filePath);

      const request = net.request(downloadUrl);
      let downloadStarted = false;

      request.on('response', (response) => {
        const totalBytes = parseInt(response.headers['content-length']) || 0;
        let receivedBytes = 0;

        console.log('Download started, status:', response.statusCode);

        if (response.statusCode !== 200) {
          safeSend('download-failed', {
            id: downloadId,
            state: `HTTP ${response.statusCode}`
          });
          downloadInProgress = false;
          processedDownloadUrls.delete(downloadKey);
          return;
        }

        if (!downloadStarted) {
          safeSend('download-start', {
            id: downloadId,
            filename: fileName,
            totalBytes: totalBytes,
            path: filePath
          });
          downloadStarted = true;
        }

        const fileStream = fs.createWriteStream(filePath);
        let lastProgressUpdate = 0;

        response.on('data', (chunk) => {
          receivedBytes += chunk.length;
          fileStream.write(chunk);

          const now = Date.now();
          if (now - lastProgressUpdate > 100) {
            const progress = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;

            safeSend('download-progress', {
              id: downloadId,
              filename: fileName,
              receivedBytes: receivedBytes,
              totalBytes: totalBytes,
              progress: progress
            });

            lastProgressUpdate = now;
          }
        });

        response.on('end', () => {
          fileStream.end();
          safeSend('download-complete', {
            id: downloadId,
            path: filePath
          });
          console.log('Download completed successfully');
          downloadInProgress = false;
          processedDownloadUrls.delete(downloadKey);
        });

        response.on('error', (error) => {
          fileStream.end();
          safeSend('download-failed', {
            id: downloadId,
            state: error.message
          });
          console.log('Download failed:', error);
          downloadInProgress = false;
          processedDownloadUrls.delete(downloadKey);
        });
      });

      request.on('error', (error) => {
        safeSend('download-failed', {
          id: downloadId,
          state: error.message
        });
        console.log('Download request failed:', error);
        downloadInProgress = false;
        processedDownloadUrls.delete(downloadKey);
      });

      request.end();

    } else {
      console.log('Download cancelled by user');
      downloadInProgress = false;
      processedDownloadUrls.delete(downloadKey);
    }
  } catch (error) {
    console.error('Error in manual download handler:', error);
    downloadInProgress = false;
    processedDownloadUrls.delete(downloadKey);
  }
}

// Globalni download handler
function initializeDownloadHandlers() {
  console.log('Initializing global download handler...');

  const defaultSession = session.defaultSession;

  defaultSession.removeAllListeners('will-download');

  defaultSession.on('will-download', (event, item, webContents) => {
    const downloadUrl = item.getURL();
    const fileName = item.getFilename();

    console.log('Processing download:', downloadUrl, fileName);

    if (customDownloadFolder) {
      // Automatski download ako je folder postavljen
      event.preventDefault();
      handleAutoDownload(downloadUrl, fileName);
    } else {
      // Manualni dijalog ako nije postavljen folder
      event.preventDefault();
      handleManualDownload(downloadUrl, fileName);
    }
  });
}

// Očisti stare download-ove svakih 10 minuta
setInterval(() => {
  if (processedDownloadUrls.size > 50) {
    processedDownloadUrls.clear();
    console.log('Cleared download history');
  }
}, 600000);

function createWindow() {
  // Linux-specific window options
  const windowOptions = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false
  };

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.center();

    // Linux-specific: Forsiraj fokus
    if (process.platform === 'linux') {
      setTimeout(() => {
        mainWindow.focus();
        mainWindow.moveTop();
      }, 100);
    }

    initializeDownloadHandlers();
    createNewView('https://abel.rs/zx/');

    // ========== DODATAK ZA POSTOJEĆE TABOVE ==========
    setTimeout(() => {
      const customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15';

      if (views.size > 0) {
        views.forEach((view, viewId) => {
          try {
            const webContents = view.webContents;
            if (!webContents.isDestroyed()) {
              webContents.setUserAgent(customUserAgent);
              webContents.session.setUserAgent(customUserAgent);
              console.log(`✅ User Agent postavljen za postojeći tab ${viewId}`);
            }
          } catch (error) {
            console.error(`Greška pri postavljanju User Agent-a za tab ${viewId}:`, error);
          }
        });
      }
    }, 2000);
  });

  mainWindow.on('close', (event) => {
    console.log('Closing window, cleaning up views...');
    // Očisti globalne prečice
    const { globalShortcut } = require('electron');
    globalShortcut.unregisterAll();
    console.log('🧹 Globalne prečice očišćene');

    views.forEach((view, viewId) => {
      try {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.removeBrowserView(view);
        }
        if (view.webContents && !view.webContents.isDestroyed()) {
          view.webContents.destroy();
        }
      } catch (error) {
        console.log('Error cleaning up view:', error);
      }
    });
    views.clear();
  });

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });

  mainWindow.on('resize', updateViewBounds);
  mainWindow.on('maximize', updateViewBounds);
  mainWindow.on('unmaximize', updateViewBounds);
}

function updateViewBounds() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const toolbarHeight = 88;
  const statusBarHeight = 25;
  const { width, height } = mainWindow.getBounds();

  views.forEach((view) => {
    if (view && !view.webContents.isDestroyed()) {
      try {
        view.setBounds({
          x: 0,
          y: toolbarHeight,
          width: width,
          height: height - toolbarHeight - statusBarHeight
        });
      } catch (error) {
        console.log('Error updating view bounds:', error);
      }
    }
  });
}

function createNewView(url, activate = true) {
  if (!mainWindow || mainWindow.isDestroyed()) return null;

  const viewId = nextViewId++;
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      nativeWindowOpen: true,
      webSecurity: true
    }
  });

  try {
    mainWindow.addBrowserView(view);

    // ========== DODATAK ZA USER AGENT U TABOVIMA ==========
    try {
      const webContents = view.webContents;
      const customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15';

      webContents.setUserAgent(customUserAgent);
      webContents.session.setUserAgent(customUserAgent);
      console.log('✅ User Agent postavljen za novi tab');
    } catch (error) {
      console.error('Greška pri postavljanju User Agent-a:', error);
    }
    // ========== KRAJ DODATKA ==========

    views.set(viewId, view);

    updateViewBounds();
    view.setAutoResize({ width: true, height: true });

    const webContents = view.webContents;

    // Handler za target="_blank" linkove
    webContents.setWindowOpenHandler(({ url }) => {
      console.log('Opening new window/tab with URL:', url);
      const newTabId = createNewView(url, true);
      return { action: 'deny' };
    });

    // Event listeners za tabove
    webContents.on('did-start-loading', () => {
      safeSend('tab-updated', {
        id: viewId,
        url: webContents.getURL(),
        title: webContents.getTitle(),
        isLoading: true,
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      });
    });

    webContents.on('did-finish-load', () => {
      safeSend('tab-updated', {
        id: viewId,
        url: webContents.getURL(),
        title: webContents.getTitle(),
        isLoading: false,
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      });
    });

    webContents.on('page-title-updated', (event, title) => {
      safeSend('tab-updated', {
        id: viewId,
        url: webContents.getURL(),
        title: title,
        isLoading: webContents.isLoading(),
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      });
    });

    webContents.on('did-navigate', (event, navigationUrl) => {
      safeSend('tab-updated', {
        id: viewId,
        url: navigationUrl,
        title: webContents.getTitle(),
        isLoading: webContents.isLoading(),
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      });
    });

    webContents.on('did-navigate-in-page', (event, navigationUrl) => {
      safeSend('tab-updated', {
        id: viewId,
        url: navigationUrl,
        title: webContents.getTitle(),
        isLoading: webContents.isLoading(),
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      });
    });

    // Hover URL display
    webContents.on('update-target-url', (event, url) => {
      console.log('Target URL updated:', url);

      // Proveri da li je URL slika
      if (url && isImageUrl(url)) {
        console.log('Image URL detected:', url);
        safeSend('target-url-display', {
          url: url,
          type: 'image',
          filename: getFilenameFromUrl(url)
        });
      } else {
        safeSend('target-url-display', {
          url: url,
          type: 'link'
        });
      }
    });

    // Poboljšani context menu za web content
    webContents.on('context-menu', (event, params) => {
      const menuTemplate = [];

      // Proveri da li je kliknuto na sliku
      const isImage = params.mediaType === 'image' ||
                     (params.srcURL && isImageUrl(params.srcURL)) ||
                     (params.linkURL && isImageUrl(params.linkURL));

      // Dodaj "Save Image" ako je slika
      if (isImage) {
        const imageUrl = params.srcURL || params.linkURL;

        // Save Image opcija
        menuTemplate.push({
          label: 'Save Image',
          click: () => {
            console.log('Save image clicked:', imageUrl);
            if (customDownloadFolder) {
              // Automatski snimi ako je folder postavljen
              downloadImageAuto(imageUrl);
            } else {
              // Manualni dijalog ako nije postavljen folder
              downloadImageAuto(imageUrl); // Koristimo auto sa default folderom
            }
          }
        });

        menuTemplate.push({ type: 'separator' });
      }

      // Standardni meni items
      menuTemplate.push(
        {
          label: 'Back',
          click: () => {
            if (webContents.canGoBack()) {
              webContents.goBack();
            }
          },
          enabled: webContents.canGoBack()
        },
        {
          label: 'Forward',
          click: () => {
            if (webContents.canGoForward()) {
              webContents.goForward();
            }
          },
          enabled: webContents.canGoForward()
        },
        { type: 'separator' },
        {
          label: 'Reload',
          click: () => {
            webContents.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Copy',
          click: () => {
            if (params.linkURL) {
              clipboard.writeText(params.linkURL);
            } else if (params.selectionText) {
              clipboard.writeText(params.selectionText);
            } else if (isImage) {
              // Copy image URL
              const imageUrl = params.srcURL || params.linkURL;
              clipboard.writeText(imageUrl);
            }
          },
          enabled: params.linkURL || params.selectionText || isImage
        },
        {
          label: 'Copy Image',
          visible: isImage,
          click: () => {
            const imageUrl = params.srcURL || params.linkURL;
            clipboard.writeText(imageUrl);
          }
        },
        {
          label: 'Paste',
          click: () => {
            webContents.paste();
          }
        },
        { type: 'separator' },
        {
          label: 'Inspect',
          click: () => {
            webContents.inspectElement(params.x, params.y);
          }
        },
        { type: 'separator' },
        {
          label: customDownloadFolder ? `📁 Folder: ${path.basename(customDownloadFolder)}` : '📁 Odredi Folder',
          click: () => {
            setCustomDownloadFolder();
          }
        }
      );

      const contextMenu = Menu.buildFromTemplate(menuTemplate);
      contextMenu.popup();
    });

    // Load URL
    if (url) {
      webContents.loadURL(url).catch(err => {
        console.error('Error loading URL:', err);
      });
    }

    safeSend('tab-created', {
      id: viewId,
      url: url,
      title: 'Nova kartica'
    });

    if (activate) {
      switchToView(viewId);
    }

    return viewId;
  } catch (error) {
    console.error('Error creating view:', error);
    return null;
  }
}

function switchToView(viewId) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const view = views.get(viewId);
  if (!view || view.webContents.isDestroyed()) return;

  try {
    mainWindow.setBrowserView(view);
    activeViewId = viewId;
    view.webContents.focus();

    safeSend('tab-switched', viewId);

    safeSend('tab-updated', {
      id: viewId,
      url: view.webContents.getURL(),
      title: view.webContents.getTitle(),
      isLoading: view.webContents.isLoading(),
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
  } catch (error) {
    console.error('Error switching view:', error);
  }
}

function closeView(viewId) {
  const view = views.get(viewId);
  if (view && mainWindow && !mainWindow.isDestroyed()) {
    console.log('Closing view:', viewId);

    try {
      mainWindow.removeBrowserView(view);

      if (!view.webContents.isDestroyed()) {
        view.webContents.destroy();
      }

      views.delete(viewId);

      safeSend('tab-closed', viewId);

      if (activeViewId === viewId) {
        if (views.size > 0) {
          const lastViewId = Array.from(views.keys())[views.size - 1];
          switchToView(lastViewId);
        } else {
          activeViewId = null;
          createNewView('https://abel.rs/zx/');
        }
      }
    } catch (error) {
      console.error('Error closing view:', error);
    }
  }
}

// Context menu za address bar
function createAddressBarContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Copy',
      role: 'copy'
    },
    {
      label: 'Paste',
      role: 'paste'
    },
    {
      label: 'Cut',
      role: 'cut'
    },
    { type: 'separator' },
    {
      label: 'Select All',
      role: 'selectall'
    }
  ]);
}

// IPC handlers
ipcMain.handle('window-control', (event, action, data) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    switch (action) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
      case 'move':
        // POBOLJŠANO POMERANJE - bez requestAnimationFrame
        if (data && data.screenX !== undefined && data.screenY !== undefined) {
          try {
            // Direktno pomeranje bez kašnjenja
            mainWindow.setPosition(
              Math.round(data.screenX - data.offsetX),
              Math.round(data.screenY - data.offsetY)
            );
          } catch (error) {
            console.error('Error moving window:', error);
          }
        }
        break;
      case 'move-delta':
        // POMERANJE KORISTEĆI DELTA
        if (data && data.deltaX !== undefined && data.deltaY !== undefined) {
          try {
            const [currentX, currentY] = mainWindow.getPosition();
            mainWindow.setPosition(
              currentX + data.deltaX,
              currentY + data.deltaY
            );
          } catch (error) {
            console.error('Error moving window:', error);
          }
        }
        break;
    }
  } catch (error) {
    console.error('Error in window control:', error);
  }
});

ipcMain.handle('new-tab', (event, url) => {
  return createNewView(url || 'https://abel.rs/zx/');
});

ipcMain.handle('navigate', (event, url, viewId) => {
  const view = views.get(viewId);
  if (view && !view.webContents.isDestroyed()) {
    view.webContents.loadURL(url).catch(err => {
      console.error('Error navigating:', err);
    });
  }
});

ipcMain.handle('control-tab', (event, action, viewId) => {
  console.log('Control tab:', action, viewId);

  const view = views.get(viewId);
  if (!view || view.webContents.isDestroyed()) {
    console.log('View not found or destroyed:', viewId);
    return;
  }

  try {
    switch (action) {
      case 'back':
        if (view.webContents.canGoBack()) {
          view.webContents.goBack();
        }
        break;
      case 'forward':
        if (view.webContents.canGoForward()) {
          view.webContents.goForward();
        }
        break;
      case 'reload':
        view.webContents.reload();
        break;
      case 'devtools':
        view.webContents.toggleDevTools();
        break;
      case 'activate':
        switchToView(viewId);
        break;
      case 'close':
        closeView(viewId);
        break;
    }
  } catch (error) {
    console.error('Error in tab control:', error);
  }
});

ipcMain.handle('download-file', async (event, url) => {
  try {
    console.log('Download file requested:', url);

    // Ekstraktuj ime fajla iz URL-a
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1] || 'download';
    fileName = fileName.split('?')[0].split('#')[0];

    if (!fileName.includes('.')) {
      fileName += '.download';
    }

    console.log('Downloading file:', fileName, 'from:', url);

    // Koristi postojeći download handler
    if (customDownloadFolder) {
      await handleAutoDownload(url, fileName);
    } else {
      await handleManualDownload(url, fileName);
    }

    return { success: true, filename: fileName };

  } catch (error) {
    console.error('Error in download-file handler:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('show-context-menu', async (event) => {
  try {
    const menu = createAddressBarContextMenu();
    menu.popup();
  } catch (error) {
    console.error('Error showing context menu:', error);
  }
});

ipcMain.handle('copy-text', async (event, text) => {
  clipboard.writeText(text);
});

ipcMain.handle('paste-text', async (event) => {
  return clipboard.readText();
});

ipcMain.handle('download-image', async (event, imageUrl, filename) => {
  await downloadImageAuto(imageUrl, filename);
});

ipcMain.handle('set-custom-folder', async (event) => {
  await setCustomDownloadFolder();
});

// Print funkcionalnost
ipcMain.handle('print-page', async (event, viewId) => {
  try {
    console.log('Print requested for viewId:', viewId);
    const view = views.get(viewId);
    console.log('View found:', !!view);

    if (view && !view.webContents.isDestroyed()) {
      console.log('Printing page:', view.webContents.getURL());

      view.webContents.print({
        silent: false,
        printBackground: true,
        margins: {
          marginType: 'default'
        },
        pageSize: 'A4'
      }, (success) => {
        if (success) {
          console.log('Print successful - trenutna stranica');
        } else {
          console.log('Print cancelled');
        }
      });
    } else {
      console.log('View not found or destroyed');
    }
  } catch (error) {
    console.error('Error printing page:', error);
  }
});

// ========== DODATAK ZA DETEKCIJU PLATFORME ==========
ipcMain.handle('get-platform', () => {
  return process.platform;
});
// ========== KRAJ DODATKA ==========

// ABOUT MENU HANDLERS
ipcMain.handle('open-about-page', async (event) => {
  try {
    const aboutWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true
      },
      title: 'O programu - QwebX Browser',
      icon: path.join(__dirname, 'build/icon.png'),
      show: false
    });

    aboutWindow.loadFile('about.html');

    aboutWindow.once('ready-to-show', () => {
      aboutWindow.show();
      aboutWindow.center();
    });

    aboutWindow.on('closed', () => {
      aboutWindow = null;
    });

    return { success: true };
  } catch (error) {
    console.error('Error opening about page:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-downloads-folder', async (event) => {
  try {
    const downloadsPath = customDownloadFolder || app.getPath('downloads');
    shell.openPath(downloadsPath);
    return { success: true, path: downloadsPath };
  } catch (error) {
    console.error('Error opening downloads folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-for-updates', async (event) => {
  try {
    // Ovo je placeholder - u realnoj implementaciji bi se proveravao GitHub releases itd.
    const currentVersion = '1.1.7';
    return {
      success: true,
      currentVersion: currentVersion,
      latestVersion: currentVersion,
      updateAvailable: false,
      message: 'Koristite najnoviju verziju QwebX pregledača'
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-system-info', async (event) => {
  try {
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };

    return { success: true, info: systemInfo };
  } catch (error) {
    console.error('Error getting system info:', error);
    return { success: false, error: error.message };
  }
});

// IPC handler za prečice
ipcMain.handle('global-shortcut-action', (event, action, data) => {
    console.log('🔧 Prečica akcija:', action, data);

    try {
        switch (action) {
            case 'new-tab':
                return createNewView('https://abel.rs/zx/', true);

            case 'close-tab':
                if (activeViewId) {
                    closeView(activeViewId);
                }
                return { success: true };

            case 'reload':
                if (activeViewId) {
                    const view = views.get(activeViewId);
                    if (view && !view.webContents.isDestroyed()) {
                        view.webContents.reload();
                    }
                }
                return { success: true };

            case 'focus-address-bar':
                // Ovo će se hendlati u frontendu
                return { success: true };

            case 'print':
                if (activeViewId) {
                    const view = views.get(activeViewId);
                    if (view && !view.webContents.isDestroyed()) {
                        view.webContents.print({
                            silent: false,
                            printBackground: true
                        });
                    }
                }
                return { success: true };

            case 'devtools':
                if (activeViewId) {
                    const view = views.get(activeViewId);
                    if (view && !view.webContents.isDestroyed()) {
                        view.webContents.toggleDevTools();
                    }
                }
                return { success: true };

            case 'toggle-fullscreen':
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
                return { success: true };

            case 'go-back':
                if (activeViewId) {
                    const view = views.get(activeViewId);
                    if (view && view.webContents.canGoBack()) {
                        view.webContents.goBack();
                    }
                }
                return { success: true };

            case 'go-forward':
                if (activeViewId) {
                    const view = views.get(activeViewId);
                    if (view && view.webContents.canGoForward()) {
                        view.webContents.goForward();
                    }
                }
                return { success: true };

            case 'next-tab':
                if (views.size > 1) {
                    const tabIds = Array.from(views.keys());
                    const currentIndex = tabIds.indexOf(activeViewId);
                    const nextIndex = (currentIndex + 1) % tabIds.length;
                    switchToView(tabIds[nextIndex]);
                }
                return { success: true };

            case 'previous-tab':
                if (views.size > 1) {
                    const tabIds = Array.from(views.keys());
                    const currentIndex = tabIds.indexOf(activeViewId);
                    const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
                    switchToView(tabIds[prevIndex]);
                }
                return { success: true };

            default:
                return { success: false, error: 'Nepoznata akcija' };
        }
    } catch (error) {
        console.error('Greška u prečici:', error);
        return { success: false, error: error.message };
    }
});

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Globalni handler za nove prozore
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    console.log('Blocked new window, creating tab instead:', navigationUrl);
    createNewView(navigationUrl, true);
  });

  contents.on('did-create-window', (window, details) => {
    console.log('Did create window, closing and creating tab:', details.url);
    if (window && !window.isDestroyed()) {
      window.close();
    }
    createNewView(details.url, true);
  });
});

app.on('ready', () => {
  Menu.setApplicationMenu(null);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});