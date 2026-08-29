
// /api/inquiries.js - 고객문의 관리 백엔드 (알림톡 없이)
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Read error', e);
    return [];
  }
}

function writeData(data) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Write error', e);
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const data = readData();
    // Sort newest first
    data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ inquiries: data, total: data.length });
  }

  if (req.method === 'PATCH') {
    // Update status or memo
    const { id, status, memo, kakaoMemo, emailMemo } = req.body;
    const data = readData();
    const idx = data.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    
    if (status) data[idx].status = status;
    if (memo !== undefined) data[idx].memo = memo;
    if (kakaoMemo !== undefined) data[idx].kakaoMemo = kakaoMemo;
    if (emailMemo !== undefined) data[idx].emailMemo = emailMemo;
    data[idx].updatedAt = new Date().toISOString();
    
    writeData(data);
    return res.status(200).json({ success: true, inquiry: data[idx] });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    let data = readData();
    data = data.filter(i => i.id !== id);
    writeData(data);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
