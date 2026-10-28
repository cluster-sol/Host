/**
 * ==============================================================================
 * CLUSTER AI & TECH SOLUTIONS — ZERO-LOGIN GOOGLE SHEETS INTAKE ENGINE
 * ==============================================================================
 * 
 * Purpose: Receives project contact requests, AI audit bookings, and calculator
 * leads from your Jekyll website and writes them directly to a Google Sheet
 * in real-time — WITHOUT requiring user login. Also triggers instant email notification.
 * 
 * ------------------------------------------------------------------------------
 * HOW TO DEPLOY IN 2 MINUTES:
 * ------------------------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.new) -> Name it: "Cluster Sol - Client Inbound Leads"
 * 2. In the top menu, click: Extensions -> Apps Script
 * 3. Delete any default code in Code.gs and PASTE THIS ENTIRE FILE.
 * 4. In Line 25 below, change NOTIFY_EMAIL to your actual email (e.g., hello@clustersol.agency).
 * 5. Click "Deploy" (blue button top right) -> Choose "New deployment"
 * 6. Select type: "Web app" (click gear icon next to Select type)
 * 7. Set:
 *    - Description: "Cluster Sol Website Contact Webhook"
 *    - Execute as: "Me (your-email@gmail.com)"  <-- VERY IMPORTANT
 *    - Who has access: "Anyone"                 <-- VERY IMPORTANT (enables zero login)
 * 8. Click "Deploy", authorize permissions when prompted.
 * 9. Copy the generated "Web App URL" (ends in /exec).
 * 10. Paste that URL into:
 *     - wrangler.toml -> GOOGLE_APPS_SCRIPT_URL
 *     - assets/js/contact.js -> GOOGLE_APPS_SCRIPT_URL
 * ==============================================================================
 */

// FOUNDER EMAIL TO RECEIVE INSTANT LEAD NOTIFICATIONS
const NOTIFY_EMAIL = "hello@clustersol.agency";
const COMPANY_NAME = "Cluster AI & Tech Solutions";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: COMPANY_NAME,
    message: "Cluster Sol Lead Ingestion Webhook is running live."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent requests
  lock.tryLock(30000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName("Inbound Leads");

    // Auto-create and format sheet if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet("Inbound Leads");
      const headers = [
        "Timestamp",
        "Lead ID",
        "Full Name",
        "Email Address",
        "Phone / WhatsApp",
        "Company Name",
        "Service Required",
        "Budget Estimate",
        "Timeline",
        "Project Scope & Message",
        "Source URL",
        "Country / Region",
        "Status"
      ];
      sheet.appendRow(headers);
      
      // Styling the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1E3A8A");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Parse incoming payload (supports JSON body or URL-encoded form data)
    let data = {};
    if (e.postData && e.postData.type && e.postData.type.indexOf("application/json") !== -1) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    const timestamp = new Date();
    const leadId = "LD-" + Utilities.formatDate(timestamp, "GMT+5:30", "yyyyMMdd-HHmmss");
    const name = data.name || data.full_name || "N/A";
    const email = data.email || "N/A";
    const phone = data.phone || data.whatsapp || "N/A";
    const company = data.company || data.company_name || "N/A";
    const service = data.service || data.service_required || "General Inquiry";
    const budget = data.budget || data.estimated_budget || "Not Specified";
    const timeline = data.timeline || "Standard";
    const message = data.message || data.details || "No details provided";
    const sourceUrl = data.source_url || data.page || "Direct Website";
    const country = data.country || "Global";
    const status = "NEW LEAD";

    // Append to sheet
    sheet.appendRow([
      timestamp,
      leadId,
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message,
      sourceUrl,
      country,
      status
    ]);

    // Send instant email notification to founder
    try {
      sendFounderAlert({
        leadId: leadId,
        name: name,
        email: email,
        phone: phone,
        company: company,
        service: service,
        budget: budget,
        timeline: timeline,
        message: message,
        sourceUrl: sourceUrl
      });
    } catch (mailErr) {
      Logger.log("Email notification failed: " + mailErr.toString());
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Your project inquiry has been securely submitted! Our engineering team will review it and reply within 4 hours.",
      lead_id: leadId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function sendFounderAlert(lead) {
  const subject = "🚀 [NEW LEAD " + lead.leadId + "] " + lead.name + " (" + lead.company + ") — " + lead.service;
  
  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const waLink = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent("Hi " + lead.name + ", thank you for reaching out to Cluster AI & Tech Solutions regarding " + lead.service + ". We have reviewed your project requirements.");
  const mailtoLink = "mailto:" + lead.email + "?subject=" + encodeURIComponent("RE: Your " + lead.service + " Project with Cluster Sol");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 24px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Cluster AI & Tech Solutions</h2>
        <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">Inbound Lead Intake Notification</p>
      </div>
      <div style="padding: 24px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Lead Reference:</td><td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${lead.leadId}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Client Name:</td><td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${lead.name}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Company / Brand:</td><td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${lead.company}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Email Address:</td><td style="padding: 6px 0;"><a href="${mailtoLink}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${lead.email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Phone / WhatsApp:</td><td style="padding: 6px 0;"><a href="${waLink}" style="color: #059669; text-decoration: none; font-weight: 600;">${lead.phone} 💬 (WhatsApp)</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Service Requested:</td><td style="padding: 6px 0; font-weight: 600; color: #4338ca;">${lead.service}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Budget Range:</td><td style="padding: 6px 0; font-weight: 600; color: #059669;">${lead.budget}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Target Timeline:</td><td style="padding: 6px 0; color: #1e293b;">${lead.timeline}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Origin Page:</td><td style="padding: 6px 0; color: #64748b; font-size: 12px;">${lead.sourceUrl}</td></tr>
          </table>
        </div>

        <h4 style="margin: 0 0 8px; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Scope & Client Notes</h4>
        <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${lead.message}</div>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
          <a href="${waLink}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin-right: 10px;">Reply on WhatsApp</a>
          <a href="${mailtoLink}" style="display: inline-block; background: #1E3A8A; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px;">Send Email Response</a>
        </div>
      </div>
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 24px; font-size: 12px; color: #94a3b8; text-align: center;">
        Auto-recorded to Google Sheets • Cluster AI & Tech Solutions Automated Pipeline
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}
