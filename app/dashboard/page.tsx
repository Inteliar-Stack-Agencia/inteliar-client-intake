import { supabaseAdmin, ClientIntake } from "@/lib/supabase"

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "0.15rem 0.5rem", borderRadius: 4,
      fontSize: "0.75rem", marginRight: "0.4rem", marginBottom: "0.3rem",
      background: ok ? "#dcfce7" : "#fee2e2",
      color: ok ? "#166534" : "#991b1b",
    }}>
      {ok ? "✓" : "✗"} {label}
    </span>
  )
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!process.env.DASHBOARD_TOKEN || token !== process.env.DASHBOARD_TOKEN) {
    return (
      <main style={{ maxWidth: 480, margin: "4rem auto", textAlign: "center" }}>
        <h1>Acceso restringido</h1>
        <p>Falta o es incorrecto el token de acceso (?token=...).</p>
      </main>
    )
  }

  const { data, error } = await supabaseAdmin()
    .from("client_intakes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <main style={{ padding: "2rem" }}>Error: {error.message}</main>
  }

  const intakes = (data ?? []) as ClientIntake[]

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1.5rem 4rem", fontFamily: "system-ui" }}>
      <h1>Clientes dados de alta</h1>
      {intakes.length === 0 && <p>Todavía no hay respuestas.</p>}

      {intakes.map((c) => (
        <div key={c.id} style={{
          border: "1px solid #e5e7eb", borderRadius: 8, padding: "1.25rem",
          marginBottom: "1rem", background: "white",
        }}>
          <h2 style={{ margin: "0 0 0.2rem" }}>{c.client_name}</h2>
          <p style={{ margin: "0 0 0.6rem", color: "#555", fontSize: "0.9rem" }}>
            {new Date(c.created_at).toLocaleString("es-AR")}
          </p>

          <p><strong>Vende:</strong> {c.product}</p>
          <p><strong>País:</strong> {c.country} · <strong>Presupuesto:</strong> {c.daily_budget ? `USD ${c.daily_budget}/día` : "—"}</p>
          <p><strong>Landing:</strong> <a href={c.landing_url} target="_blank" rel="noreferrer">{c.landing_url}</a></p>
          <p><strong>Objetivo:</strong> {c.objective}</p>

          <div style={{ marginTop: "0.75rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.3rem" }}>Google Ads</div>
            <Badge ok={c.has_google_ads_account} label="Cuenta Google Ads" />
            <Badge ok={c.has_ga4} label="GA4" />
            <Badge ok={c.has_conversion_tag} label="Tag de conversión" />
            {c.google_ads_customer_id && <span style={{ fontSize: "0.85rem", color: "#555" }}> · ID: {c.google_ads_customer_id}</span>}
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.3rem" }}>Meta Ads</div>
            <Badge ok={c.has_meta_business_manager} label="Business Manager" />
            <Badge ok={c.has_meta_pixel} label="Meta Pixel" />
            <Badge ok={c.has_meta_ad_account_linked} label="Cuenta publicitaria" />
          </div>

          {c.previous_campaigns_notes && (
            <p style={{ marginTop: "0.75rem" }}><strong>Campañas previas:</strong> {c.previous_campaigns_notes}</p>
          )}
          {c.notes && <p><strong>Notas:</strong> {c.notes}</p>}
        </div>
      ))}
    </main>
  )
}
