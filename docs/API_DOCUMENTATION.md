# API Documentation

This document describes the portfolio API: data structures (matching the current JSON files), request/response shapes, and error handling. It also covers **About us**, **Contact us** (form submission and contact information display), and **Personal info** (settings and resume).

**Base path:** `/api` (relative to the app origin)

---

## 1. Data Structures

### 1.1 Experience

Matches `data/experiences.json` (array of objects).

| Field         | Type                  | Required               | Description                                          |
| ------------- | --------------------- | ---------------------- | ---------------------------------------------------- |
| `id`          | string                | yes (server-generated) | Unique identifier (e.g. `"1"`, timestamp string).    |
| `title`       | string                | yes                    | Job or role title (e.g. `"Frontend Web Developer"`). |
| `company`     | string                | yes                    | Company or institution name.                         |
| `period`      | string                | yes                    | Time period (e.g. `"Aug 2021 - Aug 2025"`).          |
| `description` | string                | yes                    | Full description text.                               |
| `side`        | `"left"` \| `"right"` | yes                    | Timeline side for layout.                            |

**Example (single item):**

```json
{
  "id": "1",
  "title": "Frontend Web Developer",
  "company": "E.K. Solutions Pvt. Ltd",
  "period": "Aug 2021 - Aug 2025",
  "description": "Developed scalable web apps with React.js, Next.js, and modern UI frameworks...",
  "side": "right"
}
```

**Example (full file — array):**

```json
[
  {
    "id": "1",
    "title": "Frontend Web Developer",
    "company": "E.K. Solutions Pvt. Ltd",
    "period": "Aug 2021 - Aug 2025",
    "description": "Developed scalable web apps...",
    "side": "right"
  },
  {
    "id": "2",
    "title": "Web Developer Intern",
    "company": "E.K. Solutions Pvt. Ltd",
    "period": "June 2021 - Aug 2021",
    "description": "Translated design mockups...",
    "side": "left"
  }
]
```

---

### 1.2 Project

Matches `data/projects.json` (array of objects).

| Field             | Type     | Required               | Description                                                                                                                         |
| ----------------- | -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | string   | yes (server-generated) | Unique identifier.                                                                                                                  |
| `title`           | string   | yes                    | Project title.                                                                                                                      |
| `description`     | string   | yes                    | Short summary.                                                                                                                      |
| `fullDescription` | string   | yes                    | Longer description (e.g. markdown or plain text).                                                                                   |
| `image`           | string   | yes                    | Image key (e.g. `"assistant"`, `"revv"`, `"bs"`, `"koklass"`, `"ban"`) or URL path from upload (e.g. `"/uploads/project-123.png"`). |
| `tags`            | string[] | yes                    | List of tags.                                                                                                                       |
| `liveUrl`         | string   | yes                    | Live demo URL (use `"#"` if none).                                                                                                  |
| `githubUrl`       | string   | yes                    | GitHub URL (use `"#"` if none).                                                                                                     |
| `metrics`         | string[] | yes                    | List of metric or highlight strings.                                                                                                |

**Example (single item):**

```json
{
  "id": "1",
  "title": "AI Assistant Platform",
  "description": "AI-powered enterprise productivity tool automating day-to-day business workflows.",
  "fullDescription": "Designed and developed an AI assistant platform to handle HR tasks...",
  "image": "assistant",
  "tags": [
    "AI",
    "Automation",
    "Enterprise",
    "React",
    "Next.js",
    "TypeScript",
    "Workflow Optimization"
  ],
  "liveUrl": "#",
  "githubUrl": "#",
  "metrics": [
    "60% reduction in manual administrative effort",
    "Faster HR and client workflows",
    "Automated reporting and email tasks"
  ]
}
```

**Example (full file — array):** An array of objects with the same shape as above.

---

### 1.3 Settings (Resume)

Matches `data/settings.json` (single object). Used by the resume API.

| Field        | Type   | Description                                                                                                   |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------- |
| `resumePath` | string | Public URL path to the current resume PDF (e.g. `"/resume/Resume.pdf"` or `"/resume/resume-1234567890.pdf"`). |

**Example (full file):**

```json
{
  "resumePath": "/resume/Resume.pdf"
}
```

---

### 1.4 Contact information (display)

Contact information shown on the portfolio (email, LinkedIn, resume) is provided by the frontend service `getContactInfo()` in `services/contact.service.ts`. There is no GET endpoint for this data in the app; it is static in code. The resume link can optionally use the path from [Settings](#13-settings-resume) (e.g. from GET `/api/resume`).

Each contact item has this logical shape (icon is a Lucide component on the client, not sent over the wire):

| Field      | Type   | Description                                                |
| ---------- | ------ | ---------------------------------------------------------- |
| `label`    | string | Display label (e.g. `"Email"`, `"LinkedIn"`).              |
| `value`    | string | Display value or CTA text (e.g. email, "Download Resume"). |
| `href`     | string | URL (`mailto:...`, profile URL, or resume path).           |
| `target`   | string | Link target (`"_blank"` or `"_self"`).                     |
| `download` | string | Optional; filename for resume download.                    |

**Example (logical shape, e.g. for a future GET `/api/contact` or `/api/settings`):**

```json
[
  {
    "label": "Email",
    "value": "sandeepdangol1999sep29@gmail.com",
    "href": "mailto:sandeepdangol1999sep29@gmail.com",
    "target": "_blank"
  },
  {
    "label": "LinkedIn",
    "value": "linkedin.com/in/sandeep-dangol",
    "href": "https://linkedin.com/in/sandeep-dangol",
    "target": "_blank"
  },
  {
    "label": "Resume",
    "value": "Download Resume",
    "href": "/resume/Resume.pdf",
    "target": "_self",
    "download": "Sandeep_Dangol_Resume.pdf"
  }
]
```

---

### 1.5 About (display)

The About section (“About Me”) is rendered from `components/about-section.tsx`. All copy and profile fields are currently **static in the component**; there is no `data/about.json` or GET endpoint for about data. The only dynamic value is the resume path, which the component may fetch via GET [ `/api/resume` ](#get-apiresume).

Logical shape for a future GET `/api/about` or extended settings:

| Field          | Type     | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `name`         | string   | Full name (e.g. `"Sandeep Dangol"`).                                        |
| `email`        | string   | Email address.                                                              |
| `education`    | string   | Education line (e.g. `"BSc Computing (UCSI University)"`).                  |
| `availability` | string   | Status text (e.g. `"Open to opportunities"`).                               |
| `bio`          | string[] | Array of paragraph strings for the “About Me” body; or use single `string`. |
| `image`        | string   | Optional; path or key for profile image (e.g. `/uploads/me.jpg` or `"me"`). |

**Example (logical shape):**

```json
{
  "name": "Sandeep Dangol",
  "email": "sandeepdangol1999sep29@gmail.com",
  "education": "BSc Computing (UCSI University)",
  "availability": "Open to opportunities",
  "bio": [
    "Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript. Experienced in building scalable, user-focused web applications.",
    "I've collaborated with product managers, designers, and engineers in agile environments, optimizing performance through experimentation and delivering high-quality features in fast-moving, global teams.",
    "I leverage AI-assisted tools including GitHub Copilot-style workflows (Cursor IDE, v0) to improve development productivity while maintaining code quality. I'm motivated by continuous learning, customer feedback, and building intuitive digital experiences."
  ],
  "image": "/uploads/me.jpg"
}
```

---

## 2. Error Structure

All error responses use the same shape. HTTP status is in the response status code; the body is JSON.

### Error response body

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `error` | string | Human-readable error message. |

**Example:**

```json
{
  "error": "Experience not found"
}
```

### Status codes used for errors

| Status | Meaning               | When used (examples)                        |
| ------ | --------------------- | ------------------------------------------- |
| `400`  | Bad Request           | Missing body/field (e.g. no file, no `id`). |
| `404`  | Not Found             | Entity not found for given `id`.            |
| `500`  | Internal Server Error | Read/write failure or unexpected error.     |

---

## 3. Endpoints

### 3.1 Experiences

**Base path:** `/api/experiences`

#### GET `/api/experiences`

Returns all experiences (same order as stored).

- **Response:** `200 OK`
- **Body:** Array of [Experience](#11-experience) objects.

```json
[
  {
    "id": "1",
    "title": "Frontend Web Developer",
    "company": "E.K. Solutions Pvt. Ltd",
    "period": "Aug 2021 - Aug 2025",
    "description": "...",
    "side": "right"
  }
]
```

- **Errors:** On read failure the handler returns `200` with an empty array `[]`; no error body is returned for GET.

---

#### POST `/api/experiences`

Creates one experience. `id` and default `side` are set by the server.

- **Request:** `Content-Type: application/json`
- **Body:** Object with [Experience](#11-experience) fields **except** `id` (all optional at send; empty string/array used if omitted).

| Field         | Type                  | Notes                                 |
| ------------- | --------------------- | ------------------------------------- |
| `title`       | string                |                                       |
| `company`     | string                |                                       |
| `period`      | string                |                                       |
| `description` | string                |                                       |
| `side`        | `"left"` \| `"right"` | Optional; alternates if not provided. |

- **Response:** `201 Created`
- **Body:** Created [Experience](#11-experience) object (includes `id`).

- **Errors:**
  - `500` — `{ "error": "Failed to create experience" }`

---

#### PUT `/api/experiences`

Updates one experience. Body must include `id`.

- **Request:** `Content-Type: application/json`
- **Body:** [Experience](#11-experience) object (must include `id`). Other fields are merged into the existing item.

- **Response:** `200 OK`
- **Body:** Updated [Experience](#11-experience) object.

- **Errors:**
  - `404` — `{ "error": "Experience not found" }`
  - `500` — `{ "error": "Failed to update experience" }`

---

#### DELETE `/api/experiences?id=<id>`

Deletes one experience by `id`.

- **Query:** `id` (required) — experience id.
- **Response:** `200 OK`
- **Body:** `{ "success": true }`

- **Errors:**
  - `400` — `{ "error": "ID is required" }`
  - `404` — `{ "error": "Experience not found" }`
  - `500` — `{ "error": "Failed to delete experience" }`

---

### 3.2 Projects

**Base path:** `/api/projects`

#### GET `/api/projects`

Returns all projects.

- **Response:** `200 OK`
- **Body:** Array of [Project](#12-project) objects.

- **Errors:** On read failure the handler returns `200` with an empty array `[]`; no error body is returned for GET.

---

#### POST `/api/projects`

Creates one project. `id` is server-generated.

- **Request:** `Content-Type: application/json`
- **Body:** Object with [Project](#12-project) fields **except** `id`. Omitted fields get defaults (e.g. `""`, `[]`, `"#"`).

| Field             | Type     | Notes          |
| ----------------- | -------- | -------------- |
| `title`           | string   |                |
| `description`     | string   |                |
| `fullDescription` | string   |                |
| `image`           | string   |                |
| `tags`            | string[] |                |
| `liveUrl`         | string   | Default `"#"`. |
| `githubUrl`       | string   | Default `"#"`. |
| `metrics`         | string[] |                |

- **Response:** `201 Created`
- **Body:** Created [Project](#12-project) object (includes `id`).

- **Errors:**
  - `500` — `{ "error": "Failed to create project" }`

---

#### PUT `/api/projects`

Updates one project. Body must include `id`.

- **Request:** `Content-Type: application/json`
- **Body:** [Project](#12-project) object (must include `id`). Other fields merged into existing item.

- **Response:** `200 OK`
- **Body:** Updated [Project](#12-project) object.

- **Errors:**
  - `404` — `{ "error": "Project not found" }`
  - `500` — `{ "error": "Failed to update project" }`

---

#### DELETE `/api/projects?id=<id>`

Deletes one project by `id`.

- **Query:** `id` (required).
- **Response:** `200 OK`
- **Body:** `{ "success": true }`

- **Errors:**
  - `400` — `{ "error": "ID is required" }`
  - `404` — `{ "error": "Project not found" }`
  - `500` — `{ "error": "Failed to delete project" }`

---

### 3.3 Resume

**Base path:** `/api/resume`

#### GET `/api/resume`

Returns the current resume path from [Settings](#13-settings-resume).

- **Response:** `200 OK`
- **Body:** Same shape as [Settings](#13-settings-resume):

```json
{
  "resumePath": "/resume/Resume.pdf"
}
```

If the settings file is missing, the API still returns `200` with default: `{ "resumePath": "/resume/Resume.pdf" }`.

---

#### POST `/api/resume`

Uploads a new PDF and updates `data/settings.json` with the new path.

- **Request:** `Content-Type: multipart/form-data`
- **Body:** Form field `file` — PDF file. Only `application/pdf` allowed.

- **Response:** `200 OK`
- **Body:**

```json
{
  "resumePath": "/resume/resume-<timestamp>.pdf",
  "success": true
}
```

- **Errors:**
  - `400` — `{ "error": "No file uploaded" }`
  - `400` — `{ "error": "Only PDF files are allowed" }`
  - `500` — `{ "error": "Failed to upload resume" }`

---

### 3.4 Upload (images)

**Base path:** `/api/upload`

#### POST `/api/upload`

Uploads an image for use (e.g. project images). Only POST is supported.

- **Request:** `Content-Type: multipart/form-data`
- **Body:** Form field `file` — image file. Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.

- **Response:** `200 OK`
- **Body:**

```json
{
  "path": "/uploads/project-<timestamp>.<ext>",
  "success": true
}
```

- **Errors:**
  - `400` — `{ "error": "No file uploaded" }`
  - `400` — `{ "error": "Only image files are allowed" }`
  - `500` — `{ "error": "Failed to upload file" }`

---

### 3.5 Contact (Contact Us)

Contact is handled in two ways: **form submission** (external) and **contact information display** (in-app, no API).

#### Contact form submission (external)

The “Send Me a Message” form in the Contact section is submitted to **Formspree** (third-party service), not to a portfolio API. The form sends:

- `name` — Sender’s name
- `email` — Sender’s email
- `subject` — Subject line
- `message` — Message body

Submission is done from the client via `@formspree/react` (`useForm("mreeazrr")`). There is no `POST /api/contact` in this project; responses and delivery are handled by Formspree.

#### Contact information (display)

The contact block (email, LinkedIn, resume link) uses the [Contact information (display)](#14-contact-information-display) shape. Data is provided by the frontend function `getContactInfo()` in `services/contact.service.ts` (static in code). The resume link can use the path returned by GET [ `/api/resume` ](#get-apiresume) if the app passes it into `getContactInfo({ resumePath })`.

- **In-app API:** None. There is no GET endpoint for contact info; it is not read from `data/settings.json` or any other API in this codebase.

---

### 3.6 Personal info (Settings)

Personal/site settings are stored in `data/settings.json`. The only settings currently used by the API are for the **resume** (see [1.3 Settings (Resume)](#13-settings-resume)).

**Exposed API:** All personal-info–related endpoints are under **Resume** ([§ 3.3](#33-resume)):

| Purpose              | Method | Endpoint      | Description                                     |
| -------------------- | ------ | ------------- | ----------------------------------------------- |
| Get resume path      | GET    | `/api/resume` | Returns current `resumePath` from settings.     |
| Update resume (file) | POST   | `/api/resume` | Upload PDF and update `resumePath` in settings. |

**Settings file shape:** `data/settings.json` is a single object. Currently it only includes:

| Field        | Type   | Description                    |
| ------------ | ------ | ------------------------------ |
| `resumePath` | string | Public URL path to resume PDF. |

Example: `{ "resumePath": "/resume/Resume.pdf" }`.

Contact display data (email, LinkedIn) is **not** stored in settings or exposed by any API; it lives in `services/contact.service.ts`. To serve personal info (e.g. name, email, bio) from an API later, you could extend `data/settings.json` and add a GET endpoint (e.g. `GET /api/settings` or `GET /api/contact`) that returns that object.

---

### 3.7 About (About us)

The About section content (name, email, education, availability, bio paragraphs) is **not** served by any portfolio API. It is hardcoded in `components/about-section.tsx`. The only API used by the About section is GET [ `/api/resume` ](#get-apiresume), which provides the resume path (e.g. for a future “Download Resume” button).

- **In-app API:** None for about content. There is no `GET /api/about` or about-specific endpoint.
- **Data shape:** For reference or a future implementation, see [1.5 About (display)](#15-about-display). To add an API later, you could introduce `data/about.json` (or extend `data/settings.json`) and a `GET /api/about` that returns that structure.

---

## 4. Summary

| Endpoint           | Methods                | Success body shape                                                                          | Error body shape      |
| ------------------ | ---------------------- | ------------------------------------------------------------------------------------------- | --------------------- |
| `/api/experiences` | GET, POST, PUT, DELETE | Array (GET), single Experience (POST/PUT), `{ success: true }` (DELETE)                     | `{ "error": string }` |
| `/api/projects`    | GET, POST, PUT, DELETE | Array (GET), single Project (POST/PUT), `{ success: true }` (DELETE)                        | `{ "error": string }` |
| `/api/resume`      | GET, POST              | `{ resumePath }` (GET), `{ resumePath, success: true }` (POST)                              | `{ "error": string }` |
| `/api/upload`      | POST                   | `{ path, success: true }`                                                                   | `{ "error": string }` |
| Contact form       | —                      | Handled by Formspree (external); no `/api/contact`.                                         | —                     |
| Contact info       | —                      | Static in `getContactInfo()`; no GET endpoint.                                              | —                     |
| About us           | —                      | Static in `about-section.tsx`; no GET `/api/about`. Uses GET `/api/resume` for resume path. | —                     |

**Personal info:** Served only via `/api/resume` (GET/POST); see [§ 3.6](#36-personal-info-settings). Contact and About display data are not in the API; see [§ 3.5](#35-contact-contact-us) and [§ 3.7](#37-about-about-us).

All error responses use the same structure: a single key `error` with a string message. The HTTP status code indicates 400, 404, or 500 as described above.
