import * as SQLite from 'expo-sqlite';

const dbName = 'catatabung_pro.db';

export const initDB = async () => {
    try {
        const db = await SQLite.openDatabaseAsync(dbName);
        
        // Create Transactions Table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                type TEXT NOT NULL,
                date TEXT NOT NULL,
                category TEXT DEFAULT 'Lainnya'
            );
        `);

        // Create Saving Goals Table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                targetAmount REAL NOT NULL,
                currentAmount REAL DEFAULT 0,
                deadline TEXT,
                reminderTime TEXT
            );
        `);

        // Create User Meta/Settings Table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);

        return db;
    } catch (error) {
        console.error("Database initialization failed", error);
    }
};

export const getDB = () => SQLite.openDatabaseSync(dbName);

// Transaction CRUD
export const db_addTransaction = async (tx) => {
    const db = await getDB();
    const result = await db.runAsync(
        'INSERT INTO transactions (title, amount, type, date, category) VALUES (?, ?, ?, ?, ?)',
        [tx.title, tx.amount, tx.type, tx.date, tx.category || 'General']
    );
    return result.lastInsertRowId;
};

export const db_getTransactions = async () => {
    const db = await getDB();
    return await db.getAllAsync('SELECT * FROM transactions ORDER BY id DESC');
};

export const db_deleteTransaction = async (id) => {
    const db = await getDB();
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
};

// Goals CRUD
export const db_addGoal = async (goal) => {
    const db = await getDB();
    const result = await db.runAsync(
        'INSERT INTO goals (title, targetAmount, currentAmount, deadline, reminderTime) VALUES (?, ?, ?, ?, ?)',
        [goal.title, goal.targetAmount, 0, goal.deadline, goal.reminderTime]
    );
    return result.lastInsertRowId;
};

export const db_getGoals = async () => {
    const db = await getDB();
    return await db.getAllAsync('SELECT * FROM goals');
};

export const db_updateGoalProgress = async (id, amount) => {
    const db = await getDB();
    await db.runAsync('UPDATE goals SET currentAmount = currentAmount + ? WHERE id = ?', [amount, id]);
};

export const db_deleteGoal = async (id) => {
    const db = await getDB();
    await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
};

// Settings CRUD
export const db_setSetting = async (key, value) => {
    const db = await getDB();
    await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        [key, value]
    );
};

export const db_getSetting = async (key) => {
    const db = await getDB();
    const row = await db.getFirstAsync('SELECT value FROM settings WHERE key = ?', [key]);
    return row ? row.value : null;
};
