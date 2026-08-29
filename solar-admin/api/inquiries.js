
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase();
  if (!supabase) return res.status(200).json({ inquiries: [], error: 'ENV missing' });

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('createdAt', { ascending: false }).limit(500);
      if (error) {
        // fallback: try lowercase
        const { data: data2, error: err2 } = await supabase.from('inquiries').select('*').order('createdat', { ascending: false }).limit(500);
        if (err2) return res.status(500).json({ error: error.message + ' / ' + err2.message });
        return res.status(200).json({ inquiries: data2, total: data2.length });
      }
      return res.status(200).json({ inquiries: data, total: data.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status, memo, kakaoMemo, emailMemo } = req.body;
    const update = { updatedAt: new Date().toISOString() };
    if (status) update.status = status;
    if (memo !== undefined) update.memo = memo;
    if (kakaoMemo !== undefined) update.kakaoMemo = kakaoMemo;
    if (emailMemo !== undefined) update.emailMemo = emailMemo;
    const { data, error } = await supabase.from('inquiries').update(update).eq('id', id).select().single();
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
