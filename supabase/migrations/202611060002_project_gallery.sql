create table public.gallery_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  location text not null default '',
  project_year text not null default '',
  image_paths text[] not null default '{}',
  image_alt_text text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_projects_title_not_blank check (length(trim(title)) > 0),
  constraint gallery_projects_has_images check (cardinality(image_paths) > 0)
);

alter table public.gallery_projects enable row level security;

create policy "Public reads published gallery projects" on public.gallery_projects
  for select to anon, authenticated using (is_published or public.has_admin_access());

create policy "Admins manage gallery projects" on public.gallery_projects
  for all to authenticated using (public.has_admin_access()) with check (public.has_admin_access());

create trigger audit_gallery_projects after insert or update or delete on public.gallery_projects
  for each row execute function public.audit_admin_change();

update public.website_content
set content = content || jsonb_build_object(
  'page_title', 'Our Projects',
  'introduction', 'A selection of electronic security installations delivered by our team.'
),
seo_description = 'Explore electronic security installations and projects completed by Muanotronics.'
where page = 'gallery';
