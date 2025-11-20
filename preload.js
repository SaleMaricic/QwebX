const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    windowControl: (action, data) => ipcRenderer.invoke('window-control', action, data),

    // Tab controls
    newTab: (url) => ipcRenderer.invoke('new-tab', url),
    navigate: (url, viewId) => ipcRenderer.invoke('navigate', url, viewId),
    controlTab: (action, viewId) => ipcRenderer.invoke('control-tab', action, viewId),

    // Download functionality
    downloadFile: (url) => ipcRenderer.invoke('download-file', url),

    // Context menu
    showContextMenu: () => ipcRenderer.invoke('show-context-menu'),
    copyText: (text) => ipcRenderer.invoke('copy-text', text),
    pasteText: () => ipcRenderer.invoke('paste-text'),

    // Image download
    downloadImage: (imageUrl, filename) => ipcRenderer.invoke('download-image', imageUrl, filename),

    // Custom folder management
    setCustomFolder: () => ipcRenderer.invoke('set-custom-folder'),

    // Print functionality
    printPage: (viewId) => ipcRenderer.invoke('print-page', viewId),

    // ========== DODATAK ZA DETEKCIJU PLATFORME ==========
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    // ========== KRAJ DODATKA ==========

    // About menu funkcionalnosti
    openAboutPage: () => ipcRenderer.invoke('open-about-page'),
    openDownloadsFolder: () => ipcRenderer.invoke('open-downloads-folder'),
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

    // Globalne prečice
    onGlobalShortcut: (callback) => ipcRenderer.on('global-shortcut', callback),
    executeShortcutAction: (action, data) => ipcRenderer.invoke('global-shortcut-action', action, data),

    // Event listeners
    onTabCreated: (callback) => ipcRenderer.on('tab-created', callback),
    onTabUpdated: (callback) => ipcRenderer.on('tab-updated', callback),
    onTabSwitched: (callback) => ipcRenderer.on('tab-switched', callback),
    onTabClosed: (callback) => ipcRenderer.on('tab-closed', callback),

    // Download events
    onDownloadStart: (callback) => ipcRenderer.on('download-start', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onDownloadComplete: (callback) => ipcRenderer.on('download-complete', callback),
    onDownloadFailed: (callback) => ipcRenderer.on('download-failed', callback),

    // URL display
    onTargetUrlDisplay: (callback) => ipcRenderer.on('target-url-display', callback),

    // Custom folder events
    onCustomFolderSet: (callback) => ipcRenderer.on('custom-folder-set', callback),

    // Remove listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});