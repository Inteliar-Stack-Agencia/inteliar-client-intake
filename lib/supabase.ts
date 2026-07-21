import { createClient } from "@supabase/supabase-js"

// Service role — este proyecto no expone ninguna key al browser, todo pasa
// por API routes server-side. La tabla client_intakes tiene RLS "no public
// access", así que solo el service role puede leer/escribir.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.")
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export interface ClientIntake {
  id: string
  created_at: string
  client_name: string
  product: string
  country: string
  daily_budget: number | null
  landing_url: string
  objective: string
  has_google_ads_account: boolean
  google_ads_customer_id: string | null
  has_ga4: boolean
  has_conversion_tag: boolean
  has_meta_business_manager: boolean
  has_meta_pixel: boolean
  has_meta_ad_account_linked: boolean
  previous_campaigns_notes: string | null
  notes: string | null
}
