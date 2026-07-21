# inteliar-client-intake

Formulario interno de Inteliar para dar de alta un cliente nuevo antes de
armar su campaña de marketing. Se manda como link al cliente, completa sus
datos, y queda guardado para que Inteliar vea qué tiene y qué le falta
(cuenta de Google Ads, GA4, tag de conversión, Business Manager de Meta,
Pixel, etc.) antes de arrancar a ejecutar la campaña.

Complementa la skill `inteliar-marketing-architect` (Paso 0 del checklist
de cliente nuevo) — cuando alguien completa este formulario, esos datos son
justo los que la skill necesita para arrancar.

## Stack

Next.js (App Router) + Supabase. Sin autenticación de usuarios — el
formulario es público (cualquiera con el link puede completarlo) y el
dashboard interno está protegido con un token simple por URL, no con login.

**Nota**: la tabla `client_intakes` vive en el proyecto de Supabase
`inteliar-labels` (no se creó un proyecto nuevo para evitar el costo
recurrente de Supabase) — está aislada del resto de los datos del producto
vía RLS ("no public access", solo accesible con el service role key).

## Setup

```bash
npm install
cp .env.example .env.local
```

Completar en `.env.local`:
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — del proyecto `inteliar-labels`
  en el dashboard de Supabase (Project Settings → API).
- `DASHBOARD_TOKEN` — cualquier string largo random, ej. generado con
  `openssl rand -hex 24`.
- `RESEND_API_KEY` (opcional) — si se completa, cada envío del formulario
  manda además una copia por mail a `INTAKE_NOTIFY_EMAIL` (default
  `inteliarstack.ia@gmail.com`). Sin esta key el formulario funciona igual,
  solo no se manda el mail.

```bash
npm run dev
# → http://localhost:3000  (formulario)
# → http://localhost:3000/dashboard?token=TU_TOKEN  (panel interno)
```

## Deploy

1. Importar este repo en Vercel.
2. Cargar las variables de entorno de arriba en Project Settings →
   Environment Variables (Production + Preview).
3. Deploy. La URL que te da Vercel es la que se le manda al cliente.

## Uso

- Mandar el link raíz (`/`) al cliente para que complete sus datos.
- Vos entrás a `/dashboard?token=TU_TOKEN` para ver todos los clientes que
  completaron el formulario y qué les falta configurar (badges verdes/rojos
  por cada integración).
