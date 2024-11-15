import { Database } from 'sqlite'
import { currentUser } from './userService'



export async function createUserSettings(
  db: Database,
  { user_id, start_up_mode, tray_icon, auto_lock_time }: IUserSettings
) {
  const sql = `INSERT INTO user_settings (user_id, start_up_mode, tray_icon, auto_lock_time)
VALUES (?, ?, ?, ?)`
  try {
    const { lastID } = await db.run(sql, [user_id, start_up_mode, tray_icon, auto_lock_time])
    return { id: lastID }
  } catch (error) {
    return false
  }
}

export async function getUserSettings(db: Database ) {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const sql = `SELECT * FROM user_settings WHERE user_id = ?`
    const row = await db.get(sql, currentUser.id)
    return row
  } catch (error) {
    throw error
  }
}

export async function updateUserSettings(
  db: Database,
  data: IUserSettings
) {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  const { start_up_mode, tray_icon, auto_lock_time,auto_lock_on_blur,user_id } = data
  const sql = `UPDATE user_settings SET start_up_mode = ?, tray_icon = ?, auto_lock_time = ?, auto_lock_on_blur = ? WHERE user_id = ?`
  try {
    await db.run(sql, [start_up_mode, tray_icon, auto_lock_time,auto_lock_on_blur, user_id])
    return true
  } catch (error) {
    return false
  }
}
