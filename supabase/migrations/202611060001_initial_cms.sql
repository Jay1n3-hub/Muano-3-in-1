create type public.admin_role as enum ('super_admin', 'administrator', 'editor');
create type public.enquiry_status as enum ('new', 'in_progress', 'responded', 'closed');

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role public.admin_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table public.website_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table public.website_content (
  page text primary key,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published')),
  seo_title text not null default '',
  seo_description text not null default '',
  published_by uuid references auth.users(id),
  published_at timestamptz,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into public.website_content (page, content, status, seo_title, seo_description, published_at)
values
  ('home', '{
    "hero_label":"ELECTRONIC SECURITY SYSTEMS",
    "hero_heading":"Smart Security. Intelligent Protection.",
    "hero_description":"Muanotronics delivers electronic security solutions for residential, commercial and industrial properties.",
    "hero_image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=88",
    "hero_image_alt":"Modern commercial building at night",
    "hero_focal_position":"center",
    "primary_cta_text":"Request a Quote",
    "primary_cta_destination":"quote",
    "secondary_cta_text":"Explore Our Services",
    "secondary_cta_destination":"/services/",
    "feature_strip_heading":"Our approach",
    "feature_strip_items":["Integrated Security","Professional Installation","Tailored Solutions","Ongoing Support"]
  }'::jsonb, 'published', 'Muanotronics | Smart Security. Intelligent Protection.',
   'Electronic security solutions for residential, commercial and industrial properties.', now()),
  ('about', '{
    "page_heading":"About Muanotronics",
    "section_heading":"Electronic security systems",
    "introduction":"Muanotronics provides electronic security systems for residential, commercial and industrial properties in South Africa.",
    "description":"Our services include CCTV, access control, visitor management, PA systems, alarms and electric fencing.",
    "main_image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    "image_alt_text":"Contemporary commercial building representing the spaces we help protect",
    "cta_text":"Talk to Our Team",
    "approach_heading":"How we work",
    "approach_items":["Listen carefully to your security priorities.","Recommend solutions that fit your property and budget.","Install with care and provide ongoing support."]
  }'::jsonb, 'published', 'About Muanotronics',
   'Learn about Muanotronics and our approach to electronic security solutions.', now()),
  ('why-us', '{
    "main_heading":"How we work",
    "supporting_description":"Our process covers assessment, planning, installation and support.",
    "main_image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    "process_heading":"From assessment to installation.",
    "process_steps":["Consultation|Discuss your property and security requirements.","Site Assessment|Review the site, access points and areas to cover.","Solution Design|Plan equipment and placement for your requirements.","Installation & Support|Install the system and provide ongoing support."]
  }'::jsonb, 'published', 'Why Choose Muanotronics?',
   'Learn about the Muanotronics service and installation process.', now()),
  ('gallery', '{
    "heading":"GALLERY",
    "status":"Under Construction",
    "construction_heading":"Our Project Gallery Is Under Construction",
    "construction_message":"We are preparing a showcase of our electronic security installations and solutions. Check back soon to see our work.",
    "contact_button":"Contact Us",
    "view_gallery_button":"View Gallery"
  }'::jsonb, 'published', 'Project Gallery | Muanotronics',
   'Our project gallery is under construction. Check back soon.', now()),
  ('contact', '{
    "heading":"Contact Us",
    "description":"Request a quote or arrange a site visit for your property.",
    "quote_instructions":"Provide your property and contact details. Our team will follow up.",
    "site_visit_instructions":"Provide your property, preferred visit details and contact information."
  }'::jsonb, 'published', 'Contact Muanotronics',
   'Contact Muanotronics to discuss an electronic security system or arrange a site visit.', now())
on conflict (page) do nothing;

create table public.content_drafts (
  id uuid primary key default gen_random_uuid(),
  page text not null unique,
  content jsonb not null default '{}'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  content jsonb not null,
  seo_title text not null default '',
  seo_description text not null default '',
  published_by uuid references auth.users(id),
  published_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  full_description text not null default '',
  main_image text not null default '',
  secondary_images text[] not null default '{}',
  image_alt_text text not null default '',
  icon text not null default 'Shield',
  features text[] not null default '{}',
  benefits text[] not null default '{}',
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_published boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.why_choose_us_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '',
  image text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null default '',
  file_type text not null,
  file_size bigint not null default 0,
  width integer,
  height integer,
  alt_text text not null default '',
  caption text not null default '',
  category text not null default 'general'
    check (category in ('homepage', 'about', 'services', 'gallery', 'general')),
  focal_position text not null default 'center',
  is_published boolean not null default false,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create table public.brand_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  asset_type text not null,
  file_path text not null unique,
  preview_url text not null default '',
  background_suitability text not null default 'both',
  alt_text text not null default '',
  is_active boolean not null default true,
  is_default boolean not null default false,
  is_favicon_default boolean not null default false,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create unique index brand_assets_one_default_idx on public.brand_assets (is_default) where is_default;
create unique index brand_assets_one_favicon_default_idx on public.brand_assets (is_favicon_default) where is_favicon_default;

create or replace function public.set_default_brand_asset(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_admin_access() then
    raise exception 'Administrator access required';
  end if;
  if not exists (select 1 from public.brand_assets where id = target_id) then
    raise exception 'Brand asset not found';
  end if;

  update public.brand_assets set is_default = false where is_default;
  update public.brand_assets set is_default = true, is_active = true where id = target_id;
end;
$$;
revoke all on function public.set_default_brand_asset(uuid) from public, anon;
grant execute on function public.set_default_brand_asset(uuid) to authenticated;

create or replace function public.set_default_favicon_asset(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_admin_access() then
    raise exception 'Administrator access required';
  end if;
  if not exists (
    select 1 from public.brand_assets
    where id = target_id
      and (
        asset_type like 'Favicon%'
        or asset_type in ('16 × 16 PNG', '32 × 32 PNG', 'Apple touch icon', '192 × 192 icon', '512 × 512 icon')
      )
  ) then
    raise exception 'Select a favicon asset';
  end if;

  update public.brand_assets set is_favicon_default = false where is_favicon_default;
  update public.brand_assets set is_favicon_default = true, is_active = true where id = target_id;
end;
$$;
revoke all on function public.set_default_favicon_asset(uuid) from public, anon;
grant execute on function public.set_default_favicon_asset(uuid) to authenticated;

insert into public.services (
  name, slug, short_description, full_description, main_image, image_alt_text, icon,
  features, benefits, display_order, is_active, is_published, seo_title
) values
  ('CCTV Systems', 'cctv-systems', 'Camera systems planned for your property.',
   'We plan camera placement, coverage and remote viewing options around your premises.',
   'https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=1400&q=85',
   'Dome CCTV camera mounted on the exterior of a building', 'Camera',
   array['Site-specific camera placement','Remote viewing options','Scalable camera coverage','Professional installation'],
   array['Greater visibility around your property','Review activity when it suits you','A system tailored to your needs'],
   1, true, true, 'CCTV Systems | Muanotronics'),
  ('Access Control', 'access-control', 'Manage entry to your property.',
   'We plan readers, credentials and access permissions around your entry points and daily operations.',
   'https://images.unsplash.com/photo-1627227702786-f3268b95f980?auto=format&fit=crop&w=1400&q=85',
   'Keypad access reader on a secure entrance gate', 'LockKeyhole',
   array['Entry points planned around your site','Access credentials selected for your needs','Flexible permissions','Integration planning'],
   array['More control over entry','A smoother experience for authorised visitors','Room to adapt as requirements change'],
   2, true, true, 'Access Control | Muanotronics'),
  ('Visitor Management Systems', 'visitor-management', 'Organise visitor registration and access.',
   'We assess your reception workflow and plan suitable check-in and visitor access equipment.',
   'https://images.unsplash.com/photo-1759143545924-beb85b33c0f1?auto=format&fit=crop&w=1400&q=85',
   'Receptionist using a tablet to welcome a visitor at reception', 'UsersRound',
   array['Visitor arrival and access planning','Reception workflow assessment','Suitable entry-point coordination','Flexible options for different premises'],
   array['A more consistent visitor experience','Clearer front-of-house processes','A solution suited to your environment'],
   3, true, true, 'Visitor Management Systems | Muanotronics'),
  ('PA Systems', 'pa-systems', 'Make announcements across your site.',
   'We consider site use, speaker placement and coverage when planning your PA system.',
   'https://images.unsplash.com/photo-1763420953483-86239ad9c206?auto=format&fit=crop&w=1400&q=85',
   'Professional public-address speaker array installed beneath a venue ceiling', 'Megaphone',
   array['Coverage planned for your spaces','Indoor and outdoor requirements considered','Equipment matched to the application','Professional setup'],
   array['Clearer communication across your site','A consistent announcement experience','A system planned for your environment'],
   4, true, true, 'PA Systems | Muanotronics'),
  ('Alarm & Intrusion Systems', 'alarm-intrusion', 'Detect activity around your premises.',
   'We plan detection zones and equipment around your property''s layout and security requirements.',
   'https://images.unsplash.com/photo-1697382608786-bcf4c113b86e?auto=format&fit=crop&w=1400&q=85',
   'Illuminated electronic security keypad mounted on a wall', 'ShieldAlert',
   array['Property-specific risk assessment','Intrusion detection planning','Zones designed around your layout','Professional installation and support'],
   array['An added layer of awareness','Coverage tailored to your property','Confidence supported by a considered plan'],
   5, true, true, 'Alarm & Intrusion Systems | Muanotronics'),
  ('Electric Fencing', 'electric-fencing', 'Add an electric security barrier.',
   'We assess the perimeter and installation requirements before planning your electric fencing.',
   'https://images.unsplash.com/photo-1787672358207-908761513e64?auto=format&fit=crop&w=1400&q=85',
   'Secure property perimeter with electric fencing above a boundary wall', 'Fence',
   array['Perimeter and site assessment','Installation planned for the property','Options for different boundary layouts','Maintenance and support guidance'],
   array['A visible perimeter-security measure','A design adapted to your boundary','A more complete security plan'],
   6, true, true, 'Electric Fencing | Muanotronics')
on conflict (slug) do nothing;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default
    ('MU-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  enquiry_type text not null check (enquiry_type in ('quote', 'site_visit')),
  full_name text not null,
  email text not null,
  phone text not null,
  service_required text not null default '',
  property_type text not null default '',
  preferred_date date,
  preferred_time time,
  message text not null,
  status public.enquiry_status not null default 'new',
  internal_notes text not null default '',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id text,
  change_summary text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.audit_admin_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_row jsonb;
begin
  if (select auth.uid()) is not null then
    changed_row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
    insert into public.audit_logs (user_id, action, entity, entity_id, change_summary)
    values (
      (select auth.uid()),
      lower(tg_op),
      tg_table_name,
      coalesce(changed_row ->> 'id', changed_row ->> 'page', changed_row ->> 'key', changed_row ->> 'slug'),
      initcap(lower(tg_op)) || ' record'
    );
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger audit_admin_users after insert or update or delete on public.admin_users
  for each row execute function public.audit_admin_change();
create trigger audit_website_settings after insert or update or delete on public.website_settings
  for each row execute function public.audit_admin_change();
create trigger audit_website_content after insert or update or delete on public.website_content
  for each row execute function public.audit_admin_change();
create trigger audit_content_drafts after insert or update or delete on public.content_drafts
  for each row execute function public.audit_admin_change();
create trigger audit_services after insert or update or delete on public.services
  for each row execute function public.audit_admin_change();
create trigger audit_process_steps after insert or update or delete on public.process_steps
  for each row execute function public.audit_admin_change();
create trigger audit_why_items after insert or update or delete on public.why_choose_us_items
  for each row execute function public.audit_admin_change();
create trigger audit_media_assets after insert or update or delete on public.media_assets
  for each row execute function public.audit_admin_change();
create trigger audit_brand_assets after insert or update or delete on public.brand_assets
  for each row execute function public.audit_admin_change();
create trigger audit_enquiries after insert or update or delete on public.enquiries
  for each row execute function public.audit_admin_change();

create or replace function public.has_admin_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = (select auth.uid())
      and is_active
  );
$$;

create or replace function public.has_admin_role(required_roles public.admin_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = (select auth.uid())
      and is_active
      and role = any(required_roles)
  );
$$;

alter table public.admin_users enable row level security;
alter table public.website_settings enable row level security;
alter table public.website_content enable row level security;
alter table public.content_drafts enable row level security;
alter table public.content_revisions enable row level security;
alter table public.services enable row level security;
alter table public.process_steps enable row level security;
alter table public.why_choose_us_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.brand_assets enable row level security;
alter table public.enquiries enable row level security;
alter table public.audit_logs enable row level security;

create policy "Admins can view own profile" on public.admin_users
  for select to authenticated
  using (auth_user_id = (select auth.uid()) or public.has_admin_role(array['super_admin']::public.admin_role[]));
create policy "Super admins manage admin profiles" on public.admin_users
  for all to authenticated
  using (public.has_admin_role(array['super_admin']::public.admin_role[]))
  with check (public.has_admin_role(array['super_admin']::public.admin_role[]));

create policy "Public reads public settings" on public.website_settings
  for select to anon, authenticated using (is_public or public.has_admin_access());
create policy "Admins manage website settings" on public.website_settings
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create policy "Public reads published website content" on public.website_content
  for select to anon, authenticated using (status = 'published' or public.has_admin_access());
create policy "Admins manage website content" on public.website_content
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());
create policy "Admins manage content drafts" on public.content_drafts
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());
create policy "Admins read content revisions" on public.content_revisions
  for select to authenticated using (public.has_admin_access());
create policy "Admins create content revisions" on public.content_revisions
  for insert to authenticated with check (public.has_admin_access());

create or replace function public.publish_website_content(
  target_page text,
  next_content jsonb,
  next_seo_title text,
  next_seo_description text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_admin_access() then
    raise exception 'Administrator access required';
  end if;

  insert into public.content_revisions (page, content, seo_title, seo_description, published_by)
  select page, content, seo_title, seo_description, (select auth.uid())
  from public.website_content
  where page = target_page and status = 'published';

  insert into public.website_content (
    page, content, status, seo_title, seo_description, published_by, published_at, updated_by, updated_at
  ) values (
    target_page, next_content, 'published', next_seo_title, next_seo_description,
    (select auth.uid()), now(), (select auth.uid()), now()
  )
  on conflict (page) do update set
    content = excluded.content,
    status = excluded.status,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    published_by = excluded.published_by,
    published_at = excluded.published_at,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  delete from public.content_drafts where page = target_page;
end;
$$;
revoke all on function public.publish_website_content(text, jsonb, text, text) from public, anon;
grant execute on function public.publish_website_content(text, jsonb, text, text) to authenticated;

create policy "Public reads published services" on public.services
  for select to anon, authenticated
  using ((is_active and is_published) or public.has_admin_access());
create policy "Admins manage services" on public.services
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create policy "Public reads active process steps" on public.process_steps
  for select to anon, authenticated using (is_active or public.has_admin_access());
create policy "Admins manage process steps" on public.process_steps
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());
create policy "Public reads active why items" on public.why_choose_us_items
  for select to anon, authenticated using (is_active or public.has_admin_access());
create policy "Admins manage why items" on public.why_choose_us_items
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create policy "Public reads published media" on public.media_assets
  for select to anon, authenticated using (is_published or public.has_admin_access());
create policy "Admins manage media" on public.media_assets
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());
create policy "Public reads active brand assets" on public.brand_assets
  for select to anon, authenticated using ((is_active and (is_default or is_favicon_default)) or public.has_admin_access());
create policy "Admins manage brand assets" on public.brand_assets
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create policy "Public submits enquiries" on public.enquiries
  for insert to anon, authenticated
  with check (
    length(trim(full_name)) between 2 and 160
    and length(trim(email)) between 5 and 254
    and length(trim(phone)) between 7 and 40
    and length(trim(message)) between 2 and 5000
    and status = 'new'
    and internal_notes = ''
  );
create policy "Admins read enquiries" on public.enquiries
  for select to authenticated using (public.has_admin_access());
create policy "Admins update enquiries" on public.enquiries
  for update to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create policy "Admins read audit logs" on public.audit_logs
  for select to authenticated
  using (public.has_admin_role(array['super_admin', 'administrator']::public.admin_role[]));
create policy "Admins create audit logs" on public.audit_logs
  for insert to authenticated with check (public.has_admin_access());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', false, 10485760, array['image/jpeg','image/png','image/webp']),
  ('brand-assets', 'brand-assets', false, 5242880, array['image/jpeg','image/png','image/webp','image/svg+xml','image/x-icon'])
on conflict (id) do nothing;

create policy "Admins upload site media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('site-media', 'brand-assets') and public.has_admin_access());
create policy "Admins update site media" on storage.objects
  for update to authenticated
  using (bucket_id in ('site-media', 'brand-assets') and public.has_admin_access())
  with check (bucket_id in ('site-media', 'brand-assets') and public.has_admin_access());
create policy "Admins delete site media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('site-media', 'brand-assets') and public.has_admin_access());
create policy "Admins read protected media objects" on storage.objects
  for select to authenticated
  using (bucket_id in ('site-media', 'brand-assets') and public.has_admin_access());
create policy "Public reads published site media" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'site-media'
    and exists (
      select 1 from public.media_assets
      where media_assets.storage_path = storage.objects.name
        and media_assets.is_published
    )
  );
create policy "Public reads active default brand asset" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'brand-assets'
    and exists (
      select 1 from public.brand_assets
      where brand_assets.file_path = storage.objects.name
        and brand_assets.is_active
        and (brand_assets.is_default or brand_assets.is_favicon_default)
    )
  );
