import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import pool from './db.js';
import { authMiddleware, JWT_SECRET } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Prevent caching on API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  next();
});

// S3 SigV4 upload helper
function signS3(method, s3Path, contentType, bodyHash) {
  const endpoint = new URL(process.env.S3_ENDPOINT);
  const host = endpoint.host;
  const basePath = endpoint.pathname.replace(/\/$/, '');
  const requestPath = `${basePath}/${process.env.S3_BUCKET}/${s3Path}`;
  // MinIO behind reverse proxy sees path without the proxy prefix
  const canonicalUri = `/${process.env.S3_BUCKET}/${s3Path}`;
  const region = process.env.S3_REGION || 'us-east-1';
  const service = 's3';
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, '').slice(0, 8);
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const credential = `${process.env.S3_ACCESS_KEY}/${dateStamp}/${region}/${service}/aws4_request`;

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${bodyHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `${method}\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${bodyHash}`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/${region}/${service}/aws4_request\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const hmac = (key, msg) => crypto.createHmac('sha256', key).update(msg).digest();
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${process.env.S3_SECRET_KEY}`, dateStamp), region), service), 'aws4_request');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return {
    url: `${endpoint.protocol}//${host}${requestPath}`,
    headers: {
      'Host': host,
      'Content-Type': contentType,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': bodyHash,
      'Authorization': `AWS4-HMAC-SHA256 Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  };
}

async function uploadToS3(key, buffer, contentType) {
  const bodyHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const { url, headers } = signS3('PUT', key, contentType, bodyHash);
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname,
      method: 'PUT',
      headers: { ...headers, 'Content-Length': buffer.length },
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`S3 upload failed (${res.statusCode}): ${body}`));
      });
    });
    req.on('error', reject);
    req.end(buffer);
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('მხოლოდ სურათების ატვირთვაა დაშვებული'));
  },
});

// ══════════════════════════════════════
// FILE UPLOAD
// ══════════════════════════════════════

app.post('/api/admin/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'ფაილი არ არის' });
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const key = `images/uploads/${filename}`;

    await uploadToS3(key, req.file.buffer, req.file.mimetype);

    const url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'შეავსეთ ყველა ველი' });
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'არასწორი მონაცემები' });
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'არასწორი მონაცემები' });
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ admin: req.admin });
});

// ══════════════════════════════════════
// ADMIN MANAGEMENT
// ══════════════════════════════════════

app.get('/api/admin/admins', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT id, username, created_at FROM admins ORDER BY id');
  res.json(result.rows);
});

app.post('/api/admin/admins', authMiddleware, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'შეავსეთ ყველა ველი' });
    if (password.length < 6) return res.status(400).json({ error: 'პაროლი მინიმუმ 6 სიმბოლო' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at', [username, hash]);
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'ეს სახელი უკვე არსებობს' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/admins/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.admin.id) return res.status(400).json({ error: 'საკუთარი ანგარიშის წაშლა არ შეიძლება' });
  await pool.query('DELETE FROM admins WHERE id = $1', [id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// SITE SETTINGS
// ══════════════════════════════════════

app.get('/api/content/settings', async (req, res) => {
  const result = await pool.query('SELECT key, value FROM site_settings');
  const settings = {};
  result.rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
        [key, String(value)]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// HERO SLIDES
// ══════════════════════════════════════

app.get('/api/content/hero-slides', async (req, res) => {
  const result = await pool.query('SELECT * FROM hero_slides ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/hero-slides', authMiddleware, async (req, res) => {
  const { image } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM hero_slides');
  const result = await pool.query('INSERT INTO hero_slides (image, sort_order) VALUES ($1, $2) RETURNING *', [image, maxOrder.rows[0].next]);
  res.json(result.rows[0]);
});

app.put('/api/admin/hero-slides/reorder', authMiddleware, async (req, res) => {
  try {
    const { orders } = req.body;
    for (const { id, sort_order } of orders) {
      await pool.query('UPDATE hero_slides SET sort_order = $1 WHERE id = $2', [sort_order, id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/hero-slides/:id', authMiddleware, async (req, res) => {
  const { image, sort_order } = req.body;
  const result = await pool.query('UPDATE hero_slides SET image = $1, sort_order = COALESCE($2, sort_order) WHERE id = $3 RETURNING *', [image, sort_order, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/hero-slides/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM hero_slides WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// PROCEDURES
// ══════════════════════════════════════

app.get('/api/content/procedures', async (req, res) => {
  const result = await pool.query('SELECT * FROM procedures ORDER BY sort_order');
  res.json(result.rows);
});

app.get('/api/content/procedures/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM procedures WHERE slug = $1', [req.params.slug]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

app.post('/api/admin/procedures', authMiddleware, async (req, res) => {
  try {
    const { slug, category, name, description, image, is_popular, popular_name, popular_description, popular_image, detail_description, benefits, steps, video_url, duration, price_from } = req.body;
    const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM procedures');
    const result = await pool.query(
      `INSERT INTO procedures (slug, category, name, description, image, sort_order, is_popular, popular_name, popular_description, popular_image, detail_description, benefits, steps, video_url, duration, price_from)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [slug, category, name, description, image, maxOrder.rows[0].next, is_popular || false, popular_name || '', popular_description || '', popular_image || '', detail_description || '', JSON.stringify(benefits || []), JSON.stringify(steps || []), video_url || '', duration || '', price_from || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'ეს slug უკვე არსებობს' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/procedures/:id', authMiddleware, async (req, res) => {
  const { slug, category, name, description, image, sort_order, is_popular, popular_name, popular_description, popular_image, detail_description, benefits, steps, video_url, duration, price_from } = req.body;
  const result = await pool.query(
    `UPDATE procedures SET slug=$1, category=$2, name=$3, description=$4, image=$5, sort_order=COALESCE($6, sort_order), is_popular=$7, popular_name=$8, popular_description=$9, popular_image=$10, detail_description=$11, benefits=$12, steps=$13, video_url=$14, duration=$15, price_from=$16 WHERE id=$17 RETURNING *`,
    [slug, category, name, description, image, sort_order, is_popular || false, popular_name || '', popular_description || '', popular_image || '', detail_description || '', JSON.stringify(benefits || []), JSON.stringify(steps || []), video_url || '', duration || '', price_from || '', req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/admin/procedures/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM procedures WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.put('/api/admin/procedures/reorder', authMiddleware, async (req, res) => {
  const { items } = req.body; // [{id, sort_order}]
  for (const item of items) {
    await pool.query('UPDATE procedures SET sort_order = $1 WHERE id = $2', [item.sort_order, item.id]);
  }
  res.json({ success: true });
});

// ══════════════════════════════════════
// TEAM MEMBERS
// ══════════════════════════════════════

app.get('/api/content/team', async (req, res) => {
  const result = await pool.query('SELECT * FROM team_members ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/team', authMiddleware, async (req, res) => {
  const { slug, name, role, specialization, image, instagram, facebook, linkedin, tiktok } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM team_members');
  const result = await pool.query(
    'INSERT INTO team_members (slug, name, role, specialization, image, sort_order, instagram, facebook, linkedin, tiktok) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [slug, name, role, specialization || '', image || '', maxOrder.rows[0].next, instagram || '', facebook || '', linkedin || '', tiktok || '']
  );
  res.json(result.rows[0]);
});

app.put('/api/admin/team/:id', authMiddleware, async (req, res) => {
  const { slug, name, role, specialization, image, sort_order, instagram, facebook, linkedin, tiktok } = req.body;
  const result = await pool.query(
    'UPDATE team_members SET slug=$1, name=$2, role=$3, specialization=$4, image=$5, sort_order=COALESCE($6, sort_order), instagram=$7, facebook=$8, linkedin=$9, tiktok=$10 WHERE id=$11 RETURNING *',
    [slug, name, role, specialization || '', image || '', sort_order, instagram || '', facebook || '', linkedin || '', tiktok || '', req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/admin/team/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM team_members WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// FAQs
// ══════════════════════════════════════

app.get('/api/content/faqs', async (req, res) => {
  const result = await pool.query('SELECT * FROM faqs ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/faqs', authMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM faqs');
  const result = await pool.query('INSERT INTO faqs (question, answer, sort_order) VALUES ($1,$2,$3) RETURNING *', [question, answer, maxOrder.rows[0].next]);
  res.json(result.rows[0]);
});

app.put('/api/admin/faqs/:id', authMiddleware, async (req, res) => {
  const { question, answer, sort_order } = req.body;
  const result = await pool.query('UPDATE faqs SET question=$1, answer=$2, sort_order=COALESCE($3, sort_order) WHERE id=$4 RETURNING *', [question, answer, sort_order, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/faqs/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM faqs WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// RESULTS
// ══════════════════════════════════════

app.get('/api/content/results', async (req, res) => {
  const result = await pool.query('SELECT * FROM results ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/results', authMiddleware, async (req, res) => {
  const { title, description, before_image, after_image } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM results');
  const result = await pool.query('INSERT INTO results (title, description, before_image, after_image, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *', [title, description, before_image, after_image, maxOrder.rows[0].next]);
  res.json(result.rows[0]);
});

app.put('/api/admin/results/:id', authMiddleware, async (req, res) => {
  const { title, description, before_image, after_image, sort_order } = req.body;
  const result = await pool.query('UPDATE results SET title=$1, description=$2, before_image=$3, after_image=$4, sort_order=COALESCE($5, sort_order) WHERE id=$6 RETURNING *', [title, description, before_image, after_image, sort_order, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/results/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM results WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// REELS
// ══════════════════════════════════════

app.get('/api/content/reels', async (req, res) => {
  const result = await pool.query('SELECT * FROM reels ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/reels', authMiddleware, async (req, res) => {
  const { title, description, thumbnail, video_url } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM reels');
  const result = await pool.query('INSERT INTO reels (title, description, thumbnail, video_url, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *', [title, description, thumbnail, video_url, maxOrder.rows[0].next]);
  res.json(result.rows[0]);
});

app.put('/api/admin/reels/:id', authMiddleware, async (req, res) => {
  const { title, description, thumbnail, video_url, sort_order } = req.body;
  const result = await pool.query('UPDATE reels SET title=$1, description=$2, thumbnail=$3, video_url=$4, sort_order=COALESCE($5, sort_order) WHERE id=$6 RETURNING *', [title, description, thumbnail, video_url, sort_order, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/reels/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM reels WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.put('/api/admin/reels/reorder', authMiddleware, async (req, res) => {
  const { items } = req.body; // [{id, sort_order}]
  for (const item of items) {
    await pool.query('UPDATE reels SET sort_order = $1 WHERE id = $2', [item.sort_order, item.id]);
  }
  res.json({ success: true });
});

// ══════════════════════════════════════
// OFFERS
// ══════════════════════════════════════

app.get('/api/content/offers', async (req, res) => {
  const result = await pool.query('SELECT * FROM offers ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/admin/offers', authMiddleware, async (req, res) => {
  const { badge_text, title, subtitle, description, old_price, new_price, image, is_active } = req.body;
  const result = await pool.query(
    'INSERT INTO offers (badge_text, title, subtitle, description, old_price, new_price, image, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [badge_text || '', title || '', subtitle || '', description || '', old_price || '', new_price || '', image || '', is_active !== false]
  );
  res.json(result.rows[0]);
});

app.put('/api/admin/offers/:id', authMiddleware, async (req, res) => {
  const { badge_text, title, subtitle, description, old_price, new_price, image, is_active } = req.body;
  const result = await pool.query(
    'UPDATE offers SET badge_text=$1, title=$2, subtitle=$3, description=$4, old_price=$5, new_price=$6, image=$7, is_active=$8 WHERE id=$9 RETURNING *',
    [badge_text, title, subtitle, description, old_price, new_price, image, is_active, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/admin/offers/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM offers WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// COURSE MENTORS
// ══════════════════════════════════════

app.get('/api/content/mentors', async (req, res) => {
  const result = await pool.query('SELECT * FROM course_mentors ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/mentors', authMiddleware, async (req, res) => {
  const { name, role, image } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM course_mentors');
  const result = await pool.query('INSERT INTO course_mentors (name, role, image, sort_order) VALUES ($1,$2,$3,$4) RETURNING *', [name, role, image, maxOrder.rows[0].next]);
  res.json(result.rows[0]);
});

app.put('/api/admin/mentors/:id', authMiddleware, async (req, res) => {
  const { name, role, image, sort_order } = req.body;
  const result = await pool.query('UPDATE course_mentors SET name=$1, role=$2, image=$3, sort_order=COALESCE($4, sort_order) WHERE id=$5 RETURNING *', [name, role, image, sort_order, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/mentors/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM course_mentors WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// NAV ITEMS
// ══════════════════════════════════════

app.get('/api/content/nav-items', async (req, res) => {
  const result = await pool.query('SELECT * FROM nav_items WHERE is_visible = true ORDER BY sort_order');
  res.json(result.rows);
});

app.get('/api/admin/nav-items', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT * FROM nav_items ORDER BY sort_order');
  res.json(result.rows);
});

app.post('/api/admin/nav-items', authMiddleware, async (req, res) => {
  const { label, path, icon, is_visible, is_special, is_cta, open_in_new_tab } = req.body;
  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM nav_items');
  const result = await pool.query(
    'INSERT INTO nav_items (label, path, icon, is_visible, is_special, is_cta, open_in_new_tab, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [label, path, icon || '', is_visible !== false, is_special || false, is_cta || false, open_in_new_tab || false, maxOrder.rows[0].next]
  );
  res.json(result.rows[0]);
});

app.put('/api/admin/nav-items/reorder', authMiddleware, async (req, res) => {
  try {
    const { orders } = req.body;
    for (const { id, sort_order } of orders) {
      await pool.query('UPDATE nav_items SET sort_order = $1 WHERE id = $2', [sort_order, id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/nav-items/:id', authMiddleware, async (req, res) => {
  const { label, path, icon, is_visible, is_special, is_cta, open_in_new_tab } = req.body;
  const result = await pool.query(
    'UPDATE nav_items SET label=$1, path=$2, icon=$3, is_visible=$4, is_special=$5, is_cta=$6, open_in_new_tab=$7 WHERE id=$8 RETURNING *',
    [label, path, icon || '', is_visible, is_special || false, is_cta || false, open_in_new_tab || false, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/admin/nav-items/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM nav_items WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// BOOKINGS
// ══════════════════════════════════════

app.get('/api/admin/bookings', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/bookings', async (req, res) => {
  const { name, phone, email, procedure_name, doctor, date, time, comment, source } = req.body;
  const result = await pool.query(
    'INSERT INTO bookings (name, phone, email, procedure_name, doctor, date, time, comment, source) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
    [name, phone, email, procedure_name, doctor || '', date || '', time || '', comment || '', source || 'website']
  );
  res.json(result.rows[0]);
});

app.put('/api/admin/bookings/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/admin/bookings/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// CONTACT MESSAGES
// ══════════════════════════════════════

app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;
  const result = await pool.query(
    'INSERT INTO contact_messages (name, phone, email, message) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, phone, email, message]
  );
  res.json(result.rows[0]);
});

app.put('/api/admin/messages/:id/read', authMiddleware, async (req, res) => {
  await pool.query('UPDATE contact_messages SET is_read = true WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.delete('/api/admin/messages/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ══════════════════════════════════════
// COURSE REGISTRATIONS
// ══════════════════════════════════════

app.get('/api/admin/course-registrations', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT * FROM course_registrations ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/course-register', async (req, res) => {
  const { name, email, phone, experience, message } = req.body;
  const result = await pool.query(
    'INSERT INTO course_registrations (name, email, phone, experience, message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, email, phone, experience || '', message || '']
  );
  res.json(result.rows[0]);
});

// ══════════════════════════════════════
// DASHBOARD STATS
// ══════════════════════════════════════

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  const [bookings, messages, registrations, procedures, team] = await Promise.all([
    pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'pending\') as pending FROM bookings'),
    pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_read = false) as unread FROM contact_messages'),
    pool.query('SELECT COUNT(*) as total FROM course_registrations'),
    pool.query('SELECT COUNT(*) as total FROM procedures'),
    pool.query('SELECT COUNT(*) as total FROM team_members'),
  ]);
  res.json({
    bookings: bookings.rows[0],
    messages: messages.rows[0],
    registrations: registrations.rows[0],
    procedures: procedures.rows[0],
    team: team.rows[0],
  });
});

// ══════════════════════════════════════
// CACHE CLEAR
// ══════════════════════════════════════

app.post('/api/admin/clear-cache', authMiddleware, async (req, res) => {
  // Nothing to clear server-side (no in-memory cache), but acknowledge the request
  // The frontend will refetch all content after this call
  res.json({ success: true, message: 'Cache cleared' });
});

// ══════════════════════════════════════
// START SERVER
// ══════════════════════════════════════

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Entourage API server running on http://localhost:${PORT}`);
});
