import { Database } from 'sqlite'
import { currentUser } from './userService';

export const bulkInsertCategories = async (
  db: Database,
  categories: Array<{ name: string; icon: string; user_id: number }>
) => {
  const query = `INSERT INTO password_categories (name, icon, user_id) VALUES (?, ?, ?)`
  const insertPromises = categories.map(async ({ name, icon, user_id }) => {
    return db.run(query, [name, icon, user_id])
  })

  await Promise.all(insertPromises)
}

// Read
export async function getCategories(db: Database) {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const sql = `SELECT * FROM password_categories WHERE user_id = ?`
    const rows = await db.all(sql, [currentUser.id])
    return rows
  } catch (error) {
    throw error
  }
}

export async function createCategory(db: Database, { name, icon}) {
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  const user_id = currentUser.id
  try {
    const sql = `INSERT INTO password_categories (name, icon, user_id) VALUES (?, ?, ?)`
    const { lastID } = await db.run(sql, [name, icon, user_id])
    return {
      id: lastID,
      name,
      icon,
      user_id
    }
  } catch (error) {
    throw error
  }
}
export async function updateCategory(db: Database, { id, name, icon }) {
  try {
    const sql = `UPDATE password_categories SET name = ?, icon = ? WHERE id = ?`
    const result = await db.run(sql, [name, icon, id])
    return result
  } catch (error) {
    throw error
  }
}
export async function deleteCategory(db: Database, { id }) {
  try {
    const sql = `DELETE FROM password_categories WHERE id = ?`
    const result = await db.run(sql, [id])
    return result
  } catch (error) {
    throw error
  }
}
