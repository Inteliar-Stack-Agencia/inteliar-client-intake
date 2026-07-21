import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const required = ["client_name", "product", "country", "landing_url", "objective"]
  const missing = required.filter((key) => !body[key]?.trim?.())
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos obligatorios: ${missing.join(", ")}` },
      { status: 400 },
    )
  }

  const { error } = await supabaseAdmin()
    .from("client_intakes")
    .insert({
      client_name: body.client_name,
      product: body.product,
      country: body.country,
      daily_budget: body.daily_budget ? Number(body.daily_budget) : null,
      landing_url: body.landing_url,
      objective: body.objective,
      has_google_ads_account: !!body.has_google_ads_account,
      google_ads_customer_id: body.google_ads_customer_id || null,
      has_ga4: !!body.has_ga4,
      has_conversion_tag: !!body.has_conversion_tag,
      has_meta_business_manager: !!body.has_meta_business_manager,
      has_meta_pixel: !!body.has_meta_pixel,
      has_meta_ad_account_linked: !!body.has_meta_ad_account_linked,
      previous_campaigns_notes: body.previous_campaigns_notes || null,
      notes: body.notes || null,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
