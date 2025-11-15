import { GroceryItem } from "@/types/GroceryItem";
import { SQLiteDatabase } from "expo-sqlite";

export const initTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS grocery_items(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              quantity INTEGER DEFAULT 1,
              category TEXT,
              bought INTEGER DEFAULT 0,
              created_at INTEGER
              )
        `);
};

export const insertGrocery = async (db: SQLiteDatabase, data: GroceryItem) => {
  await db.runAsync(
    `INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.quantity, data.category, data.bought, Date.now()]
  );
};

export const getAllGrocery = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<GroceryItem>(`SELECT * FROM grocery_items`);
};

export const getGroceryId = async (db: SQLiteDatabase, id: number) => {
  return await db.getFirstAsync<GroceryItem>(
    `SELECT * FROM grocery_items WHERE id = ?`,
    [id]
  );
};

export const updateGrocery = async (db: SQLiteDatabase, data: GroceryItem) => {
  await db.runAsync(
    `UPDATE grocery_items SET name = ?, quantity = ?, category = ? WHERE id = ?`,
    [data.name, data.quantity, data.category, data.id]
  );
};

export const markBought = async (
  db: SQLiteDatabase,
  id: number,
  current: number
) => {
  const newValue = current === 1 ? 0 : 1;

  await db.runAsync(`UPDATE grocery_items SET bought = ? WHERE id = ?`, [
    newValue,
    id,
  ]);
};

export const deleteGrocery = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
};
