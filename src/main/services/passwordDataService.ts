import { Database } from 'sqlite'
import { readCsvFile, writeCsvFile } from './FileService'
import {currentUser} from './userService'
// Create
export async function createPasswordData(
  db: Database,
  { name, icon, url, username, password, user_id, category_id }: IPasswordData
) {
  const sql = `INSERT INTO password_data (name, icon, url, username, password, user_id, category_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)`
  
  const finalIcon = icon || 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-5/177800/218-512.png'
  try {
    const { lastID } = await db.run(sql, [
      name,
      finalIcon,
      url,
      username,
      password,
      user_id,
      category_id
    ])
    return { id: lastID, name, icon, url, username, password, user_id, category_id }
  } catch (error) {
    return false
  }
}
// Read
export async function getPasswordData(db: Database) {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const sql = `SELECT * FROM password_data WHERE user_id = ? ORDER BY created_at DESC;`
    const rows = await db.all(sql, currentUser.id)
    return rows
  } catch (error) {
    throw error
  }
}
export async function getPasswordDataById(db: Database, { id }: IPasswordData) {
  try {
    const sql = `SELECT * FROM password_data WHERE user_id = ?`
    const row = await db.get(sql, id)
    return row
  } catch (error) {
    throw error
  }
}

// Update
export async function updatePasswordData(
  db: Database,
  { id, name, url, icon, username, password, category_id }: IPasswordData
) {
  try {
    const sql = `UPDATE password_data SET name = ?, url = ?, icon = ?, username = ?, password = ?, category_id = ?  WHERE id = ?`
    await db.run(sql, [name, url, icon, username, password, category_id, id])
  } catch (error) {
    throw error
  }
}

// Delete
export async function deletePasswordData(db: Database, id: number) {
  try {
    const sql = `DELETE FROM password_data WHERE id = ?`
    await db.run(sql, id)
    return true
  } catch (error) {
    return false
  }
}

export const getCategories = async (db: Database) => {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const sql = `SELECT * FROM categories WHERE user_id = ?`
    const rows = await db.all(sql, currentUser.id)
    return rows
  } catch (error) {
    throw error
  }
}

export const exportPasswordData = async (db: Database, { filePath }) => {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  const { id } = currentUser
  try {
    const sql = `SELECT * FROM password_data WHERE user_id = ?`
    const rows = await db.all(sql, id)
    await writeCsvFile(filePath, rows)
    return true
  } catch (error) {
    throw error
  }
}
export const importPasswordData = async (
  db: Database,
  { filePath }: { filePath: string }
) => {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const result: IPasswordData[] = []
    const rows = await readCsvFile(filePath)
    for (const row of rows) {
      const { name, icon, url, username, password, category_id } = row

      const createResult = await createPasswordData(db, {
        name,
        icon,
        url,
        username,
        password,
        user_id: currentUser.id,
        category_id
      })
      if (createResult) {
        result.push(createResult)
      }
    }
    return result
  } catch (error) {
    throw error
  }
}
