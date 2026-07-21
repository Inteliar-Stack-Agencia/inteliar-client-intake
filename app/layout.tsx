import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inteliar — Alta de cliente",
  description: "Formulario de alta de cliente para campañas de marketing",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#f7f7f8" }}>
        {children}
      </body>
    </html>
  )
}
