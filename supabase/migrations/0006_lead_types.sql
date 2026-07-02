-- ============================================================================
-- Lead types — distinguish deal lead-capture submissions from the public
-- "Contact Us" and "Partner With Us" form submissions. All three land in the
-- single `leads` table (existing RLS: leads_public_insert / admin read-write-
-- delete) and are split into separate tabs in the admin Leads dashboard.
-- ============================================================================

-- 'deal' (default) | 'contact' | 'partner'
alter table leads add column if not exists lead_type text not null default 'deal';
-- Contact form: the message subject. Partner form: not used.
alter table leads add column if not exists subject text;
-- Partner form: the company / program name (shown in the Partnership tab).
alter table leads add column if not exists company text;

create index if not exists leads_type_idx on leads(lead_type);
