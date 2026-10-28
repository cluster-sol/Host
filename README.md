# 🏢 Cluster AI & Tech Solutions (`cluster-sol`)
**Enterprise IT & AI Engineering Agency Platform**

> A production-ready, ultra-professional 3-in-1 agency web platform built with **Jekyll**, **Cloudflare Pages & Functions (Edge / D1 / KV)**, and **Google Sheets Apps Script (Zero-Login Intake)**.

---

## ⚡ What Makes This Platform Unique
Unlike generic AI-generated dark templates, this website is an **authoritative enterprise asset**:
1. **The Public Conversion Engine:**
   - **Hero AI Architect Terminal:** Visitors type any business idea (e.g. *"Telehealth with AI notes"*) and receive instant tech stack recommendations, sprint scopes, and pricing estimates.
   - **Interactive Architecture Visualizer:** Switch between Web & SaaS, Mobile Apps, Custom RAG AI, and self-hosted n8n workflows with animated SVG pipelines.
   - **Interactive Project Cost & ROI Calculator:** Dynamic sliders for project complexity, add-on features (RBAC, payments, RAG), sprint delivery speed, and currency toggle (**₹ INR** vs. **$ USD**).
   - **5 Detailed Service Pages:** Web & Enterprise SaaS, Native Mobile Apps, Custom AI & RAG Agents, End-to-End Workflow Automation, and Cloud DevOps & 24/7 AMC Retainer.
   - **Verified Case Studies:** Bento grid breaking down Problem $\rightarrow$ Solution Architecture $\rightarrow$ Business ROI.
2. **Zero-Login Contact Ingestion via Google Apps Script:**
   - Visitors submit project inquiries **without needing any account or login**.
   - Submissions are captured via `functions/api/contact.js` (backed up to **Cloudflare D1**) and synchronized directly into **Google Sheets** via `google-apps-script.js`.
   - Sends instant formatted HTML alert emails to the founders with 1-click WhatsApp and Email reply buttons!
3. **Standalone Blog CMS Studio (`cms.clustersol.agency`):**
   - Separate Cloudflare Pages app in `../cluster-sol-cms` — not bundled with the public site.
   - GitHub OAuth sign-in, Markdown editor with sanitized live preview, drafts, publishing, unpublishing, and permanent deletion.
   - Commits articles to a **private content repository** and triggers this site's build workflow automatically.
   - Image uploads, article search/filtering, deployment status, and a built-in setup guide.
   - The public site no longer ships an editor; the footer links to `cms.clustersol.agency`.
4. **Official Stamped GST & LUT Tax Invoice Studio (`/invoice/`):**
   - Pure XML/SVG Vector Company Logo & Official Circular Rubber Stamp/Seal.
   - Switches between **Domestic GST (9% CGST + 9% SGST / 18% IGST)** and **International Zero-Rated Export under LUT (0% IGST)**.
   - Complete with HSN/SAC codes (`998314`), banking details, and 1-click print-to-PDF formatting (`@media print`).
5. **Mandatory Payment Gateway Legal Compliance:**
   - Pre-configured `/legal/privacy-policy/` (GDPR & DPDP Act 2023).
   - `/legal/terms-of-service/` (IP transfer & MSA).
   - `/legal/refund-cancellation/` (Required for Razorpay & Stripe KYC approvals).
   - `/legal/ai-ethics-disclaimer/` (LLM liability protections).

---

## 📂 Project Structure

```text
cluster-sol/
├── _config.yml               # Central single-source-of-truth metadata & config
├── Gemfile                   # Ruby gems configuration
├── wrangler.toml             # Cloudflare Pages + optional D1/KV bindings
├── _headers                  # Strict security headers (CSP, HSTS, X-Frame-Options)
├── _redirects                # Edge redirects
├── schema.sql                # Production D1 / SQLite database schema (Leads, Projects, Invoices)
├── google-apps-script.js     # Production Google Apps Script webhook for Google Sheets sync
├── _layouts/
│   ├── default.html          # Base site layout with SEO head, header, footer
│   ├── page.html             # Standard page layout with hero banner
│   ├── post.html             # Blog post layout with author bio, tags & sharing
│   └── service.html          # In-depth service layout with tech stack & milestones
├── _includes/
│   ├── header.html           # Sticky navigation with mobile drawer
│   ├── footer.html           # Mega footer with legal, tax IDs, and social links
│   ├── hero.html             # High-converting split-screen hero
│   ├── ai-architect.html     # Interactive AI Terminal scoping widget
│   ├── workflow-canvas.html  # Interactive animated node visualizer
│   ├── cost-calculator.html  # Dynamic project price & ROI calculator
│   ├── services-grid.html    # 5 Service cards grid
│   ├── case-studies-bento.html # Bento grid with verified ROI metrics
│   ├── sprint-timeline.html  # 4-Step agile execution process
│   ├── cta-banner.html       # High-impact booking call-to-action
│   └── seo-head.html         # OpenGraph, Twitter, canonical & schema tags
├── _posts/                   # Fallback posts (rebuilt from cluster-sol/blogs at deploy)
│   ├── 2026-10-01-welcome-to-cluster-ai-solutions.md
│   ├── 2026-10-12-how-we-built-autonomous-rag-agents-reduced-churn-60.md
│   ├── 2026-10-20-cloud-native-microservices-nextjs15-cloudflare-edge.md
│   └── 2026-10-25-enterprise-ai-automation-n8n-vs-custom-python.md
├── _data/
│   ├── navigation.yml        # Navigation links & CTAs
│   ├── services.yml          # Detailed service catalog, SAC codes & price tiers
│   ├── case_studies.yml      # Flagship architectures & client results
│   └── pricing.yml           # Sprint packages & 40/30/30 milestones
├── assets/
│   ├── css/
│   │   └── main.css          # Refined enterprise CSS, typography, components
│   ├── js/
│   │   ├── main.js           # Scroll spy, mobile drawer, toast notifications
│   │   ├── ai-architect.js   # Interactive terminal scoping engine
│   │   ├── cost-calculator.js # Real-time slider & currency switcher (INR/USD)
│   │   └── contact.js        # Multi-mode form submit (D1 + Google Sheets)
│   └── brand/
│       ├── company_logo.svg  # Pure XML vector Neural-Hexagon logo
│       ├── company_logo_light.svg # Light logo for dark backgrounds
│       ├── company_stamp.svg # Pure XML Official Circular Rubber Seal/Stamp
│       └── favicon.svg       # Vector browser favicon
├── functions/                # Cloudflare Pages Functions (Edge API)
│   └── api/
│       ├── contact.js        # Form handler (D1 backup + Google Sheets forwarder)
│       ├── estimate.js       # Dynamic quote & ROI calculator endpoint
│       ├── newsletter.js     # Newsletter subscriber handler
│       └── search.js         # Edge full-text search API
├── index.html                # High-converting Homepage
├── services/                 # Service pages
│   ├── index.html
│   ├── web-saas.html
│   ├── mobile-apps.html
│   ├── ai-rag-agents.html
│   ├── workflow-automation.html
│   └── cloud-devops-amc.html
├── work/index.html           # Case studies & proof
├── estimator/index.html      # Dedicated Project Cost & ROI Calculator
├── pricing/index.html        # Transparent Sprint Packages & Retainers
├── about/index.html          # About Us & Engineering Standards
├── blog/index.html           # Blog & Announcements Hub
├── cms/index.html            # Startup Blog CMS Editor
├── portal/index.html         # Client Milestone Portal & Telemetry
├── invoice/index.html        # Official Stamped Tax Invoice Studio
├── contact/index.html        # Contact & Discovery Intake Form
├── legal/                    # Mandatory Compliance Pages
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   ├── refund-cancellation.html
│   └── ai-ethics-disclaimer.html
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

---

## 🚀 Running Locally

1. **Build and serve using Bundler:**
   ```bash
   bundle exec jekyll serve
   ```
2. Open your browser at:
   ```
   http://localhost:4000
   ```

---

## 📊 How to Deploy Google Sheets Apps Script (Zero-Login Ingestion)

1. Open Google Sheets ([sheets.new](https://sheets.new)) and title it: `Cluster Sol - Client Inbound Leads`.
2. In the top menu, go to **Extensions** $\rightarrow$ **Apps Script**.
3. Open `google-apps-script.js` from this repository, copy its contents, and replace all code in the script editor.
4. Set your notification email on line 25:
   ```javascript
   const NOTIFY_EMAIL = "hello@clustersol.agency";
   ```
5. Click **Deploy** (top right blue button) $\rightarrow$ **New deployment**.
6. Select type: **Web app**:
   - **Execute as:** `Me (your-email@gmail.com)` *(Crucial)*
   - **Who has access:** `Anyone` *(Enables zero login submission from website visitors)*
7. Click **Deploy**, authorize permissions, and copy the **Web App URL** (ends in `/exec`).
8. Paste that URL into:
   - `wrangler.toml` $\rightarrow$ `GOOGLE_APPS_SCRIPT_URL`
   - `assets/js/contact.js` $\rightarrow$ `GOOGLE_APPS_SCRIPT_FALLBACK_URL`

Every inquiry submitted on `/contact/` will now instantly create a formatted row in your Google Sheet and send you an instant email alert with 1-click WhatsApp and Email reply buttons!

---

## ☁️ Deploying to Cloudflare Pages

Deployment is handled by `.github/workflows/deploy.yml`, which builds Jekyll,
merges the private blog repository, and uploads the result with Wrangler.

1. Push this repository to GitHub.
2. In the **Cloudflare Dashboard**, create a Pages project named `cluster-sol`
   (Direct Upload). The workflow deploys to it with `wrangler pages deploy`.
3. Add repository secrets:
   - `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages: Edit** permission.
   - `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.
   - `BLOG_REPO_TOKEN` — fine-grained GitHub token with **Contents: Read** on the
     private blog repository.
4. Add repository variables (optional; defaults shown):
   - `BLOG_REPOSITORY` = `cluster-sol/blogs`
   - `BLOG_REPO_BRANCH` = `main`
5. Run **Actions → Build and Deploy Website → Run workflow**. Every push to
   `main` and every `new-article-post` dispatch from the CMS redeploys the site.

### Optional D1 / KV persistence

The only Pages Function is `/api/contact`. It runs without a database and simply
skips persistence when no binding exists. To store leads:

```bash
npx wrangler d1 create cluster_sol_prod
npx wrangler d1 execute cluster_sol_prod --remote --file=./schema.sql
```

Then bind the database as `DB` (and a KV namespace as `CACHE_KV` if desired) in
**Cloudflare Pages → cluster-sol → Settings → Functions**, or uncomment the
matching blocks in `wrangler.toml` and insert the real resource IDs. Do not
commit placeholder IDs — Wrangler rejects them during deployment.

---

## 📝 Managing the Blog with the Content Studio

The blog is managed at **https://cms.clustersol.agency** (source:
`../cluster-sol-cms`).

1. Sign in with a GitHub account that can write to the private content repo.
2. Create an article, fill in the metadata, and write in Markdown with live preview.
3. **Save draft** commits `published: false`; **Publish** commits `published: true`.
4. Publishing, unpublishing, or deleting a published article automatically
   dispatches a `new-article-post` event. This repo's workflow checks out the
   private repo, merges `blogposts/` and `announcements/` into `_posts`, builds
   Jekyll, and deploys to Cloudflare Pages.
5. Deleting an article in the CMS removes the file, so the next build removes it
   from the live site.

See `../cluster-sol-cms/README.md` and `../cluster-sol-cms/SETUP.md` for setup,
architecture, and troubleshooting.
