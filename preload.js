window.services = {
  getPluginId: () => (typeof utools !== 'undefined' && utools.getNativeId ? utools.getNativeId() : 'demo-plugin-id'),

  hasNativeExport: () => {
    return typeof utools !== 'undefined' && typeof utools.createBrowserWindow === 'function';
  },

  captureExportPage: async ({ url, width, height }) => {
    if (typeof utools === 'undefined' || typeof utools.createBrowserWindow !== 'function') {
      throw new Error('Native export bridge is unavailable');
    }

    const exportWin = utools.createBrowserWindow(url, {
      show: false,
      frame: false,
      useContentSize: true,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      width,
      height
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const captureTarget = typeof exportWin.capturePage === 'function'
        ? exportWin
        : exportWin && exportWin.webContents;

      if (!captureTarget || typeof captureTarget.capturePage !== 'function') {
        throw new Error('capturePage is unavailable');
      }

      const image = await captureTarget.capturePage();
      return image.toDataURL();
    } finally {
      if (exportWin && typeof exportWin.destroy === 'function') {
        exportWin.destroy();
      } else if (exportWin && typeof exportWin.close === 'function') {
        exportWin.close();
      }
    }
  }
};

console.log('Preload script loaded');
