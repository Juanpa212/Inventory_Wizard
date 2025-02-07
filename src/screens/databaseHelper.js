// databaseHelper.js
import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('MainDB.db');
    
    // Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inventory_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category TEXT,
        FOREIGN KEY(inventory_id) REFERENCES Inventory(id)
      );
    `);
    
    await db.execAsync('PRAGMA foreign_keys = ON;');
    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const createInventory = async (db, inventory) => {
  try {
    console.log('Creating inventory with data:', inventory);
    
    if (!inventory.name || inventory.name.trim() === '') {
      throw new Error('Inventory name is required');
    }

    const name = inventory.name.trim();
    const description = inventory.description?.trim() || null;
    const location = inventory.location?.trim() || null;

    // Use direct values in the query since parameterization seems to be failing
    const insertQuery = `
      INSERT INTO Inventory (name, description, location)
      VALUES ("${name}", "${description || ''}", "${location || ''}")
    `;
    
    console.log('Executing query:', insertQuery);
    
    await db.execAsync(insertQuery);
    
    // Get the ID of the newly created inventory
    const result = await db.getAllAsync('SELECT * FROM Inventory ORDER BY id DESC LIMIT 1');
    console.log('Created inventory:', result[0]);
    
    if (!result || result.length === 0) {
      throw new Error('Failed to create inventory - no result returned');
    }
    
    return result[0];
  } catch (error) {
    console.error("Error in createInventory:", error);
    throw error;
  }
};

export const verifyDatabaseState = async (db) => {
  try {
    console.log('=== Database State Verification ===');
    
    // Check Inventory table
    const inventories = await db.getAllAsync('SELECT * FROM Inventory');
    console.log('All inventories:', inventories);
    
    // Check Items table
    const items = await db.getAllAsync('SELECT * FROM items');
    console.log('All items:', items);
    
    return {
      inventories,
      items
    };
  } catch (error) {
    console.error("Error verifying database state:", error);
    throw error;
  }
};

export const getItems = async (db, inventoryId) => {
  try {
    const items = await db.getAllAsync(
      'SELECT * FROM items WHERE inventory_id = ?',
      [inventoryId]
    );
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const addItem = async (db, item) => {
    try {
      console.log('Adding item with data:', item);
      
      // Validate required fields
      if (!item.inventory_id || !item.name || !item.quantity || !item.price) {
        console.error('Missing required fields:', item);
        throw new Error('Missing required fields');
      }
  
      // Use direct SQL insertion since parameterization seems problematic
      const insertQuery = `
        INSERT INTO items (inventory_id, name, quantity, price, category)
        VALUES (
          ${parseInt(item.inventory_id)},
          "${item.name.trim()}",
          ${parseInt(item.quantity)},
          ${parseFloat(item.price)},
          "${item.category ? item.category.trim() : ''}"
        )
      `;
      
      console.log('Executing query:', insertQuery);
      
      await db.execAsync(insertQuery);
      
      // Verify the insert
      const result = await db.getAllAsync(
        'SELECT * FROM items WHERE id = last_insert_rowid()'
      );
      console.log('Insert verification result:', result);
      
      if (!result || result.length === 0) {
        throw new Error('Failed to add item - no result returned');
      }
      
      return result[0];
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  };