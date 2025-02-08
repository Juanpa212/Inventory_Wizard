// databaseHelper.js
import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('MainDB.db');
    
    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');
    
    // Create Inventory table first
    const createInventoryTable = `
      CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT
      )
    `;
    await db.execAsync(createInventoryTable);
    
    // Create items table
    const createItemsTable = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inventory_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category TEXT,
        FOREIGN KEY(inventory_id) REFERENCES Inventory(id)
      )
    `;
    await db.execAsync(createItemsTable);
    
    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const createInventory = async (db, inventory) => {
  try {
    const { name, description, location } = inventory;

    if (!name.trim()) {
      throw new Error("Inventory name is required");
    }

    const result = await db.runAsync(
      'INSERT INTO Inventory (name, description, location) VALUES (?, ?, ?)',
      [name, description, location]
    );

    return { id: result.lastInsertRowId, ...inventory };
  } catch (error) {
    console.error("Error in createInventory:", error);
    throw error;
  }
};

export const addItem = async (db, item) => {
  try {
    const { inventory_id, name, quantity, price, category } = item;

    // Ensure the inventory_id is not null or undefined
    if (!inventory_id) {
      throw new Error("Inventory ID is required");
    }

    // Insert the item into the database
    const result = await db.runAsync(
      'INSERT INTO items (inventory_id, name, quantity, price, category) VALUES (?, ?, ?, ?, ?)',
      [inventory_id, name, quantity, price, category]
    );

    // Return the newly created item ID
    return { id: result.lastInsertRowId, ...item };
  } catch (error) {
    console.error("Error in addItem:", error);
    throw error;
  }
};
