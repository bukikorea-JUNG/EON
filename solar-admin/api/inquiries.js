
// /api/inquiries.js - Supabase 연동 버전
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase();
  
  // Supabase 없으면 기존 파일 방식으로 fallback (개발용)
  if (!supabase) {
    return res.status(200).json({ 
      inquiries: [], 
      warning: 'SUPABASE_URL / SUPABASE_ANON_KEY 환경변수 없음 - 파일 모드로 동작',
      supabase: false
    });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(500);
    
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ inquiries: data, total: data.length, supabase: true });
  }

  if (req.method === 'PATCH') {
    const { id, status, memo, kakaoMemo, emailMemo } = req.body;
    const update = {};
    if (status) update.status = status;
    if (memo !== undefined) update.memo = memo;
    if (kakaoMemo !== undefined) update.kakaoMemo = kakaoMemo;
    if (emailMemo !== undefined) update.emailMemo = emailMemo;
    update.updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('inquiries')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, inquiry: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
