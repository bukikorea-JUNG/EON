
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

// snake -> camel 변환 (관리자 UI 호환)
function mapRow(r) {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    address: r.address,
    pyeong: r.pyeong,
    roofType: r.roof_type,
    message: r.message,
    pageUrl: r.page_url,
    status: r.status,
    memo: r.memo,
    kakaoMemo: r.kakao_memo,
    emailMemo: r.email_memo,
    emailSent: r.email_sent,
    emailError: r.email_error,
    createdAt: r.created_at,
    receivedAt: r.received_at,
    updatedAt: r.updated_at
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase();
  if (!supabase) return res.status(200).json({ inquiries: [], error: 'ENV missing' });

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) return res.status(500).json({ error: error.message, code: error.code });
    const mapped = (data || []).map(mapRow);
    return res.status(200).json({ inquiries: mapped, total: mapped.length });
  }

  if (req.method === 'PATCH') {
    const { id, status, memo, kakaoMemo, emailMemo } = req.body;
    const update = { updated_at: new Date().toISOString() };
    if (status) update.status = status;
    if (memo !== undefined) update.memo = memo;
    if (kakaoMemo !== undefined) update.kakao_memo = kakaoMemo;
    if (emailMemo !== undefined) update.email_memo = emailMemo;
    const { data, error } = await supabase.from('inquiries').update(update).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, inquiry: mapRow(data) });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
