-- 기존 DB에 패치
 alter table inquiries add column if not exists linked_listing text;
 alter table inquiries add column if not exists assigned_to text;
 alter table inquiries add column if not exists follow_up_date date;
