"use client"

import { useState } from "react"

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: "1rem",
  boxSizing: "border-box",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.9rem",
  marginBottom: "0.3rem",
  marginTop: "1.1rem",
}

const checkboxRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "0.7rem",
}

export default function IntakeForm() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    client_name: "",
    product: "",
    country: "",
    daily_budget: "",
    landing_url: "",
    objective: "leads",
    has_google_ads_account: false,
    google_ads_customer_id: "",
    has_ga4: false,
    has_conversion_tag: false,
    has_meta_business_manager: false,
    has_meta_pixel: false,
    has_meta_ad_account_linked: false,
    previous_campaigns_notes: "",
    notes: "",
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setSubmitting(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Algo falló al enviar el formulario.")
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <main style={{ maxWidth: 560, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <h1>¡Listo!</h1>
        <p>Recibimos tus datos. El equipo de Inteliar se pone en contacto para seguir con la campaña.</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 560, margin: "3rem auto", padding: "0 1.5rem 4rem" }}>
      <h1 style={{ marginBottom: "0.2rem" }}>Alta de cliente — Inteliar</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Completá estos datos para que podamos armar tu campaña de marketing.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nombre de la empresa / marca *</label>
        <input style={inputStyle} required value={form.client_name}
          onChange={(e) => set("client_name", e.target.value)} />

        <label style={labelStyle}>¿Qué vendés? *</label>
        <textarea style={{ ...inputStyle, minHeight: 70 }} required value={form.product}
          onChange={(e) => set("product", e.target.value)} />

        <label style={labelStyle}>País *</label>
        <input style={inputStyle} required value={form.country}
          onChange={(e) => set("country", e.target.value)} />

        <label style={labelStyle}>Presupuesto diario (USD)</label>
        <input style={inputStyle} type="number" min="0" step="0.01" value={form.daily_budget}
          onChange={(e) => set("daily_budget", e.target.value)} />

        <label style={labelStyle}>URL de tu landing *</label>
        <input style={inputStyle} required type="url" placeholder="https://" value={form.landing_url}
          onChange={(e) => set("landing_url", e.target.value)} />

        <label style={labelStyle}>Objetivo principal *</label>
        <select style={inputStyle} required value={form.objective}
          onChange={(e) => set("objective", e.target.value)}>
          <option value="leads">Leads / registros</option>
          <option value="ventas">Ventas / conversión directa</option>
          <option value="trafico">Tráfico / awareness</option>
        </select>

        <h2 style={{ marginTop: "2rem", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Google Ads</h2>
        <div style={checkboxRow}>
          <input type="checkbox" id="ga_acc" checked={form.has_google_ads_account}
            onChange={(e) => set("has_google_ads_account", e.target.checked)} />
          <label htmlFor="ga_acc">Ya tengo cuenta de Google Ads</label>
        </div>
        {form.has_google_ads_account && (
          <>
            <label style={labelStyle}>Customer ID de Google Ads</label>
            <input style={inputStyle} placeholder="123-456-7890" value={form.google_ads_customer_id}
              onChange={(e) => set("google_ads_customer_id", e.target.value)} />
          </>
        )}
        <div style={checkboxRow}>
          <input type="checkbox" id="ga4" checked={form.has_ga4}
            onChange={(e) => set("has_ga4", e.target.checked)} />
          <label htmlFor="ga4">Mi sitio ya tiene Google Analytics 4 (GA4) instalado</label>
        </div>
        <div style={checkboxRow}>
          <input type="checkbox" id="conv_tag" checked={form.has_conversion_tag}
            onChange={(e) => set("has_conversion_tag", e.target.checked)} />
          <label htmlFor="conv_tag">Mi sitio ya tiene el tag de conversión de Google Ads instalado</label>
        </div>

        <h2 style={{ marginTop: "2rem", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Meta Ads (Facebook / Instagram)</h2>
        <div style={checkboxRow}>
          <input type="checkbox" id="meta_bm" checked={form.has_meta_business_manager}
            onChange={(e) => set("has_meta_business_manager", e.target.checked)} />
          <label htmlFor="meta_bm">Ya tengo Business Manager de Meta</label>
        </div>
        <div style={checkboxRow}>
          <input type="checkbox" id="meta_pixel" checked={form.has_meta_pixel}
            onChange={(e) => set("has_meta_pixel", e.target.checked)} />
          <label htmlFor="meta_pixel">Mi sitio ya tiene el Meta Pixel instalado</label>
        </div>
        <div style={checkboxRow}>
          <input type="checkbox" id="meta_ad_acc" checked={form.has_meta_ad_account_linked}
            onChange={(e) => set("has_meta_ad_account_linked", e.target.checked)} />
          <label htmlFor="meta_ad_acc">Tengo una cuenta publicitaria vinculada al Business Manager</label>
        </div>

        <label style={labelStyle}>¿Corriste campañas antes? ¿Qué resultado dieron?</label>
        <textarea style={{ ...inputStyle, minHeight: 70 }} value={form.previous_campaigns_notes}
          onChange={(e) => set("previous_campaigns_notes", e.target.value)}
          placeholder="Ej: probé una campaña enfocada en X y no funcionó bien..." />

        <label style={labelStyle}>Notas adicionales</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.notes}
          onChange={(e) => set("notes", e.target.value)} />

        {error && <p style={{ color: "#b91c1c", marginTop: "1rem" }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{
          marginTop: "1.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem",
          background: "#111827", color: "white", border: "none", borderRadius: 6,
          cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1,
        }}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </main>
  )
}
