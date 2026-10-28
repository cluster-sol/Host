/**
 * ==============================================================================
 * Cloudflare Pages Function: /api/contact
 * Handles inbound project inquiries, saves to Cloudflare D1,
 * and forwards to Google Apps Script (Google Sheets) in real time.
 * ==============================================================================
 */

export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await context.request.json();
    const { name, email, phone, company, service, budget, timeline, message, source_url } = body;

    // Basic Validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields (name, email, message)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const leadCode = `LD-${Date.now().toString().slice(-6)}`;
    const clientIp = context.request.headers.get("cf-connecting-ip") || "Unknown";
    const clientCountry = context.request.headers.get("cf-ipcountry") || "Global";
    const userAgent = context.request.headers.get("user-agent") || "Browser";

    // 1. Save to Cloudflare D1 if available
    let d1Saved = false;
    if (context.env.DB) {
      try {
        const sql = `
          INSERT INTO leads (lead_code, full_name, email, phone_whatsapp, company_name, service_required, estimated_budget, timeline, message, source_url, ip_country, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await context.env.DB.prepare(sql).bind(
          leadCode,
          name,
          email,
          phone || "",
          company || "",
          service || "General Inquiry",
          budget || "Not Specified",
          timeline || "Standard",
          message,
          source_url || "",
          clientCountry,
          userAgent
        ).run();
        d1Saved = true;
      } catch (dbErr) {
        console.error("D1 Lead Insertion Error:", dbErr);
      }
    }

    // 2. Forward to Google Apps Script (Google Sheets) Webhook if URL configured
    const googleAppsScriptUrl = context.env.GOOGLE_APPS_SCRIPT_URL;
    if (googleAppsScriptUrl && !googleAppsScriptUrl.includes("DEMO_REPLACE")) {
      context.waitUntil(
        fetch(googleAppsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: leadCode,
            name,
            email,
            phone,
            company,
            service,
            budget,
            timeline,
            message,
            source_url,
            country: clientCountry
          })
        }).catch(err => console.error("Google Apps Script forwarding failed:", err))
      );
    }

    return new Response(JSON.stringify({
      status: "success",
      message: "Inquiry received and logged to database! Our engineering leadership will reply within 4 business hours.",
      lead_code: leadCode,
      d1_synced: d1Saved
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process request: " + err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
