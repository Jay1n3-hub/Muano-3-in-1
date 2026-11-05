# Muanotronics security solutions

Responsive single-page application built with Vite, React, TypeScript, Tailwind CSS, React Router and Lucide React.

## Local development

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run typecheck
npm run build
npm run preview
```

The static site is generated in `dist/`. Netlify is configured to run `npm run build` and publish that directory. The root rewrite in `netlify.toml` and `public/_redirects` keeps React Router routes available on direct navigation and refresh.

The enquiry form uses Netlify Forms markup and submits using a normal `POST` to `/contact-success/`; no submission is reported as successful by client-side code. Enable Netlify Forms for the deployed site to receive submissions.

Visitors can choose Clean Minimal, Bold Corporate, or Corporate Technology with the Change Design control. The selected design is saved in `localStorage` and applied before the app renders to avoid a default-design flash. The separate Appearance and Logo Style controls remain independent.

Each design uses a separate homepage presentation (`src/designs/minimal`, `src/designs/corporate`, or `src/designs/technology`). Shared service data, enquiry forms, and service interactions are reused across the presentations. Corporate Technology also includes a four-step consultation-to-installation process.

Clean Minimal remains the default presentation. Bold Corporate uses a dark, red-accented six-image service grid, while Corporate Technology uses a panoramic architectural hero, a four-item capability strip, two featured service cards, four supporting cards, and a responsive four-step process.

The provided mockup was the only brand asset in the workspace. The wordmark and corner-mark treatment follow that reference; replace them with the stakeholder's original SVG/PNG files when available.
