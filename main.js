const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const path  = require('path');
const url = require('url');

let mainWindow;
let addTodoWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    // mainWindow.webContents.openDevTools();  

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
        mainWindow = null;
    });

    const customMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(customMenu);

}

function createAddTodoWindow() {
    addTodoWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add New Todo'
    });

    addTodoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }));

    addTodoWindow.on('closed', () => {
        addTodoWindow = null;
    });
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click: function () {
                    createAddTodoWindow();
                }
            },
            {
                label: "Clear Todo's",
                click: function() {
                    mainWindow.webContents.send('todo:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click: function() {
                    app.quit();
                }
            },
        ]
    }
];

if(process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
                click: function(item, focusedWindow) {
                    focusedWindow.webContents.openDevTools();
                }
            },
            { role: 'reload' }
        ]
    });
}

app.on('ready', createMainWindow);

ipcMain.on('todo:add', (event, value) => {
    mainWindow.webContents.send('todo:new', value);
    addTodoWindow.close();
});

app.on('window-all-closed', () => {
    // except mac os close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // mac os specific close process
    if (win === null) {
        createWindow();
    }
});