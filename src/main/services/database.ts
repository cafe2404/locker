import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import {
  createUsersTable,
  createPasswordCateTable,
  createPasswordDataTable,
  createUserSettingsTable
} from './schema'
import { app } from 'electron'

const initializeDatabase = async () => {
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  console.log('dbPath', dbPath)
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  await db.run(createUsersTable)
  await db.run(createPasswordCateTable)
  await db.run(createPasswordDataTable)
  await db.run(createUserSettingsTable)
  await initializeTrigger(db)
  return db
}

const initializeTrigger = async (db) => {
  // Trigger để tạo user_settings sau khi thêm user
  await db.run(`
    CREATE TRIGGER IF NOT EXISTS create_user_settings_after_insert
    AFTER INSERT ON users
    FOR EACH ROW
    BEGIN
      INSERT INTO user_settings (user_id) VALUES (NEW.id);
    END;
  `)

  // Trigger để xóa user_settings và dữ liệu liên quan sau khi xóa user
  await db.run(`
    CREATE TRIGGER IF NOT EXISTS delete_related_data_after_delete_user
    AFTER DELETE ON users
    FOR EACH ROW
    BEGIN
      DELETE FROM password_categories WHERE user_id = OLD.id;
      DELETE FROM password_data WHERE user_id = OLD.id;
      DELETE FROM user_settings WHERE user_id = OLD.id;
    END;
  `)

  // Trigger để đặt category_id thành NULL trong password_data sau khi xóa password_category
  await db.run(`
    CREATE TRIGGER IF NOT EXISTS set_category_id_null_after_delete_category
    AFTER DELETE ON password_categories
    FOR EACH ROW
    BEGIN
      UPDATE password_data SET category_id = NULL WHERE category_id = OLD.id;
    END;
  `)
}
export default initializeDatabase
