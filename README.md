# Muanotronics Website

Responsive Vite, React and TypeScript website with one public Corporate Technology design and a protected Supabase-backed administration area.

## Local development

```sh
npm ci
npm run dev
```

## Supabase setup

1. Create a Supabase project and configure the Auth email provider.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never put a service-role key or database password in browser environment variables.
3. Apply `supabase/migrations/202611060001_initial_cms.sql` to the project. It creates the CMS schema, seeded public content and services, RLS policies and private storage buckets.
4. Apply subsequent migrations in order, including `supabase/migrations/202611060002_project_gallery.sql`, which creates the project gallery table and its access policies.
5. In Supabase Auth, create or invite the first administrator. Then use the Supabase SQL editor as a trusted operator to assign the account:

   ```sql
   insert into public.admin_users (auth_user_id, email, display_name, role, is_active)
   select id, email, 'Administrator Name', 'super_admin', true
   from auth.users
   where email = 'admin@example.com';
   ```

   Replace the name and email with the invited account. Do not expose this SQL workflow to public users. Further administrators must be provisioned by a trusted administrator.
6. Add `/admin/login` to Supabase Auth's allowed redirect URLs for the local and deployed domains. Configure email templates and SMTP for password recovery.
7. Add the same two public environment variables in Netlify. Push the `development` branch only after review and testing; production `main` remains unchanged.

If Supabase is not configured, `/admin/login` shows a backend-not-configured notice. The public website remains available, and its quote and site-visit forms continue to use Netlify Forms. When Supabase is configured, forms report success only after the enquiry insert succeeds.

## Admin routes

- `/admin/login` — administrator sign-in and password recovery; there is no public registration.
- `/admin` — live metrics, quick actions and an embedded preview of the public website.
- `/admin/content` — edit public pages, save drafts, preview changes, publish and restore revisions.
- `/admin/services` — create, edit, publish, reorder and delete service records.
- `/admin/gallery` — upload project photos, manage project details, and publish projects to the public gallery.
- `/admin/logos` — upload a new website logo or restore a previous logo.
- `/admin/enquiries` — review quote and site-visit requests, update status and save internal notes.
- `/admin/settings` — website/contact/SEO settings plus security and integration status.
- `/admin/analytics` — honest under-construction placeholder; no fabricated metrics.

The public website reads published database content only. Drafts, enquiries, internal notes, administrator data and audit logs are protected by RLS. Storage buckets are private; object access follows the published media and active brand-asset records. `/admin/media` redirects to the project gallery; images for other website content can be uploaded directly from each image picker.

## Checks and deployment

```sh
npm run typecheck
npm run build
```

Netlify publishes `dist/`; `netlify.toml` provides the SPA fallback for public and `/admin/*` routes. Apply all migrations and configure environment values before testing live CMS operations. No Supabase credentials or administrator account are included in this repository.
