// Cloudflare Pages Function: POST /api/kontakt – leitet das Kontaktformular per E-Mail weiter (über Resend).
// Einrichtung (Cloudflare → Pages → wintistars → Settings → Variables and Secrets, Production):
//   RESEND_API_KEY  (Secret)  API-Key von https://resend.com
//   KONTAKT_AN                Empfänger, z. B. vorstand@wintistars.ch
//   KONTAKT_VON   (optional)  Absender mit bei Resend verifizierter Domain, z. B. «Website EHC Wintistars <website@wintistars.ch>»
// Fehlt die Einrichtung, antwortet die Function mit 503 und das Formular zeigt die Kontakt-E-Mail aus Sanity an.

interface Env {
  RESEND_API_KEY?: string;
  KONTAKT_AN?: string;
  KONTAKT_VON?: string;
}

interface Kontext {
  request: Request;
  env: Env;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mit JavaScript: JSON-Antwort. Ohne: zurück auf die Seite mit ?kontakt=gesendet|fehler */
function antwort(request: Request, ok: boolean, status: number): Response {
  if (request.headers.get('Accept')?.includes('application/json')) {
    return Response.json({ ok }, { status });
  }
  const zurueck = new URL(request.headers.get('Referer') ?? '/kontakt/', request.url);
  zurueck.searchParams.set('kontakt', ok ? 'gesendet' : 'fehler');
  zurueck.hash = 'kontakt';
  return Response.redirect(zurueck.toString(), 303);
}

export async function onRequestPost({ request, env }: Kontext): Promise<Response> {
  let daten: FormData;
  try {
    daten = await request.formData();
  } catch {
    return antwort(request, false, 400);
  }
  const feld = (name: string, max: number) => String(daten.get(name) ?? '').trim().slice(0, max);
  const name = feld('name', 120);
  const email = feld('email', 200);
  const betreff = feld('betreff', 200);
  const nachricht = feld('nachricht', 5000);

  // Spam-Falle ausgefüllt: so tun, als wäre alles gut
  if (feld('website', 200)) return antwort(request, true, 200);
  if (!name || !nachricht || !EMAIL.test(email)) return antwort(request, false, 400);
  if (!env.RESEND_API_KEY || !env.KONTAKT_AN) return antwort(request, false, 503);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.KONTAKT_VON || 'Website EHC Wintistars <onboarding@resend.dev>',
      to: env.KONTAKT_AN.split(',').map((a) => a.trim()),
      reply_to: email,
      subject: `Kontaktformular: ${betreff || 'Anfrage'} (${name})`,
      text: `${nachricht}\n\n—\n${name} <${email}>\nGesendet über das Kontaktformular auf der Website.`,
    }),
  });
  if (!res.ok) console.error('[kontakt] Resend', res.status, await res.text());
  return antwort(request, res.ok, res.ok ? 200 : 502);
}
