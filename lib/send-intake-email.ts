// Envía una copia imprimible del formulario de alta a Inteliar por mail.
// No-ops gracefully si RESEND_API_KEY no está configurada.

const FROM = process.env.RESEND_FROM || "Inteliar Client Intake <onboarding@resend.dev>"
const TO = process.env.INTAKE_NOTIFY_EMAIL || "inteliarstack.ia@gmail.com"

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 6px 12px; font-weight: bold; vertical-align: top; width: 220px;">${label}</td>
      <td style="padding: 6px 12px;">${value}</td>
    </tr>`
}

function badge(ok: boolean, label: string) {
  const color = ok ? "#166534" : "#991b1b"
  const bg = ok ? "#dcfce7" : "#fee2e2"
  const mark = ok ? "✓" : "✗"
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;margin:2px 4px 2px 0;background:${bg};color:${color};font-size:13px;">${mark} ${label}</span>`
}

export interface IntakeEmailData {
  client_name: string
  product: string
  country: string
  daily_budget: string
  landing_url: string
  objective: string
  has_google_ads_account: boolean
  google_ads_customer_id: string
  has_ga4: boolean
  has_conversion_tag: boolean
  has_meta_business_manager: boolean
  has_meta_pixel: boolean
  has_meta_ad_account_linked: boolean
  previous_campaigns_notes: string
  notes: string
}

export async function sendIntakeEmail(data: IntakeEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[send-intake-email] RESEND_API_KEY no configurada — email no enviado")
    return
  }

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a2e;">
    <div style="background: #111827; padding: 20px 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">Nuevo cliente: ${data.client_name}</h1>
      <p style="color: #cbd5e1; margin: 4px 0 0; font-size: 13px;">Formulario de alta — Inteliar</p>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${row("Producto", data.product)}
        ${row("País", data.country)}
        ${row("Presupuesto diario", data.daily_budget ? `USD ${data.daily_budget}/día` : "—")}
        ${row("Landing", `<a href="${data.landing_url}">${data.landing_url}</a>`)}
        ${row("Objetivo", data.objective)}
      </table>

      <p style="font-weight: bold; font-size: 13px; margin: 20px 0 4px;">Google Ads</p>
      <div>
        ${badge(data.has_google_ads_account, "Cuenta Google Ads")}
        ${badge(data.has_ga4, "GA4")}
        ${badge(data.has_conversion_tag, "Tag de conversión")}
      </div>
      ${data.google_ads_customer_id ? `<p style="font-size: 13px; color: #555;">Customer ID: ${data.google_ads_customer_id}</p>` : ""}

      <p style="font-weight: bold; font-size: 13px; margin: 20px 0 4px;">Meta Ads</p>
      <div>
        ${badge(data.has_meta_business_manager, "Business Manager")}
        ${badge(data.has_meta_pixel, "Meta Pixel")}
        ${badge(data.has_meta_ad_account_linked, "Cuenta publicitaria")}
      </div>

      ${data.previous_campaigns_notes ? `<p style="font-size: 14px; margin-top: 20px;"><strong>Campañas previas:</strong> ${data.previous_campaigns_notes}</p>` : ""}
      ${data.notes ? `<p style="font-size: 14px;"><strong>Notas:</strong> ${data.notes}</p>` : ""}

      <p style="font-size: 12px; color: #aaa; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
        Inteliar — inteliar-client-intake
      </p>
    </div>
  </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      subject: `Nuevo cliente: ${data.client_name}`,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[send-intake-email] Resend ${res.status}: ${text}`)
  }
}
