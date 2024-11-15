import keytar from 'keytar'
import { Database } from 'sqlite'
import { getUserSettings } from './settingService'
const SERVICE_NAME = 'MyAppPasswordManager'
// Khởi tạo biến lưu thông tin người dùng hiện tại
export let currentUser: IUser

export const registerUser = async (
  db: Database,
  { username, avatar, password }: { username: string; avatar: string; password: string }
): Promise<IUser | boolean> => {
  try {
    // Bắt đầu transaction để đảm bảo cả hai thao tác đều thành công
    await db.run('BEGIN TRANSACTION')

    // Thêm người dùng vào cơ sở dữ liệu SQLite
    const result = await db.run('INSERT INTO users (username, avatar) VALUES (?, ?)', [
      username,
      avatar
    ])
    await db.run('COMMIT')
    const lastID = result.lastID
    // Lưu mật khẩu vào keytar
    await keytar.setPassword(SERVICE_NAME, username, password)
    // Commit transaction
    if (lastID) {
      return {
        id: lastID,
        username,
        avatar,
        password,
      }
    }
    return false
  } catch (error) {
    await db.run('ROLLBACK')
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      console.error('Error: Username already exists.')
      return false
    }
    console.error('Registration error:', error)
    return false
  }
}// Lấy danh sách tất cả người dùng
export const getAllUsers = async (db: Database) => {
  console.log('Fetching all users...')
  try {
    const users = await db.all('SELECT * FROM users')
    return users
  } catch (error) {
    console.error('Error fetching all users:', error)
    return []
  }
}

// Xác thực người dùng (kiểm tra tên người dùng và mật khẩu)
export const authenticateUser = async (
  db: Database,
  { username, password }: { username: string; password: string }
): Promise<{ success: boolean; user?: IUser }> => {
  console.log('Authenticating user:', username)
  try {
    const storedPassword = await keytar.getPassword(SERVICE_NAME, username)
    if (storedPassword && storedPassword === password) {
      const user = await db.get('SELECT * FROM users WHERE username = ?', username)
      currentUser = user // Lưu vào bộ nhớ
      const settings = await getUserSettings(db)
      user.settings = settings
      return { success: true, user: user }
    } else {
      return { success: false }
    }
  } catch (error) {
    return { success: false }
  }
}

// Cập nhật avatar người dùng
export const updateAvatar = async (
  db: Database,
  { avatar }: { avatar: string }
): Promise<boolean> => {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    await db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, currentUser.id])
    return true
  } catch (error) {
    console.error('Error updating avatar:', error)
    return false
  }
}

// Cập nhật mật khẩu người dùng
export const updatePassword = async (password: string, newPassword: string): Promise<boolean> => {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const auth = await keytar.getPassword(SERVICE_NAME, currentUser.username)
    if (auth && auth === password) {
      await keytar.setPassword(SERVICE_NAME, currentUser.username, newPassword)
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

// Xóa người dùng
export const deleteUser = async (db: Database, username: string): Promise<boolean> => {
  try {
    await db.run('BEGIN TRANSACTION')

    // Xóa người dùng từ cơ sở dữ liệu SQLite
    await db.run('DELETE FROM users WHERE username = ?', username)

    // Xóa mật khẩu từ keytar
    await keytar.deletePassword(SERVICE_NAME, username)

    await db.run('COMMIT')
    return true
  } catch (error) {
    await db.run('ROLLBACK')
    console.error('Error deleting user:', error)
    return false
  }
}

// Hàm để lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
  return currentUser
}
