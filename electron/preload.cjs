// Preload script for Electron
// This file runs in a sandboxed context with access to:
// - Electron's preload API (contextBridge if exposed)
// - Limited Node.js functionality (contextIsolation: true means nodeIntegration: false)
//
// Currently empty — context bridge APIs can be added here if needed
// Example: contextBridge.exposeInMainWorld('electronAPI', { ... })