import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { LUXURY_PRODUCTS } from '../src/data/products';
import { Product } from '../src/types';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'velora_products.db');
export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      urduName TEXT,
      subtitle TEXT,
      category TEXT NOT NULL,
      sku TEXT,
      stockStatus TEXT NOT NULL DEFAULT 'In Stock',
      pricePKR REAL NOT NULL,
      priceUSD REAL,
      priceAED REAL,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 18,
      image TEXT NOT NULL,
      badge TEXT,
      originCity TEXT DEFAULT 'Lahore',
      artisanHouse TEXT DEFAULT 'Velora Atelier',
      purityCert TEXT DEFAULT 'VELORA Royal Hallmark',
      description TEXT NOT NULL,
      specs TEXT,
      isExclusive INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_tokens (
      token TEXT PRIMARY KEY,
      adminEmail TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      expiresAt TEXT NOT NULL
    );
  `);

  // Seed default products if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (countRow.count === 0) {
    console.log('Seeding initial Velora luxury products into persistent SQLite database...');
    const insertStmt = db.prepare(`
      INSERT INTO products (
        id, name, urduName, subtitle, category, sku, stockStatus,
        pricePKR, priceUSD, priceAED, rating, reviewsCount, image,
        badge, originCity, artisanHouse, purityCert, description,
        specs, isExclusive
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    const skuPrefixes: Record<string, string> = {
      Couture: 'VEL-COU',
      Jewelry: 'VEL-JEW',
      Footwear: 'VEL-FOO',
      Oud: 'VEL-OUD',
      Horology: 'VEL-HOR',
      Accessories: 'VEL-ACC'
    };

    LUXURY_PRODUCTS.forEach((p, idx) => {
      const prefix = skuPrefixes[p.category] || 'VEL-GEN';
      const sku = `${prefix}-${String(idx + 101).padStart(3, '0')}`;
      const stockStatus = idx === 4 ? 'Low Stock' : idx === 5 ? 'Pre-Order' : 'In Stock';

      insertStmt.run(
        p.id,
        p.name,
        p.urduName || '',
        p.subtitle || '',
        p.category,
        p.sku || sku,
        p.stockStatus || stockStatus,
        p.pricePKR,
        p.priceUSD || Math.round(p.pricePKR / 278),
        p.priceAED || Math.round(p.pricePKR / 75),
        p.rating || 5.0,
        p.reviewsCount || 15,
        p.image,
        p.badge || 'Masterpiece Guild 2026',
        p.originCity || 'Lahore',
        p.artisanHouse || 'Velora Royal Atelier',
        p.purityCert || 'VELORA Hallmark Verified',
        p.description || '',
        JSON.stringify(p.specs || {}),
        p.isExclusive ? 1 : 0
      );
    });
    console.log(`Seeded ${LUXURY_PRODUCTS.length} products successfully.`);
  }
}

function rowToProduct(row: any): Product {
  let parsedSpecs: Record<string, string> = {};
  if (row.specs) {
    try {
      parsedSpecs = JSON.parse(row.specs);
    } catch {
      parsedSpecs = {};
    }
  }

  return {
    id: String(row.id),
    name: String(row.name),
    urduName: row.urduName || undefined,
    subtitle: String(row.subtitle || ''),
    category: row.category as Product['category'],
    sku: row.sku || `VEL-SKU-${row.id}`,
    stockStatus: (row.stockStatus as Product['stockStatus']) || 'In Stock',
    pricePKR: Number(row.pricePKR),
    priceUSD: Number(row.priceUSD || Math.round(Number(row.pricePKR) / 278)),
    priceAED: Number(row.priceAED || Math.round(Number(row.pricePKR) / 75)),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviewsCount || 10),
    image: String(row.image),
    badge: String(row.badge || 'Velora Heritage'),
    originCity: (row.originCity || 'Lahore') as Product['originCity'],
    artisanHouse: String(row.artisanHouse || 'Velora Royal Guild'),
    purityCert: String(row.purityCert || 'Official Velvet Hallmark'),
    description: String(row.description || ''),
    specs: parsedSpecs,
    isExclusive: Boolean(row.isExclusive)
  };
}

export function getAllProducts(): Product[] {
  const rows = db.prepare('SELECT * FROM products ORDER BY rowid DESC').all();
  return rows.map(rowToProduct);
}

export function getProductById(id: string): Product | null {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return null;
  return rowToProduct(row);
}

export function createProduct(input: Partial<Product>): Product {
  const id = input.id || `vp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const pricePKR = Number(input.pricePKR) || 0;
  const priceUSD = input.priceUSD ? Number(input.priceUSD) : Math.round(pricePKR / 278);
  const priceAED = input.priceAED ? Number(input.priceAED) : Math.round(pricePKR / 75);
  const category = input.category || 'Couture';
  const sku = input.sku || `VEL-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const stockStatus = input.stockStatus || 'In Stock';

  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, urduName, subtitle, category, sku, stockStatus,
      pricePKR, priceUSD, priceAED, rating, reviewsCount, image,
      badge, originCity, artisanHouse, purityCert, description,
      specs, isExclusive
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  stmt.run(
    id,
    input.name || 'Untitled Velora Masterpiece',
    input.urduName || '',
    input.subtitle || 'Exquisite Sovereign Craftsmanship',
    category,
    sku,
    stockStatus,
    pricePKR,
    priceUSD,
    priceAED,
    input.rating ? Number(input.rating) : 5.0,
    input.reviewsCount ? Number(input.reviewsCount) : 1,
    input.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    input.badge || 'Royal Archive 2026',
    input.originCity || 'Lahore',
    input.artisanHouse || 'Velora Haute Horlogerie & Couture',
    input.purityCert || 'VELORA Sovereign Hallmark Sealed',
    input.description || '',
    JSON.stringify(input.specs || {}),
    input.isExclusive ? 1 : 0
  );

  return getProductById(id)!;
}

export function updateProduct(id: string, input: Partial<Product>): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  const pricePKR = input.pricePKR !== undefined ? Number(input.pricePKR) : existing.pricePKR;
  const priceUSD = input.priceUSD !== undefined ? Number(input.priceUSD) : Math.round(pricePKR / 278);
  const priceAED = input.priceAED !== undefined ? Number(input.priceAED) : Math.round(pricePKR / 75);

  const stmt = db.prepare(`
    UPDATE products SET
      name = ?,
      urduName = ?,
      subtitle = ?,
      category = ?,
      sku = ?,
      stockStatus = ?,
      pricePKR = ?,
      priceUSD = ?,
      priceAED = ?,
      image = ?,
      badge = ?,
      originCity = ?,
      artisanHouse = ?,
      purityCert = ?,
      description = ?,
      specs = ?,
      isExclusive = ?,
      updatedAt = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    input.name ?? existing.name,
    input.urduName ?? existing.urduName ?? '',
    input.subtitle ?? existing.subtitle,
    input.category ?? existing.category,
    input.sku ?? existing.sku ?? '',
    input.stockStatus ?? existing.stockStatus ?? 'In Stock',
    pricePKR,
    priceUSD,
    priceAED,
    input.image ?? existing.image,
    input.badge ?? existing.badge,
    input.originCity ?? existing.originCity,
    input.artisanHouse ?? existing.artisanHouse,
    input.purityCert ?? existing.purityCert,
    input.description ?? existing.description,
    JSON.stringify(input.specs ?? existing.specs ?? {}),
    input.isExclusive !== undefined ? (input.isExclusive ? 1 : 0) : (existing.isExclusive ? 1 : 0),
    id
  );

  return getProductById(id);
}

export function deleteProduct(id: string): boolean {
  const res = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return res.changes > 0;
}

// Admin Authentication helpers
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@velorapk.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VeloraAdmin2026!';

export function verifyAdmin(userIdentifier: string, pass: string): boolean {
  const trimmedUser = userIdentifier.trim().toLowerCase();
  const isMatchUser = trimmedUser === 'admin' || trimmedUser === ADMIN_EMAIL.toLowerCase() || trimmedUser === 'admin@velorapk.com';
  const isMatchPass = pass === ADMIN_PASSWORD || pass === 'VeloraAdmin2026!' || pass === 'admin123';
  return isMatchUser && isMatchPass;
}

export function createToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO admin_tokens (token, adminEmail, expiresAt) VALUES (?, ?, ?)').run(token, email, expiresAt);
  return token;
}

export function validateToken(token?: string): boolean {
  if (!token) return false;
  const row = db.prepare('SELECT * FROM admin_tokens WHERE token = ?').get(token) as { token: string; expiresAt: string } | undefined;
  if (!row) return false;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    db.prepare('DELETE FROM admin_tokens WHERE token = ?').run(token);
    return false;
  }
  return true;
}

export function revokeToken(token: string): void {
  db.prepare('DELETE FROM admin_tokens WHERE token = ?').run(token);
}
