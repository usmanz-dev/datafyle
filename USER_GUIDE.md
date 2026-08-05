# Datafyle — User Guide

> **The complete guide to using Datafyle.** From uploading your first document to exporting a full batch of invoices to Excel.

---

## Table of Contents

1. [What is Datafyle?](#1-what-is-datafyle)
2. [Creating Your Account](#2-creating-your-account)
3. [Understanding Your Dashboard](#3-understanding-your-dashboard)
4. [Uploading Documents](#4-uploading-documents)
5. [Understanding Extracted Data](#5-understanding-extracted-data)
6. [Confidence Score](#6-confidence-score)
7. [Anomaly Detector](#7-anomaly-detector)
8. [Exporting to Excel](#8-exporting-to-excel)
9. [Exporting to Google Sheets](#9-exporting-to-google-sheets)
10. [Batch Upload](#10-batch-upload)
11. [Monthly PDF Report](#11-monthly-pdf-report)
12. [Smart Memory](#12-smart-memory)
13. [Team Management](#13-team-management)
14. [Plans & Limits](#14-plans--limits)
15. [Upgrading Your Plan](#15-upgrading-your-plan)
16. [Account Settings](#16-account-settings)
17. [Support](#17-support)
18. [FAQ](#18-faq)

---

## 1. What is Datafyle?

Datafyle is an AI-powered document processing tool built for accounting and bookkeeping firms. Instead of manually typing data from invoices, receipts, and financial documents into Excel, Datafyle does it automatically in seconds.

**How it works in 3 steps:**

1. **Upload** — Drop any invoice, receipt, or financial document
2. **AI Extracts** — Our AI reads every field automatically (vendor, amount, date, line items, tax, and more)
3. **Export** — Download a clean, formatted Excel file instantly

**Supported file types:** PDF, Word (DOCX, DOC), Excel (XLSX, XLS), CSV, XML, TXT, and images (JPG, PNG)

**Maximum file size:** 25MB per file

---

## 2. Creating Your Account

### Sign Up

1. Go to [datafyle.com](https://datafyle.com)
2. Click **Get Started Free**
3. Create your account with email or Google
4. You will be on the **Free plan** immediately — no credit card required

### Free Plan Includes

- 10 documents per month
- Excel export
- Confidence Score on every field
- 1 user seat

---

## 3. Understanding Your Dashboard

When you log in, your dashboard shows:

| Section | What it shows |
|---|---|
| **Usage bar** | How many documents you have used this month vs. your plan limit |
| **Stats cards** | Total documents this month, anomalies found, fields extracted |
| **Document list** | All your uploaded documents with status and quick actions |
| **Upload zone** | Drop files here to start processing |

### Document Status

Each document goes through these stages:

- **Pending** — File uploaded, waiting to be processed
- **Processing** — AI is reading and extracting data
- **Done** — Extraction complete, ready to export
- **Failed** — Something went wrong (see the document for details)

---

## 4. Uploading Documents

### Single Upload

1. From your dashboard, click the upload area or drag and drop a file
2. The file uploads and processing starts automatically
3. The status changes from **Pending → Processing → Done** in real time
4. Click the document row to view extracted data

### Supported Document Types

| Type | Extensions |
|---|---|
| PDF | `.pdf` |
| Word | `.docx`, `.doc` |
| Excel | `.xlsx`, `.xls` |
| Spreadsheet | `.csv` |
| Data | `.xml` |
| Text | `.txt` |
| Images | `.jpg`, `.jpeg`, `.png` |

> **Tip:** For scanned images or photo invoices, Datafyle uses Google Vision OCR to read the text before AI extraction. For best results, ensure the image is clear and not blurry.

---

## 5. Understanding Extracted Data

Once a document is processed, click on it to see all extracted fields:

| Field | Description |
|---|---|
| **Document Type** | Invoice, receipt, contract, form, statement, or other |
| **Vendor** | Supplier or company name |
| **Invoice Number** | Reference number from the document |
| **Date** | Invoice or document date |
| **Due Date** | Payment due date (if present) |
| **Total Amount** | Final amount payable |
| **Currency** | Currency code (GBP, USD, AUD, etc.) |
| **Tax Amount** | VAT or tax amount (if present) |
| **Line Items** | Individual items with description, quantity, unit price, and total |
| **Summary** | One-line AI summary of the document |

### Key Fields

For documents that contain non-standard fields (e.g., purchase order numbers, project codes, department references), they appear under **Key Fields** and are also included in your Excel export.

---

## 6. Confidence Score

Every extracted field has a **Confidence Score** — a percentage showing how certain the AI is about that value.

| Score | Colour | Meaning |
|---|---|---|
| **90% – 100%** | 🟢 Green | High confidence — field is reliable |
| **70% – 89%** | 🟡 Yellow | Medium confidence — verify before using |
| **0% – 69%** | 🔴 Red | Low confidence — check manually |

**Overall Confidence** is the average across all fields for that document.

> **Tip:** Low confidence often happens with handwritten documents, blurry scans, or non-standard invoice formats. If you see red fields, open the original document and verify those values.

---

## 7. Anomaly Detector

Available on **Starter plan and above.**

The Anomaly Detector automatically flags unusual invoices that may need your attention before payment.

### What it checks

| Anomaly | Severity | What it means |
|---|---|---|
| **Duplicate invoice number** | 🔴 Critical | Same invoice number already exists — possible duplicate payment |
| **Amount 5x above average** | 🔴 Critical | This vendor's invoice is unusually high |
| **Amount 2x above average** | 🟠 High | Amount is significantly higher than usual for this vendor |
| **Future-dated invoice** | 🟡 Low | Invoice date is in the future |

### What happens when an anomaly is found

- A coloured banner appears at the top of the document
- For **Critical** and **High** anomalies, you receive an automatic **email alert**
- The document appears in the **Anomalies sheet** of your Excel export

> **Important:** An anomaly does not mean an invoice is fraudulent — it means it needs a second look. Always verify with the vendor before taking action.

---

## 8. Exporting to Excel

Available on **all plans.**

Datafyle exports a professionally formatted Excel workbook with 3 sheets:

### Sheet 1 — Summary
One row per document with all key fields:
- File name, document type, vendor, invoice number, date, due date, total amount, currency, tax amount, confidence score, and any key fields found across all documents.

### Sheet 2 — Line Items
All line items from all documents in one sheet:
- Document name, vendor, line description, quantity, unit price, and line total.

### Sheet 3 — Anomalies
Only documents where an anomaly was detected:
- Document name, vendor, amount, anomaly type, severity, and recommendation.

### How to Export

**Export all documents:**
- Click **Export to Excel** button in the top right of your dashboard

**Export selected documents only:**
- Tick the checkboxes next to the documents you want
- Click **Export Selected**

The Excel file downloads automatically with today's date in the filename.

---

## 9. Exporting to Google Sheets

Available on **Professional plan and above.**

Export your extracted data directly to a new Google Sheet.

### How to Export to Google Sheets

1. Select the documents you want to export (or export all)
2. Click **Export to Google Sheets**
3. A new Google Sheet is created automatically
4. A link to your Google Sheet appears — click to open it

> **Note:** Each export creates a new Google Sheet. The sheet is shared with "anyone with the link can view."

---

## 10. Batch Upload

Available on **Professional plan and above.**

Upload and process multiple documents at once without waiting.

### How to Use Batch Upload

1. Switch to the **Batch Upload** tab on your dashboard
2. Drag and drop multiple files at once (up to 500 files)
3. Click **Upload & Process All**
4. Documents are queued and processed in the background via Inngest
5. You will receive an **email** when all documents are done
6. Return to your dashboard to export results

> **Tip:** You do not need to stay on the page while batch processing runs. Close the tab and come back — your documents will be ready.

### Batch Export

After batch processing completes:
1. Click **Export All** to download one Excel file with all documents
2. Or return to the main dashboard and export from there

---

## 11. Monthly PDF Report

Available on **Starter plan and above.**

Generate a professional PDF summary report of all your document activity for any time period.

### What the report includes

- Total documents processed
- Total amount across all invoices
- Number of anomalies detected
- Average confidence score
- Top 5 vendors by invoice count
- Breakdown by document type

### How to Generate

1. Go to **Dashboard → Reports**
2. Select a date range (this week, this month, last month, this year, or custom)
3. Click **Download PDF Report**
4. The report downloads as a PDF

---

## 12. Smart Memory

Available on **Professional plan and above.**

Smart Memory learns from your invoices over time to improve accuracy and anomaly detection.

### How it works

Every time you process a document, Datafyle remembers:
- Which vendors you work with
- Their typical invoice amounts
- How often they invoice you

This information is used to:
1. **Improve extraction accuracy** — Claude AI uses your vendor history as a hint
2. **Power the Anomaly Detector** — Compares new invoices against your historical averages

### Vendor Intelligence Page

Go to **Dashboard → Vendors** to see all your tracked vendors:
- Average invoice amount
- Total invoices processed
- Last invoice date

---

## 13. Team Management

Available on **Starter plan and above.**

Add team members so your whole firm can use Datafyle under one plan.

### Seat Limits by Plan

| Plan | Seats |
|---|---|
| Free | 1 |
| Starter | 2 |
| Professional | 5 |
| Business | 15 |
| Enterprise | 50 |

You can add extra seats on any paid plan for **$19/month per seat.**

### How to Invite Team Members

1. Go to **Dashboard → Team**
2. Enter the team member's email address
3. Click **Send Invite**
4. They receive an email with an invitation link
5. Once they accept, they are added to your team

### Team Permissions

| Role | What they can see |
|---|---|
| **Admin (you)** | All documents uploaded by all team members |
| **Member** | Only their own uploaded documents |

All team members share the same document limit from the plan owner's subscription.

### Removing a Team Member

1. Go to **Dashboard → Team**
2. Click the remove button next to the team member
3. They lose access immediately

---

## 14. Plans & Limits

| | Free | Starter | Professional | Business | Enterprise |
|---|---|---|---|---|---|
| **Price** | $0 | $49/mo | $149/mo | $349/mo | $599/mo |
| **Annual price** | $0 | $39/mo | $119/mo | $279/mo | $479/mo |
| **Documents/month** | 10 | 500 | 3,000 | 10,000 | 20,000 |
| **Team seats** | 1 | 2 | 5 | 15 | 50 |
| **Excel Export** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Confidence Score** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Anomaly Detector** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Monthly PDF Report** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Team Access** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Google Sheets Export** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Smart Memory (AI)** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Batch Upload** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Email Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ❌ | ✅ | ✅ |

### Document Limit Reset

Your document count resets automatically on the **1st of every month.** Unused documents do not carry over to the next month.

### What happens when you hit your limit

At **90%** usage — a warning appears on your dashboard.

At **100%** usage — new uploads are blocked until either:
- Your limit resets on the 1st of next month
- You upgrade to a higher plan

Your existing documents and all extracted data remain fully accessible — only new uploads are paused.

---

## 15. Upgrading Your Plan

### How to Upgrade

1. Go to **Settings** or click **Upgrade** on your dashboard
2. Select your new plan
3. Complete payment via Paddle (card or PayPal)
4. Your new plan activates **immediately**

### Downgrading

Downgrading takes effect at the end of your current billing period. You keep your current plan until then.

### Cancelling

1. Go to **Settings → Billing**
2. Click **Cancel Subscription**
3. Your plan stays active until the end of the billing period
4. After that, you move to the Free plan (10 docs/month)
5. All your existing documents and data remain accessible

> **No cancellation fees. No questions asked.**

### Annual Plans

Save 20% by switching to annual billing. Annual plans are charged once per year.

---

## 16. Account Settings

Go to **Settings** to manage:

- **Profile** — Update your name and email
- **Plan** — View your current plan and usage
- **Billing** — Manage your subscription, download invoices, cancel
- **Security** — Managed via your Clerk account (password, 2FA)

---

## 17. Support

### Contact Support

Use the **Support** button in your dashboard to send us a message.

Include:
- Your account email
- Description of the issue
- If relevant — the document name that caused the issue
- Any error message you saw

### Response Times

| Plan | Response Time |
|---|---|
| Free | Within 5 business days |
| Starter | Within 3 business days |
| Professional | Within 24 hours |
| Business | Within 4 hours |
| Enterprise | Within 1 hour |

### Email

You can also email us directly: **support@datafyle.com**

---

## 18. FAQ

**What file types does Datafyle support?**
PDF, Word (DOCX, DOC), Excel (XLSX, XLS), CSV, XML, TXT, JPG, and PNG. Maximum 25MB per file.

**How accurate is the AI extraction?**
For clear, standard invoices the accuracy is typically 95%+. For handwritten, blurry, or non-standard documents, accuracy may be lower. Always use the Confidence Score to identify fields that need manual review.

**Is my data secure?**
Yes. All documents are encrypted in transit (TLS 1.2+) and at rest (AES-256) on Cloudflare R2 enterprise storage. Your documents are never used to train AI models. Each customer's data is fully isolated.

**What happens to my documents if I cancel?**
All your documents and extracted data remain accessible until your plan expires. After moving to the Free plan, you keep access to previously processed documents. If you close your account entirely, data is permanently deleted within 30 days.

**Can I process handwritten invoices?**
Yes — Datafyle uses Google Vision OCR for images. Handwritten invoices work best when the handwriting is clear and the image is well-lit and in focus.

**Does Datafyle work with my accounting software?**
Currently Datafyle exports to Excel and Google Sheets. You can then import the Excel file into QuickBooks, Xero, Sage, or any other accounting software that accepts Excel imports.

**What is the difference between the Excel export and Google Sheets?**
Both contain the same data. Excel downloads a `.xlsx` file to your computer. Google Sheets creates a new spreadsheet in Google Drive that you can share with your team directly.

**Can my whole team use one account?**
Yes — add team members under **Dashboard → Team**. Each plan includes a set number of seats. All team members share the monthly document limit.

**What happens if a document fails to process?**
The document status shows **Failed**. This can happen if the file is corrupt, password-protected, or in an unsupported format. Try re-uploading, or contact support if the problem continues.

**Do unused documents roll over to next month?**
No — the document count resets on the 1st of each month. Unused documents do not carry over.

---

*For further assistance, contact us at **support@datafyle.com** or use the Support button in your dashboard.*
