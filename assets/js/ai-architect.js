/**
 * ==============================================================================
 * CLUSTER AI & TECH SOLUTIONS — HERO AI ARCHITECT INTERACTIVE TERMINAL
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalForm = document.getElementById('ai-architect-form');
  const architectInput = document.getElementById('architect-input');
  const architectOutput = document.getElementById('architect-output');
  const chips = document.querySelectorAll('.terminal-chip');

  if (!terminalForm || !architectInput || !architectOutput) return;

  const PRESETS = {
    telehealth: {
      prompt: "Telemedicine platform with automated AI doctor note transcription and prescription delivery.",
      title: "Telehealth AI Copilot & Patient Portal",
      timeline: "4 Weeks",
      concurrency: "10,000 active sessions",
      stack: ["Next.js 15 Edge", "Supabase HIPAA DB", "Whisper AI Transcription", "Twilio SMS/WhatsApp"],
      priceINR: "₹1,80,000",
      priceUSD: "$2,400",
      hoursSaved: "95 hrs/mo"
    },
    fintech: {
      prompt: "Cross-border B2B invoice collection with automated LUT FIRA generation and GST filing.",
      title: "Fintech Settlement & Auto-FIRA Gateway",
      timeline: "3 Weeks",
      concurrency: "Sub-50ms Payment Webhooks",
      stack: ["Cloudflare Pages & Workers", "D1 SQLite Edge", "Stripe + Razorpay", "Self-hosted n8n"],
      priceINR: "₹1,40,000",
      priceUSD: "$1,900",
      hoursSaved: "120 hrs/mo"
    },
    rag: {
      prompt: "Internal legal contracts search engine trained on 5,000+ PDFs with zero hallucination.",
      title: "Enterprise Multi-Document Vector RAG",
      timeline: "3 Weeks",
      concurrency: "Hybrid Semantic + BM25",
      stack: ["Claude 3.5 Sonnet", "Pinecone Vector DB", "FastAPI Python", "Strict Guardrails"],
      priceINR: "₹1,50,000",
      priceUSD: "$2,100",
      hoursSaved: "85 hrs/mo"
    },
    mobile: {
      prompt: "Field technician mobile app with offline SQLite sync, signature capture, and auto PDF invoice.",
      title: "Offline-First Mobile Inspection App",
      timeline: "5 Weeks",
      concurrency: "Zero-Data Loss SQLite Sync",
      stack: ["Flutter 3.x", "WatermelonDB / SQLite", "Firebase FCM", "Node.js Microservices"],
      priceINR: "₹2,20,000",
      priceUSD: "$3,100",
      hoursSaved: "140 hrs/mo"
    }
  };

  // Handle preset chip clicks
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const presetKey = chip.getAttribute('data-preset');
      const data = PRESETS[presetKey];
      if (data) {
        architectInput.value = data.prompt;
        renderArchitectureOutput(data);
      }
    });
  });

  // Handle custom submission
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = architectInput.value.trim();
    if (!query) return;

    // Show simulated streaming state
    architectOutput.innerHTML = `
      <div class="terminal-output-loading">
        <i class="fas fa-spinner fa-spin text-blue-400"></i>
        <span>Synthesizing system architecture and calculating sprint scope...</span>
      </div>
    `;

    setTimeout(() => {
      // Analyze query keywords for intelligent dynamic response
      const isMobile = /app|mobile|android|ios|flutter/i.test(query);
      const isAI = /ai|agent|rag|llm|bot|chat|whisper/i.test(query);
      const isAutomation = /n8n|automate|pipeline|crm|invoice|sync/i.test(query);

      let customResult = {
        title: "Custom Scalable System Architecture",
        timeline: isMobile ? "5 Weeks" : (isAI ? "4 Weeks" : "3 Weeks"),
        concurrency: "High-Availability Edge Mesh",
        stack: isMobile 
          ? ["Flutter / React Native", "Offline SQLite Cache", "FastAPI Edge", "Firebase FCM"]
          : (isAI 
            ? ["Claude 3.5 Sonnet", "pgvector / Pinecone", "FastAPI Python", "Next.js 15"]
            : ["Next.js 15 App Router", "Supabase PostgreSQL", "Cloudflare Workers", "Stripe/Razorpay"]),
        priceINR: isMobile ? "₹2,10,000" : (isAI ? "₹1,60,000" : "₹1,20,000"),
        priceUSD: isMobile ? "$2,900" : (isAI ? "$2,200" : "$1,700"),
        hoursSaved: "80+ hrs/mo"
      };

      renderArchitectureOutput(customResult);
    }, 600);
  });

  function renderArchitectureOutput(data) {
    const stackBadges = data.stack.map(s => `<span style="color: #38BDF8; background: rgba(56, 189, 248, 0.1); padding: 2px 8px; border-radius: 4px; margin-right: 6px;">${s}</span>`).join(' → ');

    architectOutput.innerHTML = `
      <div id="architect-stream-content">
        <div style="color: #60A5FA; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span><i class="fas fa-check-circle text-emerald-400 mr-1"></i> ${data.title}</span>
          <span class="badge badge-emerald" style="font-size: 0.65rem;">Verified Feasibility</span>
        </div>
        <div style="color: #94A3B8; font-size: 0.8rem; margin-bottom: 0.75rem;">
          Estimated Sprint: <strong>${data.timeline}</strong> | SLA: <strong>${data.concurrency}</strong> | Saves: <strong style="color: #34D399;">${data.hoursSaved}</strong>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 0.75rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: #CBD5E1; margin-bottom: 0.85rem; line-height: 1.6;">
          ${stackBadges}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.6rem; border-top: 1px solid rgba(255, 255, 255, 0.1); flex-wrap: wrap; gap: 0.5rem;">
          <span style="color: #A5B4FC; font-size: 0.825rem;">
            Sprint Estimate: <strong>${data.priceINR} (${data.priceUSD})</strong>
          </span>
          <a href="/contact/?query=${encodeURIComponent(data.title)}" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 5px 12px;">
            Book Architecture Audit <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }
});
