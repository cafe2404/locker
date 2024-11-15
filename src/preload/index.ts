import { clipboard, contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  registerUser: async ({username, avatar, password}) => {
    return await ipcRenderer.invoke('register-user', {username, avatar, password});
  },
  getAllUsers: async () => {
    return await ipcRenderer.invoke('get-all-users');
  },
  authenticateUser: async ({username,password}) => {
    return await ipcRenderer.invoke('authenticate-user', {username,password});
  },
  updateAvatar: async ({ avatar }) => {
    return await ipcRenderer.invoke('update-avatar', { avatar });
  },
  updatePassword: async ({password, newPassword}) => {
    return await ipcRenderer.invoke('update-password', { password,newPassword});
  },
  deleteUser: async (user_id:number) => {
    return await ipcRenderer.invoke('delete-user', user_id);
  },
  getUserSettings: async () => {
    return await ipcRenderer.invoke('get-user-settings');
  },
  updateUserSettings: async (data) => {
    return await ipcRenderer.invoke('update-user-settings', data);
  },
  // passwordData
  createPasswordData: async (data) => {
    return await ipcRenderer.invoke('create-password-data', data);
  },
  getPasswordData: async () => {
    return await ipcRenderer.invoke('get-password-data', );
  },
  getPasswordDataById: async ({id}) => {
    return await ipcRenderer.invoke('get-password-data-by-id', {id});
  },
  updatePasswordData: async (data) => {
    return await ipcRenderer.invoke('update-password-data', data);
  },
  deletePasswordData: async (id:number) => {
    return await ipcRenderer.invoke('delete-password-data', id);
  },
  exportPasswordData: async (data) => {
    return await ipcRenderer.invoke('export-password-data', data);
  },
  importPasswordData: async (data) => {
    return await ipcRenderer.invoke('import-password-data', data);
  },
  //category
  getCategories: async () => {
    return await ipcRenderer.invoke('get-categories');
  },
  createCategory: async (data) => {
    return await ipcRenderer.invoke('create-category', data);
  },
  updateCategory: async (data) => {
    return await ipcRenderer.invoke('update-category', data);
  },
  deleteCategory: async (id:number) => {
    return await ipcRenderer.invoke('delete-category', id);
  },
  //clipboard
  clipboard: {
    writeText: (text: string) => clipboard.writeText(text)
  },
  //shell
  shell:{
    openExternal: (url: string) => shell.openExternal(url)
  },
  //file
  openCsvFile: async () => {
    return await ipcRenderer.invoke('open-csv');
  },
  saveCsvFile: async (filePath: string, data: any[]) => {
    return await ipcRenderer.invoke('save-csv', {filePath, data});
  },
  readCsvFile: async (filePath: string) => {
    return await ipcRenderer.invoke('read-csv', filePath);
  },
  openExternalApp: (appPath:string) => ipcRenderer.send('open-external-app', appPath),
  openURL: (url:string) => ipcRenderer.send('open-url', url),
  toggleStartUp: (enable:boolean) => {
    ipcRenderer.send('toggle-startup', enable)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api

}
