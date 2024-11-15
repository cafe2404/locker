import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut,
  ipcMain,
  nativeTheme,
  shell
} from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon-square.png?asset'
import initializeDatabase from './services/database'
import {
  registerUser,
  getAllUsers,
  authenticateUser,
  updateAvatar,
  updatePassword,
  deleteUser,
  getCurrentUser
} from './services/userService'
import {
  createPasswordData,
  deletePasswordData,
  exportPasswordData,
  getPasswordData,
  importPasswordData,
  updatePasswordData
} from './services/passwordDataService'
import { openCsvFile, readCsvFile, saveCsvFile } from './services/FileService'

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from './services/categoryService'
import { getUserSettings, updateUserSettings } from './services/settingService'
import { exec } from 'child_process'

let db
let mainWindow
let tray
let isQuitting = false // Cờ kiểm soát thoát ứng dụng
// Đặt lại thư mục cache, tránh không cho dữ liệu bị lưu vào cache
const cacheDir = join(app.getPath('userData'), 'cache')
app.setPath('cache', cacheDir)
app.commandLine.appendSwitch('disable-gpu') // Tắt GPU nếu GPU gây ra giật

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 800,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    title: 'Locker',
    icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      contextIsolation: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}

function showWindow() {
  mainWindow.show()
  mainWindow.focus()
}

async function createTray() {
  tray = new Tray(icon) // Đường dẫn tới icon của bạn

  // Hiển thị hoặc ẩn cửa sổ khi nhấp vào tray icon
  tray.on('click', showWindow)
  // Tạo menu cho tray icon
  const users = await getAllUsers(db)
  const contextMenu = Menu.buildFromTemplate([
    ...users.map((user) => ({
      label: user.username,
      click: () => {
        mainWindow.webContents.send('select-user', user)
        showWindow()
      }
    })),
    {
      label: 'Thoát',
      click: () => {
        isQuitting = true // Đặt cờ isQuitting thành true để cho phép thoát
        app.quit() // Thoát hoàn toàn ứng dụng
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Locker')
}

app.whenReady().then(async () => {
  db = await initializeDatabase()
  await createTray()

  electronApp.setAppUserModelId('com.electron')

  globalShortcut.register('Control+Shift+Space', toggleWindow)

  createWindow()
  // Lắng nghe sự kiện đăng ký người dùng
  ipcMain.handle('register-user', async (_, { username, avatar, password }) => {
    return await registerUser(db, { username, avatar, password })
  })

  // Lắng nghe sự kiện lấy danh sách người dùng
  ipcMain.handle('get-all-users', async () => {
    return await getAllUsers(db)
  })
  // Lắng nghe sự kiện cập nhật ảnh đại diện
  ipcMain.handle('update-avatar', async (_, { avatar }) => {
    return await updateAvatar(db, { avatar })
  })
  // Lắng nghe sự kiện cập nhật mật khẩu
  ipcMain.handle('update-password', async (_, { password, newPassword }) => {
    return await updatePassword(password, newPassword)
  })
  ipcMain.handle('delete-user', async (_, username) => {
    return await deleteUser(db, username)
  })
  // Lắng nghe sự kiện xác thực người dùng
  ipcMain.handle('authenticate-user', async (_, { username, password }) => {
    return await authenticateUser(db, { username, password })
  })
  // Lắng nghe sự kiện lấy cài đặt người dùng
  ipcMain.handle('get-user-settings', async () => {
    return await getUserSettings(db)
  })
  // Lắng nghe sự kiện cập nhật cài đặt người dùng
  ipcMain.handle('update-user-settings', async (_, data) => {
    return await updateUserSettings(db, data)
  })
  // Lắng nghe sự kiện tạo dữ liệu mật khẩu
  ipcMain.handle('create-password-data', async (_, data) => {
    return await createPasswordData(db, data)
  })
  // Lắng nghe sự kiện lấy dữ liệu mật khẩu
  ipcMain.handle('get-password-data', async () => {
    return await getPasswordData(db)
  })
  // Lắng nghe sự kiện cập nhật dữ liệu mật khẩu
  ipcMain.handle('update-password-data', async (_, data) => {
    return await updatePasswordData(db, data)
  })
  ipcMain.handle('delete-password-data', async (_, id) => {
    return await deletePasswordData(db, id)
  })
  ipcMain.handle('export-password-data', async (_, { filePath }) => {
    return await exportPasswordData(db, { filePath })
  })
  ipcMain.handle('import-password-data', async (_, { filePath }) => {
    return await importPasswordData(db, { filePath })
  })

  ipcMain.handle('get-categories', async () => {
    return await getCategories(db)
  })
  ipcMain.handle('create-category', async (_, data) => {
    return await createCategory(db, data)
  })
  ipcMain.handle('update-category', async (_, data) => {
    return await updateCategory(db, data)
  })
  ipcMain.handle('delete-category', async (_, id) => {
    return await deleteCategory(db, { id })
  })
  // Lắng nghe sự kiện chọn file
  ipcMain.handle('open-csv', async () => {
    return await openCsvFile()
  })
  ipcMain.handle('save-csv', async () => {
    return await saveCsvFile()
  })
  // Lắng nghe sự kiện đọc file CSV
  ipcMain.handle('read-csv', async (_, filePath) => {
    return await readCsvFile(filePath)
  })

  // Lắng nghe sự kiện thay đổi giao diện từ Renderer
  ipcMain.on('change-theme', (_, theme) => {
    switch (theme) {
      case 'dark':
        nativeTheme.themeSource = 'dark'
        break
      case 'light':
        nativeTheme.themeSource = 'light'
        break
      case 'system':
      default:
        nativeTheme.themeSource = 'system'
        break
    }
    // Gửi phản hồi lại cho Renderer về trạng thái giao diện mới
    mainWindow.webContents.send('theme-updated', nativeTheme.themeSource)
  })
  // Lắng nghe yêu cầu mở ứng dụng bên ngoài với đường dẫn được gửi từ React
  ipcMain.on('open-external-app', (_, appPath) => {
    exec(`"${appPath}"`, (error) => {
      // Đặt đường dẫn trong dấu ngoặc kép để tránh lỗi liên quan đến khoảng trắng
      if (error) {
        console.error(`Không thể mở ứng dụng: ${error.message}`)
      }
    })
  })
  ipcMain.on('open-url', (_, url) => {
    shell.openExternal(url).catch((error) => {
      console.error(`Không thể mở URL: ${error.message}`)
    })
  })
  // Nhận sự kiện từ renderer để thay đổi cài đặt khởi động cùng hệ thống
  ipcMain.on('toggle-startup', (_, enable) => {
    console.log(app.getLoginItemSettings().openAtLogin)
    app.setLoginItemSettings({
      openAtLogin: enable
    })
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
      mainWindow.webContents.send('lock-app')
    }
  })
  // Ẩn cửa sổ khi mất focus
  mainWindow.on('blur', async (event) => {
    event.preventDefault()
    const currentUser = await getCurrentUser()
    if (currentUser?.id) {
      const settings = await getUserSettings(db)
      if (settings.auto_lock_on_blur) {
        mainWindow.webContents.send('lock-app')
      }
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  app.commandLine.appendSwitch('enable-experimental-web-name-features')
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
