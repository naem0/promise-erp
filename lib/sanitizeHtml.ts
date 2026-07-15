/**
 * Deterministic, isomorphic HTML sanitizer for rich-text content coming from
 * the CMS (course descriptions, FAQ answers, etc.).
 *
 * WYSIWYG editors frequently produce content that has been pasted from another
 * web page or a word processor, which can carry document-level tags such as
 * `<html>`, `<head>` and `<body>`. When such markup is injected into a `<div>`
 * via `dangerouslySetInnerHTML`, the server streams it verbatim but the browser
 * parser refuses to nest those tags inside a `<div>` and hoists/drops them. The
 * resulting DOM no longer matches React's tree, which triggers a hydration
 * mismatch (React error #418) and, during the streamed Suspense reveal, a
 * `HierarchyRequestError: The new child element contains the parent` crash.
 *
 * This runs as a pure string transform so it produces byte-identical output on
 * the server and the client — avoiding the hydration mismatch that a
 * browser-only sanitizer (e.g. plain `dompurify`, which is a no-op on the
 * server) would introduce.
 */

// Structural / document-level and executable tags that must never appear inside
// an inline container. Matched as whole tags (open and close) case-insensitively.
const STRIP_WITH_CONTENT = ["script", "style", "head", "title"];
const STRIP_TAG_ONLY = [
  "html",
  "body",
  "meta",
  "link",
  "base",
  "!doctype",
];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";

  let out = html;

  // Remove tags together with their contents (scripts, styles, head metadata).
  for (const tag of STRIP_WITH_CONTENT) {
    out = out.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi"),
      ""
    );
    // Also drop any dangling open/close tag left behind.
    out = out.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  // Remove the document-scope wrapper tags but keep their inner content.
  for (const tag of STRIP_TAG_ONLY) {
    out = out.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  // Strip inline event handlers (onclick, onload, …) and javascript: URLs that
  // could survive the structural pass.
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/(href|src)\s*=\s*("|')?\s*javascript:[^"'>]*/gi, "$1=$2");

  return out.trim();
}
