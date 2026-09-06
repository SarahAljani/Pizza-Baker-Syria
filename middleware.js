// Rewrites the static og:image/twitter:image (and title/description) meta
// tags in index.html using whatever is currently saved in the dashboard,
// before the response reaches the browser. This exists because link-preview
// crawlers (WhatsApp, Facebook, Twitter) read the raw HTML and never run the
// client-side SEOHead.jsx update — only a response rewritten here actually
// changes what they show.
export const config = {
  matcher: "/",
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceMetaContent(html, selectorRegex, value) {
  return html.replace(selectorRegex, `$1${escapeHtml(value)}$2`);
}

export default async function middleware(request) {
  try {
    const origin = new URL(request.url).origin;

    const [htmlRes, settingsRes] = await Promise.all([
      fetch(new URL("/index.html", origin)),
      fetch(new URL("/api/content?key=settings", origin)),
    ]);

    if (!htmlRes.ok) return; // fall back to normal static serving

    let html = await htmlRes.text();
    const settings = settingsRes.ok ? (await settingsRes.json())?.value : null;

    const ogImage = settings?.seo?.ogImage;
    if (ogImage) {
      html = replaceMetaContent(
        html,
        /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
        ogImage,
      );
      html = replaceMetaContent(
        html,
        /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
        ogImage,
      );
    }

    // index.html defaults to Arabic (the site's primary language), so that's
    // the copy link-preview crawlers see — match that here.
    const title = settings?.seo?.sections?.home?.ar?.title;
    if (title) {
      html = replaceMetaContent(html, /(<title>)[\s\S]*?(<\/title>)/, title);
      html = replaceMetaContent(
        html,
        /(<meta\s+name="title"\s+content=")[^"]*(")/,
        title,
      );
      html = replaceMetaContent(
        html,
        /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
        title,
      );
      html = replaceMetaContent(
        html,
        /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
        title,
      );
    }

    const description = settings?.seo?.sections?.home?.ar?.description;
    if (description) {
      html = replaceMetaContent(
        html,
        /(<meta\s+name="description"\s+content=")[^"]*(")/,
        description,
      );
      html = replaceMetaContent(
        html,
        /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
        description,
      );
      html = replaceMetaContent(
        html,
        /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
        description,
      );
    }

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    // Any failure (network hiccup, bad JSON, etc.) — fall back to the
    // static defaults rather than breaking the page load.
    return;
  }
}
