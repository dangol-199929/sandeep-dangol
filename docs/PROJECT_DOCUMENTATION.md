# Portfolio 2025 — Project Documentation

**Target audience:** Developers maintaining or extending this codebase.

This document describes the portfolio project’s purpose, APIs, data flow, SEO setup, and suggested future work.

---

## 1. Website Objective

The site is a **personal portfolio** for **Sandeep Dangol**, a frontend web developer. It aims to:

- **Showcase** skills, projects, and work experience.
- **Provide** a downloadable resume (PDF) and contact information.
- **Allow** content management via a protected admin dashboard (projects, experience, resume upload).
- **Collect** contact form submissions via Formspree (third-party).

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion, Vercel Analytics.

---

## 2. How APIs Work

All APIs live under **`app/api/`** as Next.js Route Handlers. They use the **filesystem** (JSON files and `public/`) for persistence—no database.

### 2.1 Experiences API — `GET /api/experiences`, `POST`, `PUT`, `DELETE`

| Method   | Path                       | Purpose                                               |
| -------- | -------------------------- | ----------------------------------------------------- |
| `GET`    | `/api/experiences`         | List all experience entries                           |
| `POST`   | `/api/experiences`         | Create one experience (body: JSON)                    |
| `PUT`    | `/api/experiences`         | Update one experience (body: JSON, must include `id`) |
| `DELETE` | `/api/experiences?id=<id>` | Delete one experience by `id`                         |

- **Data file:** `data/experiences.json`
- **Shape:** `{ id, title, company, period, description, side: "left" | "right" }`
- **IDs:** Generated with `Date.now().toString()` on create.
- **Order:** New items are added at the beginning (`unshift`). Sides alternate for timeline layout.

**Example POST body:**

```json
{
  "title": "Frontend Developer",
  "company": "Acme Inc",
  "period": "2022 – Present",
  "description": "Built React apps.",
  "side": "left"
}
```

**Example PUT body:** Same fields plus `id`. Only provided fields are merged into the existing item.

---

### 2.2 Projects API — `GET /api/projects`, `POST`, `PUT`, `DELETE`

| Method   | Path                    | Purpose                                            |
| -------- | ----------------------- | -------------------------------------------------- |
| `GET`    | `/api/projects`         | List all projects                                  |
| `POST`   | `/api/projects`         | Create one project (body: JSON)                    |
| `PUT`    | `/api/projects`         | Update one project (body: JSON, must include `id`) |
| `DELETE` | `/api/projects?id=<id>` | Delete one project by `id`                         |

- **Data file:** `data/projects.json`
- **Shape:** `{ id, title, description, fullDescription, image, tags[], liveUrl, githubUrl, metrics[] }`
- **IDs:** Same as experiences (`Date.now().toString()`).

**Example POST body:**

```json
{
  "title": "My App",
  "description": "Short summary",
  "fullDescription": "Longer markdown or HTML",
  "image": "revv",
  "tags": ["React", "Next.js"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/...",
  "metrics": []
}
```

`image` is a key into `imageconfig.ts` (e.g. `revv`, `bs`, `koklass`). Uploaded images via `/api/upload` return a path like `/uploads/project-123.webp` that can also be stored.

---

### 2.3 Resume API — `GET /api/resume`, `POST /api/resume`

| Method | Path          | Purpose                                          |
| ------ | ------------- | ------------------------------------------------ |
| `GET`  | `/api/resume` | Return current resume path from settings         |
| `POST` | `/api/resume` | Upload a new PDF and set it as the active resume |

- **Settings file:** `data/settings.json` — `{ "resumePath": "/resume/..." }`
- **Storage:** PDFs are written to `public/resume/` as `resume-<timestamp>.pdf`.
- **GET response:** `{ "resumePath": "/resume/resume-123.pdf" }`
- **POST:** `multipart/form-data`, field name `file`. Only `application/pdf` allowed.

**Example POST:** FormData with `file` = PDF file.

---

### 2.4 Upload API — `POST /api/upload`

| Method | Path          | Purpose                                |
| ------ | ------------- | -------------------------------------- |
| `POST` | `/api/upload` | Upload an image for project thumbnails |

- **Storage:** `public/uploads/`. Filenames: `project-<timestamp>.<ext>`.
- **Allowed types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- **Request:** `multipart/form-data`, field name `file`.
- **Response:** `{ "path": "/uploads/project-123.png", "success": true }`.

**Note:** No authentication on API routes. Admin auth is handled in the UI only (see [Auth](#auth--admin-access)).

---

## 3. Services Layer (`services/`)

The **services** are the single place the app uses to talk to the APIs. Components should use these instead of calling `fetch("/api/...")` directly.

| File                     | Exports                                                                      | Purpose                                            |
| ------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `types.ts`               | `Project`, `Experience`, `ResumeResponse`, `Skill`, `ContactItem`            | Shared types                                       |
| `index.ts`               | Re-exports all services and types                                            | Single import entry                                |
| `experiences.service.ts` | `getExperiences`, `createExperience`, `updateExperience`, `deleteExperience` | Experiences CRUD                                   |
| `projects.service.ts`    | `getProjects`, `createProject`, `updateProject`, `deleteProject`             | Projects CRUD                                      |
| `resume.service.ts`      | `getResumePath`, `uploadResume`                                              | Resume path and upload                             |
| `contact.service.ts`     | `getContactInfo(resumePath?)`                                                | Static contact list (email, LinkedIn, resume link) |
| `skills.service.ts`      | `getSkills()`                                                                | Static skills list (name + level %)                |

- **Contact** and **skills** are **static** in code; the comments say they “can be extended to fetch from /api/settings or similar” in the future.
- All API-based services use **`NEXT_PUBLIC_API_URL`** from `.env` as the API base. Set it (e.g. `http://localhost:8080`) for an external backend; leave unset or empty for same-origin. The shared helper is in `services/api.ts` (`apiUrl(path)`).

---

## 4. Data Flow

### 4.1 Public site (visitors)

```
data/*.json, public/resume, public/uploads
        ↓
   API routes (GET only used here)
        ↓
   services (getProjects, getExperiences, getResumePath)
        ↓
   Components
```

| Section        | Data source             | Service / method                      |
| -------------- | ----------------------- | ------------------------------------- |
| **Hero**       | Static copy             | —                                     |
| **About**      | Resume path             | `getResumePath()`                     |
| **Skills**     | Static                  | `getSkills()`                         |
| **Projects**   | `data/projects.json`    | `getProjects()`                       |
| **Experience** | `data/experiences.json` | `getExperiences()`                    |
| **Contact**    | Static + Formspree      | `getContactInfo()`, form to Formspree |

Project images: either keys into `imageconfig.ts` (e.g. `revv`, `bs`) or URLs from `/api/upload` (e.g. `/uploads/project-123.png`). `projects-section.tsx` maps known keys to `imageconfig`; other images can be used via `Image`/`src` directly.

### 4.2 Admin dashboard (`/admin`)

```
User (authenticated in UI only)
        ↓
   Admin page uses services for all CRUD + resume upload
        ↓
   services → API routes (GET, POST, PUT, DELETE, POST resume/upload)
        ↓
   API routes read/write data/*.json, public/resume, public/uploads
```

- **Projects:** list, add, edit, delete via `projects.service` → `/api/projects`.
- **Experience:** list, add, edit, delete via `experiences.service` → `/api/experiences`.
- **Resume:** current path from `getResumePath()`, upload via `uploadResume(file)` → `POST /api/resume`.
- **Project images:** optional upload via `POST /api/upload` (e.g. from `ImageUpload`), then the returned path is stored in the project’s `image` field (or a dedicated image URL field, depending on form).

Admin auth is **client-only**: see [Auth & admin access](#auth--admin-access) below.

---

## 5. SEO

### 5.1 Metadata (`app/layout.tsx`)

- **Title:** `Sandeep Dangol - Frontend Web Developer`
- **Description:** Graduate Software Engineer, 4+ years frontend, React/Next.js/JS/TS.
- **Open Graph:** title, description, type `website`, image (see note below).
- **Twitter:** `summary_large_image`, title, description.
- **Viewport:** theme color `#0a0a0a`, device-width, initial scale 1.

**Note:** Layout references `url: '/og-image.png'` for OG image; `app/page.tsx` uses `og.png` in meta tags. Align these (e.g. use one canonical OG image path like `/og.png`) so social previews stay consistent.

### 5.2 Page-level meta tags (`app/page.tsx`)

Duplicate OG/Twitter/social image tags are set in the page (e.g. `og:image`, `twitter:image`, `linkedin:image`, etc.) pointing to `/og.png`. Prefer defining the canonical OG image once in `layout.tsx` metadata and removing duplicates from the page to avoid divergence.

### 5.3 Analytics

- **Vercel Analytics** is included in the root layout and tracks usage when deployed on Vercel.

### 5.4 Suggested SEO improvements

- Add a canonical URL in metadata when the production URL is fixed.
- Use Next.js `metadataBase` so OG image URLs are absolute (required by many platforms).
- Consider `robots.txt` / sitemap if you add more routes or need indexing rules.

---

## 6. Auth & Admin Access

- **Location:** `lib/auth-context.tsx`
- **Mechanism:** Client-side only. Credentials are hardcoded (`admin` / `portfolio2024`). A successful login sets `sessionStorage.admin_auth = "authenticated"`.
- **Protection:** Only the admin UI checks `isAuthenticated` and redirects to `/admin/login` if not set. **API routes do not check auth.** Anyone who can send HTTP requests can call POST/PUT/DELETE. For a real deployment, add authentication/authorization (e.g. API route middleware, server-side session, or token validation) and avoid hardcoded credentials.

---

## 7. Future Todos (suggested)

Inferred from structure and comments:

| Area                | Suggestion                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**            | Replace hardcoded admin credentials and client-only auth with proper auth (e.g. NextAuth, API middleware, env-based secrets).                              |
| **API security**    | Protect POST/PUT/DELETE (and resume/upload) with auth or API keys so only the admin can mutate data.                                                       |
| **Contact**         | Move contact info (email, LinkedIn, etc.) to `data/settings.json` or a small API and consume via `getContactInfo()` so it’s editable without code changes. |
| **Skills**          | Move skills to `data/skills.json` (or similar) and add GET (and optional admin CRUD) so skills are data-driven.                                            |
| **OG image**        | Unify OG image to one path (e.g. `/og.png`) in `layout.tsx` and remove duplicate meta tags from `app/page.tsx`. Set `metadataBase` for absolute OG URLs.   |
| **Projects images** | Decide a single strategy: either only keys into `imageconfig`, or only uploaded URLs, or both with clear mapping in the UI.                                |
| **Validation**      | Add request validation (e.g. Zod) in API routes for POST/PUT bodies and return 400 with clear messages.                                                    |
| **Error handling**  | Standardize API error response shape (e.g. `{ error: string, code?: string }`) and document it.                                                            |
| **Database**        | If content or traffic grows, consider moving from JSON files to a database (e.g. SQLite, Postgres) and keep the same service interface.                    |

---

## 8. Key Files Reference

| Path                       | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `app/page.tsx`             | Public home (sections)                         |
| `app/layout.tsx`           | Root layout, metadata, Analytics               |
| `app/admin/page.tsx`       | Admin dashboard (projects, experience, resume) |
| `app/admin/login/page.tsx` | Admin login                                    |
| `app/api/*/route.ts`       | API handlers                                   |
| `services/*.ts`            | API client layer and types                     |
| `data/experiences.json`    | Experience entries                             |
| `data/projects.json`       | Projects                                       |
| `data/settings.json`       | Resume path (and future settings)              |
| `lib/auth-context.tsx`     | Admin auth state                               |
| `imageconfig.ts`           | Image imports for OG, profile, project assets  |

---

## 9. Scripts (`package.json`)

| Script  | Command      | Purpose               |
| ------- | ------------ | --------------------- |
| `dev`   | `next dev`   | Local development     |
| `build` | `next build` | Production build      |
| `start` | `next start` | Run production server |
| `lint`  | `eslint .`   | Lint                  |

Use **pnpm** (or npm/yarn) as in the existing README.

---

_Last updated from codebase snapshot. Align with actual code when making changes._
