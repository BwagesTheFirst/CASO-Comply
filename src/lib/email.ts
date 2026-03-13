// SendGrid email utility for lead notifications
// Gracefully no-ops if SENDGRID_API_KEY is not set

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || "sales@casocomply.com";
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@casocomply.com";

interface LeadNotificationData {
  source: "contact" | "free_scan" | "scan_email";
  name?: string;
  email: string;
  organization?: string;
  phone?: string;
  // Source-specific
  helpWith?: string;
  message?: string;
  websiteUrl?: string;
  documentCount?: string;
  industry?: string;
}

export async function sendLeadNotification(lead: LeadNotificationData): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.log("[email] SENDGRID_API_KEY not set — skipping notification");
    return false;
  }

  const sourceLabels: Record<string, string> = {
    contact: "Contact Form",
    free_scan: "Free Scan Request",
    scan_email: "Scan Email Capture",
  };

  const subject = `New Lead: ${sourceLabels[lead.source]} — ${lead.organization || lead.email}`;

  const lines = [
    `<h2>New ${sourceLabels[lead.source]} Submission</h2>`,
    `<table style="border-collapse:collapse;width:100%;max-width:600px;">`,
    row("Name", lead.name),
    row("Email", `<a href="mailto:${lead.email}">${lead.email}</a>`),
    row("Phone", lead.phone),
    row("Organization", lead.organization),
    lead.helpWith ? row("Topic", lead.helpWith) : "",
    lead.message ? row("Message", lead.message) : "",
    lead.websiteUrl ? row("Website", lead.websiteUrl) : "",
    lead.documentCount ? row("Est. Documents", lead.documentCount) : "",
    lead.industry ? row("Industry", lead.industry) : "",
    `</table>`,
    `<p style="margin-top:20px;color:#666;font-size:13px;">View in CRM: <a href="https://casocomply.com/dashboard/admin/leads">Admin Dashboard</a></p>`,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: NOTIFICATION_EMAIL }] }],
        from: { email: FROM_EMAIL, name: "CASO Comply" },
        subject,
        content: [{ type: "text/html", value: lines }],
      }),
    });

    if (!res.ok) {
      console.error("[email] SendGrid error:", res.status, await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
    return false;
  }
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;width:140px;">${label}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${value}</td></tr>`;
}
