-- ============================================================================
-- Deal lead-capture forms + GetSetGo lead sourcing
-- Reuses the existing `leads` table (0001_init.sql) and its RLS:
--   leads_public_insert (anyone can submit) / leads_admin_read|write|delete.
-- Adds the deal-editor's lead-form field config to `deals`, plus deal/quest
-- sourcing + freeform answers to `leads`.
-- ============================================================================

-- The lead-capture form the public fills in (when a deal's action_type =
-- 'leadform'). Array of { label, type, placeholder, required, options }.
alter table deals
  add column if not exists lead_form_fields jsonb not null default '[]';

-- Source + payload for GetSetGo leads (the directory's listing_id stays nullable).
alter table leads add column if not exists deal_id uuid references deals(id) on delete set null;
alter table leads add column if not exists quest_id uuid references quests(id) on delete set null;
-- Snapshot titles so a lead still reads correctly if its deal/quest is deleted.
alter table leads add column if not exists source_deal text;
alter table leads add column if not exists source_quest text;
-- The user's answers to the deal's custom fields: [[question, answer], …].
alter table leads add column if not exists answers jsonb not null default '[]';

create index if not exists leads_deal_idx on leads(deal_id);
