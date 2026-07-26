/**
 * Curator Task adapter.
 * Set a public server-side endpoint below. Never place a private API key here.
 *
 * Request:
 * POST { exhibits: [{name, category, note, date, tags}] }
 *
 * Response:
 * {
 *   itemNotes: [{name, sentence}],
 *   connectionTitle: "...",
 *   connectionParagraph: "...",
 *   themes: ["..."],
 *   library: [{name, summary, date, category, icon, sources:[{title,url,type,citation}]}]
 * }
 */
window.CURATOR_TASK_ENDPOINT = "";
