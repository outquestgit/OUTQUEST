-- Rebrand: replace every legacy "SideQuesta" / "SideQuest" brand string with
-- "OutQuest" in already-seeded rows. The earlier seed migrations were corrected
-- too, but they don't re-run on an existing database, so the live content keeps
-- the old brand until this runs.
--
-- Covers displayed AND non-displayed text (titles, SEO meta, JSON content blobs,
-- footer copyright, etc.), both the "SideQuesta" and the shorter "SideQuest"
-- form, in all three casings. The longer "SideQuesta" is replaced first so it
-- never degrades to "OutQuesta". Only rows that still contain the brand are
-- rewritten, so this is safe to run more than once.

do $$
declare
  r record;
begin
  -- Plain text / varchar columns across the content tables.
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('quests', 'deals', 'journal_posts')
      and data_type in ('text', 'character varying')
  loop
    execute format(
      'update public.%1$I set %2$I =
         replace(replace(replace(replace(replace(replace(%2$I,
           ''SideQuesta'', ''OutQuest''), ''sidequesta'', ''outquest''), ''SIDEQUESTA'', ''OUTQUEST''),
           ''SideQuest'',  ''OutQuest''), ''sidequest'',  ''outquest''), ''SIDEQUEST'',  ''OUTQUEST'')
       where %2$I ilike ''%%sidequest%%''',
      r.table_name, r.column_name
    );
  end loop;

  -- JSONB blobs (quest/deal/post content + the whole site_settings row). Cast to
  -- text, replace, cast back — matches the brand anywhere inside the structure.
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('quests', 'deals', 'journal_posts', 'site_settings')
      and data_type = 'jsonb'
  loop
    execute format(
      'update public.%1$I set %2$I =
         replace(replace(replace(replace(replace(replace(%2$I::text,
           ''SideQuesta'', ''OutQuest''), ''sidequesta'', ''outquest''), ''SIDEQUESTA'', ''OUTQUEST''),
           ''SideQuest'',  ''OutQuest''), ''sidequest'',  ''outquest''), ''SIDEQUEST'',  ''OUTQUEST'')::jsonb
       where %2$I::text ilike ''%%sidequest%%''',
      r.table_name, r.column_name
    );
  end loop;
end $$;
