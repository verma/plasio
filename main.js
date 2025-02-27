const { app, BrowserWindow } = require('electron');
const path = require('path');

// 添加日志
const log = require('electron-log');
log.transports.file.level = 'info';
log.info('应用程序启动');

function createWindow() {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false, // 允许加载本地资源
            allowRunningInsecureContent: true // 允许加载混合内容
        }
    });

    log.info('创建主窗口');

    // 加载构建目录中的 index.html
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    
    // 打开开发者工具以便调试
    // mainWindow.webContents.openDevTools();

    // 监听页面加载完成事件
    mainWindow.webContents.on('did-finish-load', () => {
        log.info('页面加载完成');
    });

    // 监听页面加载失败事件
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        log.error('页面加载失败:', errorDescription);
    });

    mainWindow.on('closed', () => {
        log.info('主窗口关闭');
    });
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 当所有窗口都被关闭时退出
app.on('window-all-closed', () => {
    log.info('所有窗口关闭，准备退出应用');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

process.on('uncaughtException', (error) => {
    log.error('未捕获的异常：', error);
}); 