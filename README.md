# Datafyle — AI Document Processing SaaS

> Upload any document → AI extracts all data → Download Excel in 10 seconds.
> Built for accounting and bookkeeping firms in the UK, US, and Australia.

**Live:** [datafyle.com](https://datafyle.com)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Authentication](#authentication)
- [AI & Document Processing](#ai--document-processing)
- [Background Jobs (Inngest)](#background-jobs-inngest)
- [Payments (Paddle)](#payments-paddle)
- [File Storage (Cloudflare R2)](#file-storage-cloudflare-r2)
- [Email (Resend)](#email-resend)
- [Internationalization](#internationalization)
- [Plans & Feature Gating](#plans--feature-gating)
- [API Routes](#api-routes)
- [Pages & Routes](#pages--routes)
- [Deployment](#deployment)

---

## Overview

Datafyle is a B2B SaaS that eliminates manual invoice data entry for accounting firms. Users upload any document (PDF, Word, Excel, image, CSV, XML) and the AI extracts every field — vendor, amount, date, line items, tax — and exports it to a formatted 3-sheet Excel workbook or Google Sheets in seconds.

**Core workflow:**
```
Upload file → Parse text/OCR → Claude AI extracts data → Anomaly check → Save to DB → Export Excel
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | lucide-react |
| Animations | Framer Motion |
| Charts | Recharts |
| Auth | Clerk |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| File Storage | Cloudflare R2 |
| AI Model | Claude Haiku (claude-haiku-4-5-20251001) |
| OCR | Google Vision API |
| Background Jobs | Inngest |
| Payments | Paddle |
| Email | Resend |
| PDF Export | @react-pdf/renderer |
| Excel Export | ExcelJS |
| Hosting | Vercel |

---

## Project Structure

```
datafyle/
├── app/
│   ├── (clerk)/                  # Auth-protected routes
│   │   ├── admin/                # Admin dashboard (ADMIN_EMAIL only)
│   │   ├── dashboard/            # Main user dashboard
│   │   ├── settings/             # User settings
│   │   └── team/accept/          # Team invite acceptance
│   ├── api/
│   │   ├── upload/               # Single & batch file upload
│   │   ├── process/              # Single document AI processing
│   │   ├── batch-process/        # Batch processing via Inngest
│   │   ├── export/               # Excel & Google Sheets export
│   │   ├── reports/monthly/      # Monthly PDF report
│   │   ├── team/                 # Team management
│   │   ├── vendors/              # Vendor intelligence
│   │   ├── payments/             # Paddle checkout & portal
│   │   ├── support/              # Email support tickets
│   │   ├── webhooks/             # Clerk & Paddle webhooks
│   │   ├── admin/                # Admin-only endpoints
│   │   ├── blog/                 # Blog API
│   │   ├── contact/              # Contact form
│   │   └── inngest/              # Inngest serve handler
│   ├── blog/                     # Public blog pages
│   ├── contact/                  # Contact page
│   ├── pricing/                  # Pricing page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── refund/                   # Refund policy
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
├── inngest/
│   ├── client.ts                 # Inngest client
│   └── functions.ts              # Background job functions
├── lib/
│   ├── i18n/                     # Translations (8 languages)
│   ├── emails/                   # Email templates
│   ├── pdf/                      # PDF report template
│   ├── anomaly.ts                # Anomaly detection logic
│   ├── claude.ts                 # Claude AI integration
│   ├── memory.ts                 # Smart Memory (vendor patterns)
│   ├── parsers.ts                # File parsing (PDF, DOCX, XLSX, etc.)
│   ├── plans.ts                  # Plan features & limits
│   ├── prisma.ts                 # Prisma client singleton
│   ├── processDocument.ts        # Core document processing pipeline
│   └── r2.ts                    # Cloudflare R2 file storage
├── prisma/
│   └── schema.prisma             # Database schema
└── public/                       # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Accounts for: Clerk, Cloudflare R2, Anthropic, Google Cloud, Inngest, Paddle, Resend

### Installation

```bash
# Clone the repository
git clone https://github.com/usmanz-dev/datafyle.git
cd datafyle

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ── Authentication (Clerk) ────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# ── Database (Supabase PostgreSQL) ───────────────────────────────────────────
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# ── AI (Anthropic) ───────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# ── OCR (Google Vision) ──────────────────────────────────────────────────────
GOOGLE_VISION_API_KEY=xxxxxxxxxxxx
GOOGLE_CLOUD_PROJECT_ID=xxxxxxxxxxxx

# ── Google Sheets Export ─────────────────────────────────────────────────────
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# ── File Storage (Cloudflare R2) ─────────────────────────────────────────────
CLOUDFLARE_R2_ACCESS_KEY=xxxxxxxxxxxx
CLOUDFLARE_R2_SECRET_KEY=xxxxxxxxxxxx
CLOUDFLARE_R2_BUCKET=datafyle-uploads
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://[your-r2-public-url]

# ── Email (Resend) ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@datafyle.com

# ── Background Jobs (Inngest) ─────────────────────────────────────────────────
INNGEST_EVENT_KEY=evt_xxxxxxxxxxxx
INNGEST_SIGNING_KEY=signkey_xxxxxxxxxxxx

# ── Payments (Paddle) ────────────────────────────────────────────────────────
PADDLE_API_KEY=xxxxxxxxxxxx
PADDLE_WEBHOOK_SECRET=xxxxxxxxxxxx
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxxxxxxxxx

# ── Admin ────────────────────────────────────────────────────────────────────
ADMIN_EMAIL=your@email.com
```

> **Never commit `.env.local` to version control.**

---

## Database

**Provider:** Supabase PostgreSQL via Prisma ORM

### Models

| Model | Purpose |
|---|---|
| `User` | Clerk user sync, plan, usage tracking |
| `Document` | Uploaded files, extracted data, anomaly data |
| `VendorPattern` | Smart Memory — vendor averages for anomaly detection |
| `Subscription` | Paddle subscription details |
| `Team` | Team workspace |
| `TeamMember` | Team membership with roles and invite status |
| `BlogPost` | Blog content managed via admin dashboard |
| `UserToken` | OAuth tokens (Google) |

### Common Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Create a migration
npx prisma migrate dev --name your_migration_name
```

---

## Authentication

**Provider:** Clerk

- Sign in / Sign up at `/sign-in` and `/sign-up`
- On new user signup, Clerk fires a webhook to `/api/webhooks/clerk`
- Webhook creates the user in Prisma DB with default `free` plan
- Webhook signature is verified using `svix` before processing
- Admin access is gated by `user.email === process.env.ADMIN_EMAIL`

---

## AI & Document Processing

**Model:** `claude-haiku-4-5-20251001` — always use Haiku, never Sonnet or Opus.

### Processing Pipeline

```
1. Download file from Cloudflare R2
2. Parse file → extract text
   - PDF    → pdf-parse
   - DOCX   → mammoth
   - XLSX   → SheetJS
   - CSV    → papaparse
   - XML    → xml2js
   - TXT    → Buffer.toString('utf-8')
   - Images → Google Vision API (OCR)
3. Fetch vendor pattern (Smart Memory — Pro+ plans only)
4. Send text to Claude → receive structured JSON
5. Run anomaly detection
6. Save extracted data + anomaly data to DB
7. Update vendor pattern (Smart Memory)
8. Send anomaly alert email if severity is HIGH or CRITICAL
```

### Claude Output Format

```json
{
  "documentType": "invoice | receipt | contract | form | statement | other",
  "vendor": { "value": "string", "confidence": 95 },
  "invoiceNumber": { "value": "string", "confidence": 90 },
  "date": { "value": "string", "confidence": 88 },
  "dueDate": { "value": "string", "confidence": 85 },
  "totalAmount": { "value": 1500.00, "confidence": 98 },
  "currency": { "value": "GBP", "confidence": 99 },
  "taxAmount": { "value": 250.00, "confidence": 95 },
  "lineItems": [
    { "description": "Consulting", "quantity": 10, "unitPrice": 150, "total": 1500 }
  ],
  "keyFields": {},
  "summary": "Invoice from Acme Ltd for consulting services",
  "overallConfidence": 93
}
```

**Confidence scores:** 90+ = green, 70–89 = yellow, 0–69 = red

### Anomaly Detection

Located in `lib/anomaly.ts`. Checks for:

| Anomaly | Severity |
|---|---|
| Duplicate invoice number | CRITICAL |
| Amount > 5x vendor average | CRITICAL |
| Amount > 2x vendor average | HIGH |
| Future-dated invoice | LOW |

CRITICAL and HIGH anomalies trigger an email alert via Resend.

---

## Background Jobs (Inngest)

**Three functions** defined in `inngest/functions.ts`:

| Function ID | Trigger | Purpose |
|---|---|---|
| `process-single-document` | `doc/process` event | Processes one document with retries |
| `process-batch-documents` | `doc/batch` event | Fans out individual doc/process events |
| `monthly-docs-reset` | Cron: `0 0 1 * *` | Resets docsUsed to 0 for all users on 1st of each month |

### Inngest Setup

1. Create account at [inngest.com](https://inngest.com)
2. Add `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to environment variables
3. In Inngest dashboard → Apps → Sync App → URL: `https://datafyle.com/api/inngest`

---

## Payments (Paddle)

- Checkout flow via `/api/payments/checkout`
- Billing portal via `/api/payments/portal`
- Webhooks at `/api/webhooks/paddle` — signature verified with HMAC
- No free trials — immediate charge on plan selection
- Plan updates DB `user.plan` field on successful payment

### Plan Pricing

| Plan | Monthly | Annual | Docs/Month | Seats |
|---|---|---|---|---|
| Free | $0 | $0 | 10 | 1 |
| Starter | $49 | $39 | 500 | 2 |
| Professional | $149 | $119 | 3,000 | 5 |
| Business | $349 | $279 | 10,000 | 15 |
| Enterprise | $599 | $479 | 20,000 | 50 |

---

## File Storage (Cloudflare R2)

- Files uploaded to R2 via `lib/r2.ts`
- Key format: `{clerkUserId}/{timestamp}-{filename}`
- Signed URLs generated for download (expire after 1 hour)
- Max file size: 25MB
- Supported formats: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, XML, JPG, JPEG, PNG

---

## Email (Resend)

**From:** `noreply@datafyle.com`

Email templates in `lib/emails/`:

| Email | Trigger |
|---|---|
| Welcome (free) | New user signup |
| Welcome (paid) | First successful payment |
| Batch started | Batch processing queued |
| Anomaly alert | HIGH or CRITICAL anomaly detected |
| Team invitation | Team member invited |
| Subscription cancelled | Paddle cancellation webhook |

---

## Internationalization

Supports 8 languages via React Context (`lib/i18n/`):

| Code | Language |
|---|---|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `zh` | Chinese |
| `ja` | Japanese |
| `pt` | Portuguese |
| `it` | Italian |

Language persists in `localStorage`. All public pages (landing, pricing, blog, contact, privacy, terms, refund) are fully translated.

---

## Plans & Feature Gating

Defined in `lib/plans.ts`. Use `hasFeature(plan, feature)` to gate access.

| Feature | Free | Starter | Pro | Business | Enterprise |
|---|---|---|---|---|---|
| `excel_export` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `confidence_score` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `monthly_report` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `anomaly` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `teams` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `google_sheets` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `smart_memory` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `batch` | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## API Routes

### Document Processing
| Method | Route | Description |
|---|---|---|
| POST | `/api/upload` | Upload single file to R2 |
| POST | `/api/upload/batch` | Upload multiple files to R2 |
| POST | `/api/process` | Process single document with AI |
| POST | `/api/batch-process` | Queue batch for Inngest processing |

### Export
| Method | Route | Description |
|---|---|---|
| POST | `/api/export/excel` | Download 3-sheet Excel workbook |
| POST | `/api/export/sheets` | Export to Google Sheets (Pro+) |
| POST | `/api/reports/monthly` | Download monthly PDF report (Starter+) |

### Team
| Method | Route | Description |
|---|---|---|
| POST | `/api/team/invite` | Invite team member |
| DELETE | `/api/team/members/[id]` | Remove team member |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/checkout` | Generate Paddle checkout URL |
| POST | `/api/payments/portal` | Generate Paddle billing portal URL |

### Webhooks
| Method | Route | Description |
|---|---|---|
| POST | `/api/webhooks/clerk` | Clerk user sync (svix verified) |
| POST | `/api/webhooks/paddle` | Paddle payment events (HMAC verified) |

### Admin (ADMIN_EMAIL only)
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/export/users` | Export all users as CSV |
| POST | `/api/admin/blog` | Create blog post |
| PUT | `/api/admin/blog/[id]` | Update blog post |

---

## Pages & Routes

### Public
| Route | Description |
|---|---|
| `/` | Landing page |
| `/pricing` | Pricing & plan comparison |
| `/blog` | Blog index |
| `/blog/[slug]` | Single blog post |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/refund` | Refund policy |
| `/sign-in` | Clerk sign in |
| `/sign-up` | Clerk sign up |

### Protected (requires auth)
| Route | Description |
|---|---|
| `/dashboard` | Main dashboard — upload, process, export |
| `/dashboard/vendors` | Vendor intelligence — Smart Memory (Pro+) |
| `/dashboard/team` | Team management (Starter+) |
| `/dashboard/reports` | Monthly PDF reports (Starter+) |
| `/settings` | Account settings, plan management |

### Admin (ADMIN_EMAIL only)
| Route | Description |
|---|---|
| `/admin` | Overview — users, revenue, docs |
| `/admin/users` | User management + CSV export |
| `/admin/blog` | Blog post management |
| `/admin/blog/new` | Create new blog post |
| `/admin/blog/edit/[id]` | Edit existing blog post |

---

## Deployment

**Platform:** Vercel (auto-deploy on push to `main`)

```bash
# Type check before deploying
npx tsc --noEmit --skipLibCheck

# Build locally to catch errors
npm run build

# Push to deploy
git push origin main
```

### Post-deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Clerk webhook URL set to `https://datafyle.com/api/webhooks/clerk`
- [ ] Paddle webhook URL set to `https://datafyle.com/api/webhooks/paddle`
- [ ] Inngest app synced at `https://datafyle.com/api/inngest`
- [ ] Prisma DB schema is up to date (`npx prisma db push`)

---

## Security

- All API routes verify Clerk authentication before processing
- Admin routes verify `user.email === process.env.ADMIN_EMAIL`
- Clerk webhook signatures verified via `svix`
- Paddle webhook signatures verified via HMAC-SHA256
- Files validated by type whitelist + 25MB size limit
- All API inputs validated with Zod before processing
- API keys never exposed in client-side code
- `.env.local` is gitignored

---

*Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, Clerk, Paddle, Inngest, and Claude AI.*
