/**
 * ==============================================================================
 * CLUSTER AI & TECH SOLUTIONS — ZERO-LOGIN CONTACT & GOOGLE SHEETS INGESTION
 * ==============================================================================
 */

// OPTIONAL: Fallback Direct Google Apps Script Webhook URL (from google-apps-script.js)
// If you deploy google-apps-script.js, paste your deployed /exec URL here:
const GOOGLE_APPS_SCRIPT_FALLBACK_URL = "https://script.google.com/macros/s/AKfycbx_DEMO_REPLACE_WITH_YOUR_DEPLOYED_ID/exec";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('project-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusContainer = document.getElementById('contact-status-message');

  if (!form) return;

  // 1. Auto Pre-fill fields from Query Params (e.g. from /estimator/ or /services/)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service') || urlParams.get('platform');
  const budgetParam = urlParams.get('budget');
  const queryParam = urlParams.get('query');

  if (serviceParam) {
    const serviceSelect = document.getElementById('form-service');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(serviceParam.toLowerCase()) || 
            serviceSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (budgetParam) {
    const budgetSelect = document.getElementById('form-budget');
    if (budgetSelect) {
      // Find matching or create option
      budgetSelect.value = budgetParam;
    }
  }

  if (queryParam) {
    const messageField = document.getElementById('form-message');
    if (messageField) {
      messageField.value = `Interested in scoping: ${queryParam}\n\nPlease prepare an architecture blueprint and sprint roadmap for our team.`;
    }
  }

  // 2. Form Submission Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i> Submitting Project Intake...`;

    const payload = {
      name: document.getElementById('form-name').value.trim(),
      email: document.getElementById('form-email').value.trim(),
      phone: document.getElementById('form-phone').value.trim(),
      company: document.getElementById('form-company').value.trim(),
      service: document.getElementById('form-service').value,
      budget: document.getElementById('form-budget').value,
      timeline: document.getElementById('form-timeline').value,
      message: document.getElementById('form-message').value.trim(),
      source_url: window.location.href,
      page: window.location.pathname,
      submitted_at: new Date().toISOString()
    };

    let isSuccess = false;
    let responseMessage = "Your inquiry has been received! Our engineering leadership will review your requirements and respond within 4 business hours.";

    try {
      // Step A: Attempt Cloudflare Pages Edge Function (/api/contact)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        isSuccess = true;
        if (data.message) responseMessage = data.message;
      } else {
        throw new Error("Cloudflare Edge returned non-200, attempting direct fallback.");
      }
    } catch (err) {
      console.warn("Edge API unavailable, trying direct Google Apps Script Webhook...", err);

      // Step B: Direct Zero-Login Google Apps Script Webhook Fallback
      if (GOOGLE_APPS_SCRIPT_FALLBACK_URL && !GOOGLE_APPS_SCRIPT_FALLBACK_URL.includes("DEMO_REPLACE")) {
        try {
          await fetch(GOOGLE_APPS_SCRIPT_FALLBACK_URL, {
            method: 'POST',
            mode: 'no-cors', // standard for Google Apps Script Webhook cross-origin
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          isSuccess = true;
        } catch (scriptErr) {
          console.error("Direct Google Apps Script submission error: ", scriptErr);
          isSuccess = false;
          responseMessage = "The request could not be delivered.";
        }
      } else {
        // No backend is configured (no Pages Function, no Apps Script URL).
        // Do not claim success — a lost inquiry is worse than an honest error.
        isSuccess = false;
        responseMessage = "The contact form is not connected to a mailbox right now. Please email hello@clustersol.agency directly.";
      }
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (isSuccess) {
      form.reset();
      if (statusContainer) {
        statusContainer.innerHTML = `
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="fas fa-check-circle text-emerald-600" style="font-size: 1.35rem; margin-top: 2px;"></i>
            <div>
              <h4 style="margin: 0 0 4px; color: #065F46; font-size: 1rem;">Project Inquiry Successfully Logged!</h4>
              <p style="margin: 0; font-size: 0.875rem; color: #047857; line-height: 1.5;">${responseMessage}</p>
            </div>
          </div>
        `;
        statusContainer.scrollIntoView({ behavior: 'smooth' });
      }

      if (typeof showToast === 'function') {
        showToast("Inquiry logged securely to Google Sheets! Our team will contact you shortly.", "success");
      }
    } else {
      if (statusContainer) {
        statusContainer.innerHTML = `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="fas fa-triangle-exclamation" style="font-size: 1.35rem; margin-top: 2px; color: #B91C1C;"></i>
            <div>
              <h4 style="margin: 0 0 4px; color: #991B1B; font-size: 1rem;">We could not send your message</h4>
              <p style="margin: 0; font-size: 0.875rem; color: #B91C1C; line-height: 1.5;">${responseMessage} You can also reach us on <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style="color: #991B1B; text-decoration: underline;">WhatsApp</a>.</p>
            </div>
          </div>
        `;
        statusContainer.scrollIntoView({ behavior: 'smooth' });
      }
      if (typeof showToast === 'function') {
        showToast("Submission failed. Please email hello@clustersol.agency or message us on WhatsApp.", "error");
      }
    }
  });
});
