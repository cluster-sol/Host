-- ==============================================================================
-- CLUSTER AI & TECH SOLUTIONS — PRODUCTION DATABASE SCHEMA (Cloudflare D1 / SQLite)
-- ==============================================================================

-- 1. LEADS & INBOUND CONTACT INQUIRIES
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_code TEXT UNIQUE NOT NULL,                 -- e.g. 'LD-2026-0001'
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_whatsapp TEXT,
    company_name TEXT,
    service_required TEXT NOT NULL,                -- 'web-saas', 'mobile-apps', 'ai-rag', 'automation', 'devops'
    estimated_budget TEXT,                         -- e.g. '₹1,50,000 - ₹3,00,000' or '$2,500 - $5,000'
    timeline TEXT,                                 -- 'Urgent (2-3 weeks)', '1-2 months', etc.
    message TEXT NOT NULL,
    source_url TEXT,
    ip_country TEXT,
    user_agent TEXT,
    google_sheets_synced INTEGER DEFAULT 0,        -- 1 if pushed to Google Sheets
    status TEXT DEFAULT 'NEW',                     -- 'NEW', 'QUALIFIED', 'PROPOSAL_SENT', 'CLOSED', 'ARCHIVED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- 2. CLIENT MASTER
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_code TEXT UNIQUE NOT NULL,              -- e.g. 'CL-2026-001'
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_whatsapp TEXT,
    billing_address TEXT,
    country TEXT DEFAULT 'India',
    gstin_or_tax_id TEXT,
    currency TEXT DEFAULT 'INR',                   -- 'INR', 'USD', 'EUR', 'AED'
    status TEXT DEFAULT 'ACTIVE',                  -- 'LEAD', 'ACTIVE', 'RETAINER', 'CHURNED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROJECTS & SPRINT STAGES
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_code TEXT UNIQUE NOT NULL,             -- e.g. 'PRJ-2026-001'
    client_id INTEGER REFERENCES clients(id),
    title TEXT NOT NULL,
    service_category TEXT NOT NULL,                -- 'WEB', 'APP', 'AI_RAG', 'AUTOMATION'
    tech_stack TEXT,                               -- 'Next.js 15, Supabase, Cloudflare, n8n'
    contract_value REAL NOT NULL,
    current_sprint TEXT DEFAULT 'Sprint 1',
    progress_percentage INTEGER DEFAULT 25,
    staging_url TEXT,
    figma_url TEXT,
    github_repo_url TEXT,
    stage TEXT DEFAULT 'ONBOARDING',               -- 'DISCOVERY', 'DESIGN', 'CORE_DEV', 'UAT', 'LIVE'
    target_delivery_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. INVOICES & MILESTONES (GST & LUT Export)
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,           -- e.g. 'INV-2026-0012'
    client_id INTEGER REFERENCES clients(id),
    project_id INTEGER REFERENCES projects(id),
    milestone_name TEXT NOT NULL,                  -- '40% Kickoff Advance', '30% UAT Delivery', etc.
    sac_code TEXT DEFAULT '998314',
    subtotal REAL NOT NULL,
    tax_rate REAL DEFAULT 18.0,                    -- 18% IGST or 0% for LUT Export
    tax_amount REAL NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    is_lut_export INTEGER DEFAULT 0,               -- 1 if international export under LUT
    payment_status TEXT DEFAULT 'UNPAID',          -- 'UNPAID', 'PAID', 'OVERDUE'
    payment_link TEXT,
    issue_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    paid_at DATETIME
);

-- 5. AI TELEMETRY & WORKFLOW METRICS (For Monthly Retainers)
CREATE TABLE IF NOT EXISTS automation_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    workflow_name TEXT NOT NULL,
    executions_count INTEGER DEFAULT 0,
    tokens_consumed INTEGER DEFAULT 0,
    estimated_hours_saved REAL DEFAULT 0.0,
    recorded_month TEXT NOT NULL,                  -- e.g. '2026-10-01'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. NEWSLETTER & SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'website_footer',
    status TEXT DEFAULT 'ACTIVE',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
