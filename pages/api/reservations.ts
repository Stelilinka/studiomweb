import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DB_PATH = process.env.SQLITE_FILE || path.join(process.cwd(), 'data', 'db.sqlite')

function getDb() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(DB_PATH)
  db.prepare(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`).run()
  return db
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb()
  if (req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM reservations ORDER BY id DESC').all()
    return res.status(200).json(rows)
  }
  if (req.method === 'POST') {
    const { name, email, date } = req.body
    const stmt = db.prepare('INSERT INTO reservations (name, email, date) VALUES (?, ?, ?)')
    const info = stmt.run(name, email, date)
    const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(info.lastInsertRowid)
    return res.status(201).json(row)
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
