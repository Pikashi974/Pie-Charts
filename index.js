const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const express = require("express");
const expressApp = require("./express"); //your express app

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1290,
    height: 1080,
    icon: path.join(__dirname, "src/img/icon.png"),
    webPreferences: {
      // preload: path.join(__dirname, "src/js/preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  // win.loadFile("src/ui/login.html");
  win.loadURL("http://localhost:3000/");
};

app.whenReady().then(() => {
  express();
  createWindow();
  app.on("activate", () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
