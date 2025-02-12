// databaseHelper.js
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('MainDB.db');

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Check if the priority column exists
    const columnInfo = await db.getAllAsync(
      "PRAGMA table_info(items);"
    );

    const hasPriorityColumn = columnInfo.some(
      (column) => column.name === 'priority'
    );

    // Add the priority column if it doesn't exist
    if (!hasPriorityColumn) {
      await db.execAsync(`
        ALTER TABLE items
        ADD COLUMN priority TEXT CHECK(priority IN ('low', 'medium', 'high'));
      `);
    }

    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

// Initialize the database
// export const initDatabase = async () => {
//   try {
//     const db = await SQLite.openDatabaseAsync('MainDB.db');

//     // Enable foreign keys
//     await db.execAsync('PRAGMA foreign_keys = ON;');

//     // Create Inventory table
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS Inventory (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         description TEXT,
//         location TEXT
//       )
//     `);

//     // Create items table with priority
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS items (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         inventory_id INTEGER NOT NULL,
//         name TEXT NOT NULL,
//         quantity INTEGER NOT NULL,
//         price DECIMAL(10,2) NOT NULL,
//         category TEXT,
//         priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
//         FOREIGN KEY(inventory_id) REFERENCES Inventory(id)
//       )
//     `);

//     // Create invoices table
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS invoices (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         invoice_number TEXT NOT NULL UNIQUE,
//         date TEXT NOT NULL,
//         type TEXT NOT NULL CHECK(type IN ('purchase', 'sale')),
//         total_amount DECIMAL(10,2) NOT NULL,
//         tax_amount DECIMAL(10,2) NOT NULL,
//         total_with_tax DECIMAL(10,2) NOT NULL,
//         notes TEXT
//       )
//     `);

//     // Create invoice_items table
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS invoice_items (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         invoice_id INTEGER NOT NULL,
//         item_id INTEGER NOT NULL,
//         quantity INTEGER NOT NULL,
//         price_per_unit DECIMAL(10,2) NOT NULL,
//         subtotal DECIMAL(10,2) NOT NULL,
//         FOREIGN KEY(invoice_id) REFERENCES invoices(id),
//         FOREIGN KEY(item_id) REFERENCES items(id)
//       )
//     `);

//     return db;
//   } catch (error) {
//     console.error("Database initialization error:", error);
//     throw error;
//   }
// };

// Add an item to the database
export const addItem = async (db, item) => {
  try {
    const { inventory_id, name, quantity, price, category, priority } = item;

    // Ensure the inventory_id is not null or undefined
    if (!inventory_id) {
      throw new Error("Inventory ID is required");
    }

    // Insert the item into the database
    const result = await db.runAsync(
      'INSERT INTO items (inventory_id, name, quantity, price, category, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [inventory_id, name, quantity, price, category, priority]
    );

    // Check stock levels after adding the item
    await checkStockLevels(db);

    // Return the newly created item ID
    return { id: result.lastInsertRowId, ...item };
  } catch (error) {
    console.error("Error in addItem:", error);
    throw error;
  }
};

// Fetch all items from the database
export const getItems = async (db) => {
  try {
    return await db.getAllAsync('SELECT * FROM items');
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Check stock levels and send notifications
export const checkStockLevels = async (db) => {
  try {
    const items = await db.getAllAsync('SELECT * FROM items');

    for (const item of items) {
      let threshold = 0;
      switch (item.priority) {
        case 'high':
          threshold = 20;
          break;
        case 'medium':
          threshold = 12;
          break;
        case 'low':
          threshold = 7;
          break;
        default:
          threshold = 0;
      }

      if (item.quantity < threshold) {
        await sendNotification(
          `Low Stock Alert: ${item.name}`,
          `The stock level for ${item.name} is below ${threshold}. Current stock: ${item.quantity}`
        );
      }
    }
  } catch (error) {
    console.error("Error checking stock levels:", error);
    throw error;
  }
};

// Send a notification
const sendNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // Send immediately
  });
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

 export const deleteInventory = async (db, inventoryId) => {
  try {
    // Delete all items in the inventory first
    await db.runAsync('DELETE FROM items WHERE inventory_id = ?', [inventoryId]);
    // Delete the inventory
    await db.runAsync('DELETE FROM Inventory WHERE id = ?', [inventoryId]);
  } catch (error) {
    console.error("Error deleting inventory:", error);
    throw error;
  }
};

// export const addItem = async (db, item) => {
//   try {
//     const { inventory_id, name, quantity, price, category } = item;

//     // Ensure the inventory_id is not null or undefined
//     if (!inventory_id) {
//       throw new Error("Inventory ID is required");
//     }

//     // Insert the item into the database
//     const result = await db.runAsync(
//       'INSERT INTO items (inventory_id, name, quantity, price, category) VALUES (?, ?, ?, ?, ?)',
//       [inventory_id, name, quantity, price, category]
//     );

//     // Return the newly created item ID
//     return { id: result.lastInsertRowId, ...item };
//   } catch (error) {
//     console.error("Error in addItem:", error);
//     throw error;
//   }
// };

export const deleteItem = async (db, itemId) => {
  try {
    await db.runAsync('DELETE FROM items WHERE id = ?', [itemId]);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const updateItem = async (db, item) => {
  try {
    await db.runAsync(
      'UPDATE items SET name = ?, quantity = ?, price = ?, category = ?, priority = ? WHERE id = ?',
      [item.name, item.quantity, item.price, item.category, item.priority, item.id]
    );
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const updateInventory = async (db, inventory) => {
  try {
    await db.runAsync(
      'UPDATE Inventory SET name = ?, description = ?, location = ? WHERE id = ?',
      [inventory.name, inventory.description, inventory.location, inventory.id]
    );
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }

};

export const generateInvoiceNumber = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT COUNT(*) as count FROM invoices');
    const count = result[0].count + 1;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `INV-${year}${month}-${String(count).padStart(4, '0')}`;
  } catch (error) {
    console.error("Error generating invoice number:", error);
    throw error;
  }
};

export const createInvoice = async (db, invoiceData) => {
  try {
    const {
      invoice_number,
      type,
      items,
      total_amount,
      tax_amount,
      total_with_tax,
      notes
    } = invoiceData;

    // Insert the invoice
    const invoiceResult = await db.runAsync(
      `INSERT INTO invoices (
        invoice_number, date, type, total_amount, 
        tax_amount, total_with_tax, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        new Date().toISOString(),
        type,
        total_amount,
        tax_amount,
        total_with_tax,
        notes
      ]
    );

    const invoiceId = invoiceResult.lastInsertRowId;

    // Insert all invoice items
    for (const item of items) {
      await db.runAsync(
        `INSERT INTO invoice_items (
          invoice_id, item_id, quantity, 
          price_per_unit, subtotal
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          invoiceId,
          item.id,
          item.quantity,
          item.price,
          item.quantity * item.price
        ]
      );

      // Update inventory quantities
      const quantityChange = type === 'purchase' ? item.quantity : -item.quantity;
      await db.runAsync(
        'UPDATE items SET quantity = quantity + ? WHERE id = ?',
        [quantityChange, item.id]
      );
    }

    return true;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getInvoices = async (db) => {
  try {
    return await db.getAllAsync(`
      SELECT 
        i.*,
        GROUP_CONCAT(items.name) as item_names,
        COUNT(ii.id) as item_count
      FROM invoices i
      LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
      LEFT JOIN items ON ii.item_id = items.id
      GROUP BY i.id
      ORDER BY i.date DESC
    `);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceDetails = async (db, invoiceId) => {
  try {
    const invoice = await db.getAllAsync(
      'SELECT * FROM invoices WHERE id = ?',
      [invoiceId]
    );

    const items = await db.getAllAsync(`
      SELECT 
        ii.*,
        i.name as item_name,
        i.category
      FROM invoice_items ii
      JOIN items i ON ii.item_id = i.id
      WHERE ii.invoice_id = ?
    `, [invoiceId]);

    return {
      ...invoice[0],
      items
    };
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    throw error;
  }
};