import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDataDir() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        const initialDB = {
            users: [],
            products: [],
            materials: [],
            customers: [],
            orders: [],
            auditLogs: [],
            settings: {
                bannerText: 'Welcome to Ordelix - The Premium Artisan Commerce Network',
                featureApprovals: true,
                demoMode: true
            }
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    }
}

async function getDB() {
    ensureDataDir();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    let db = JSON.parse(data);
    if (!db.customers) db.customers = [];
    if (!db.orders) db.orders = [];
    if (!db.auditLogs) db.auditLogs = [];
    if (!db.settings) db.settings = {
        bannerText: 'Welcome to Ordelix - The Premium Artisan Commerce Network',
        featureApprovals: true,
        demoMode: true
    };
    return db;
}

async function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getUsers() {
    const db = await getDB();
    return db.users;
}

export async function getCustomers() {
    const db = await getDB();
    if (db.customers.length === 0) {
        db.customers = [
            { id: 'c1', name: 'Regular Alice', loyaltyLevel: 'new', purchaseCount: 1, paymentBehavior: 'good' },
            { id: 'c2', name: 'VIP Bob', loyaltyLevel: 'gold', purchaseCount: 15, paymentBehavior: 'excellent' },
            { id: 'c3', name: 'Silver Carol', loyaltyLevel: 'silver', purchaseCount: 5, paymentBehavior: 'average' }
        ];
        await saveDB(db);
    }
    return db.customers;
}

export async function saveUser(user) {
    const db = await getDB();

    // First user to sign up becomes admin, others are regular users
    const isFirstUser = db.users.length === 0;

    const newUser = {
        ...user,
        id: crypto.randomUUID(),
        role: isFirstUser ? 'admin' : 'user',
        status: 'approved', // No need for admin approval, everyone can sign up
        createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await saveDB(db);
    return newUser;
}

export async function updateUserStatus(id, status) {
    const db = await getDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        db.users[userIndex].status = status;
        await saveDB(db);
        return db.users[userIndex];
    }
    return null;
}

// Product Management
export async function getProducts() {
    const db = await getDB();
    return db.products || [];
}

export async function saveProduct(product) {
    const db = await getDB();
    if (!db.products) db.products = [];
    const newProduct = {
        ...product,
        id: crypto.randomUUID(),
        laborHours: Number(product.laborHours || 0),
        complexity: Number(product.complexity || 1),
        createdAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    await saveDB(db);
    return newProduct;
}

// Material Management
export async function getMaterials() {
    const db = await getDB();
    return db.materials || [];
}

export async function saveMaterial(material) {
    const db = await getDB();
    if (!db.materials) db.materials = [];
    const newMaterial = {
        ...material,
        id: crypto.randomUUID(),
        quantity: Number(material.quantity),
        unitPrice: Number(material.unitPrice || 0),
        lowStockThreshold: Number(material.lowStockThreshold || 10)
    };
    db.materials.push(newMaterial);
    await saveDB(db);
    return newMaterial;
}

// Order Management
export async function getOrders() {
    const db = await getDB();
    return db.orders || [];
}

export async function saveOrder(order) {
    const db = await getDB();
    if (!db.orders) db.orders = [];

    const product = db.products.find(p => p.id === order.productId);
    let isPreOrder = false;

    if (product && product.materials) {
        for (const req of product.materials) {
            const material = db.materials.find(m => m.id === req.materialId);
            if (!material || material.quantity < (req.quantityRequired * order.quantity)) {
                isPreOrder = true;
                break;
            }
        }
    }

    const newOrder = {
        ...order,
        id: crypto.randomUUID(),
        status: 'pending',
        isPreOrder,
        createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);

    // Update stock only if NOT pre-order (or always update and let it go negative?)
    // Let's update stock and identify pre-order as "needs fulfillment"
    if (product && product.materials) {
        for (const req of product.materials) {
            const material = db.materials.find(m => m.id === req.materialId);
            if (material) {
                material.quantity -= (req.quantityRequired * order.quantity);
            }
        }
    }

    await saveDB(db);
    return newOrder;
}

export async function updateOrderStatus(id, status) {
    const db = await getDB();
    const orderIndex = db.orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = status;
        await saveDB(db);
        return db.orders[orderIndex];
    }
    return null;
}

// Audit Logs
export async function addAuditLog(action, details, performedBy = 'System') {
    const db = await getDB();
    const log = {
        id: crypto.randomUUID(),
        action,
        details,
        performedBy,
        timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(log); // Newest first
    if (db.auditLogs.length > 100) db.auditLogs.pop(); // Keep last 100
    await saveDB(db);
    return log;
}

export async function getAuditLogs() {
    const db = await getDB();
    return db.auditLogs || [];
}

// Platform Settings
export async function getSettings() {
    const db = await getDB();
    return db.settings;
}

export async function updateSettings(settings) {
    const db = await getDB();
    db.settings = { ...db.settings, ...settings };
    await saveDB(db);
    return db.settings;
}

export async function deleteProduct(id) {
    const db = await getDB();
    db.products = db.products.filter(p => p.id !== id);
    await saveDB(db);
    return true;
}

export async function updateProduct(id, updates) {
    const db = await getDB();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
        db.products[index] = { ...db.products[index], ...updates };
        await saveDB(db);
        return db.products[index];
    }
    return null;
}
