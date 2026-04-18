import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'merijans.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initDb(db);
  }
  return db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      meta_description TEXT DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT DEFAULT 'globe',
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT '',
      published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS odarota_properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      -- Tesis Bilgileri
      facility_name TEXT NOT NULL,
      facility_type TEXT DEFAULT '',
      province TEXT DEFAULT '',
      district TEXT DEFAULT '',
      address TEXT DEFAULT '',
      latitude TEXT DEFAULT '',
      longitude TEXT DEFAULT '',
      -- İletişim
      owner_name TEXT NOT NULL,
      owner_phone TEXT NOT NULL,
      owner_email TEXT NOT NULL,
      owner_alt_phone TEXT DEFAULT '',
      website TEXT DEFAULT '',
      social_instagram TEXT DEFAULT '',
      social_facebook TEXT DEFAULT '',
      -- Tesis Özellikleri
      star_rating TEXT DEFAULT '',
      room_count TEXT DEFAULT '',
      bed_count TEXT DEFAULT '',
      pool TEXT DEFAULT '0',
      beach TEXT DEFAULT '0',
      spa TEXT DEFAULT '0',
      restaurant TEXT DEFAULT '0',
      parking TEXT DEFAULT '0',
      wifi TEXT DEFAULT '0',
      ac TEXT DEFAULT '0',
      gym TEXT DEFAULT '0',
      meeting_room TEXT DEFAULT '0',
      pet_friendly TEXT DEFAULT '0',
      -- Fiyat & Kapasite
      price_range TEXT DEFAULT '',
      capacity TEXT DEFAULT '',
      check_in_time TEXT DEFAULT '14:00',
      check_out_time TEXT DEFAULT '12:00',
      -- Açıklamalar
      short_description TEXT DEFAULT '',
      full_description TEXT DEFAULT '',
      amenities TEXT DEFAULT '',
      nearby_attractions TEXT DEFAULT '',
      cancellation_policy TEXT DEFAULT '',
      special_notes TEXT DEFAULT '',
      -- Sistem
      status TEXT DEFAULT 'pending',
      admin_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS odarota_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_cover INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES odarota_properties(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS odarota_amenities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT 'check',
      amenity_group TEXT DEFAULT 'genel',
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS odarota_property_amenities (
      property_id INTEGER NOT NULL,
      amenity_id INTEGER NOT NULL,
      PRIMARY KEY (property_id, amenity_id),
      FOREIGN KEY (property_id) REFERENCES odarota_properties(id) ON DELETE CASCADE,
      FOREIGN KEY (amenity_id) REFERENCES odarota_amenities(id) ON DELETE CASCADE
    );
  `);

  // Default admin
  const admin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
  if (!admin) {
    const hash = bcrypt.hashSync('merijans2026', 10);
    db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash);
  }

  // Default pages
  const pages = [
    { slug: 'hakkinda', title: 'Hakkımızda', content: '<p>Merijans Turizm Danışmanlık, 2023 yılında Ankara\'da kurulmuş, seyahat ve turizm alanında profesyonel danışmanlık hizmetleri sunan bir firmadır.</p><p>Misyonumuz, müşterilerimize en iyi seyahat deneyimini sunmak için kişiselleştirilmiş çözümler üretmektir.</p>' },
    { slug: 'hizmetlerimiz', title: 'Hizmetlerimiz', content: '<p>Turizm alanında sunduğumuz hizmetler.</p>' },
    { slug: 'iletisim', title: 'İletişim', content: '<p>Bizimle iletişime geçin.</p>' },
  ];
  const insertPage = db.prepare('INSERT OR IGNORE INTO pages (slug, title, content) VALUES (?, ?, ?)');
  for (const p of pages) {
    insertPage.run(p.slug, p.title, p.content);
  }

  // Default services
  const svcCount = db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number };
  if (svcCount.c === 0) {
    const insertSvc = db.prepare('INSERT INTO services (title, description, icon, sort_order) VALUES (?, ?, ?, ?)');
    const defaultServices = [
      ['Seyahat Danışmanlığı', 'Kişiselleştirilmiş seyahat planları ve rota önerileri ile hayalinizdeki tatili oluşturuyoruz.', 'compass', 1],
      ['Otel Rezervasyonu', 'En iyi fiyat garantisi ile dünya genelinde binlerce otelde rezervasyon imkanı.', 'building', 2],
      ['Kurumsal Seyahat', 'Şirketinizin tüm seyahat ihtiyaçlarını profesyonel ekibimizle yönetiyoruz.', 'briefcase', 3],
      ['Grup Turları', 'Özel grup turları ve organizasyonları ile unutulmaz deneyimler sunuyoruz.', 'users', 4],
      ['Vize Danışmanlığı', 'Vize başvuru süreçlerinde rehberlik ve danışmanlık hizmetleri.', 'file-text', 5],
      ['Etkinlik Organizasyonu', 'Kurumsal ve bireysel etkinlikler için kapsamlı organizasyon hizmetleri.', 'calendar', 6],
    ];
    for (const s of defaultServices) {
      insertSvc.run(...s);
    }
  }

  // Default site settings
  const settings = [
    ['site_name', 'Merijans Turizm Danışmanlık'],
    ['site_tagline', 'Hayalinizdeki Seyahati Planlıyoruz'],
    ['phone', '+90 312 000 00 00'],
    ['email', 'info@merijans.com'],
    ['address', 'Ankara, Türkiye'],
    ['instagram', 'https://instagram.com/merijans'],
    ['facebook', 'https://facebook.com/merijans'],
    ['twitter', 'https://twitter.com/merijans'],
    ['linkedin', 'https://linkedin.com/company/merijans'],
  ];
  const insertSetting = db.prepare('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)');
  for (const [k, v] of settings) {
    insertSetting.run(k, v);
  }

  // Default amenities
  const amenCount = db.prepare('SELECT COUNT(*) as c FROM odarota_amenities').get() as { c: number };
  if (amenCount.c === 0) {
    const insertAmen = db.prepare('INSERT INTO odarota_amenities (name, icon, amenity_group, sort_order) VALUES (?, ?, ?, ?)');
    const defaults: [string, string, string, number][] = [
      // Indoor
      ['Wi-Fi', 'wifi', 'indoor', 1],
      ['Klima', 'snowflake', 'indoor', 2],
      ['Şömine', 'flame', 'indoor', 3],
      ['TV', 'tv', 'indoor', 4],
      ['Mini Bar', 'wine', 'indoor', 5],
      ['Kasa', 'lock', 'indoor', 6],
      ['Saç Kurutma Makinesi', 'wind', 'indoor', 7],
      // Outdoor
      ['Havuz', 'droplet', 'outdoor', 1],
      ['Plaj', 'sun', 'outdoor', 2],
      ['Bahçe', 'tree', 'outdoor', 3],
      ['Teras', 'home', 'outdoor', 4],
      ['Balkon', 'maximize', 'outdoor', 5],
      ['Barbekü', 'flame', 'outdoor', 6],
      ['Otopark', 'car', 'outdoor', 7],
      // Services
      ['Restoran', 'utensils', 'services', 1],
      ['Spa & Wellness', 'heart', 'services', 2],
      ['Spor Salonu', 'dumbbell', 'services', 3],
      ['Toplantı Salonu', 'users', 'services', 4],
      ['Oda Servisi', 'bell', 'services', 5],
      ['Çamaşırhane', 'shirt', 'services', 6],
      ['Havaalanı Transferi', 'plane', 'services', 7],
      // Accessibility
      ['Evcil Hayvan Kabul', 'paw-print', 'accessibility', 1],
      ['Çocuk Dostu', 'baby', 'accessibility', 2],
      ['Engelli Erişimi', 'accessibility', 'accessibility', 3],
      ['Kahvaltı Dahil', 'coffee', 'accessibility', 4],
      ['Sigara İçilebilir', 'cigarette', 'accessibility', 5],
      ['Jeneratör', 'zap', 'accessibility', 6],
    ];
    for (const a of defaults) {
      insertAmen.run(...a);
    }
  }
}
