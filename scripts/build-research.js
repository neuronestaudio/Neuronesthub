import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env"), override: false });

if (!process.env.NOTION_API_KEY) {
  console.error("Missing NOTION_API_KEY environment variable.");
  process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = "455210ca3a1e4ee38a436668fbef6a11";
const OUTPUT_DIR = path.join(__dirname, "..", "research");

// ── Helpers ──────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function confidenceColor(tier) {
  const t = (tier || "").toLowerCase();
  if (t === "high") return "#34d399";
  if (t === "moderate") return "#fbbf24";
  if (t === "low") return "#f87171";
  return "#a0a0a0";
}

function confidenceBg(tier) {
  const t = (tier || "").toLowerCase();
  if (t === "high") return "rgba(52,211,153,0.12)";
  if (t === "moderate") return "rgba(251,191,36,0.12)";
  if (t === "low") return "rgba(248,113,113,0.12)";
  return "rgba(160,160,160,0.12)";
}

const CATEGORIES = ["Focus", "Sleep", "Calm", "Other"];

function categoryColor(cat) {
  const c = (cat || "").toLowerCase();
  if (c === "focus") return "#8ea3ff";
  if (c === "sleep") return "#a78bfa";
  if (c === "calm") return "#67e8f9";
  return "#94a3b8";
}

function categoryBg(cat) {
  const c = (cat || "").toLowerCase();
  if (c === "focus") return "rgba(142,163,255,0.12)";
  if (c === "sleep") return "rgba(167,139,250,0.12)";
  if (c === "calm") return "rgba(103,232,249,0.12)";
  return "rgba(148,163,184,0.12)";
}

function inferCategory(paper) {
  const text = `${paper.title} ${paper.contentAngle} ${paper.series.join(" ")}`.toLowerCase();
  if (/sleep|slow.wave|delta|circadian|insomnia|rest/i.test(text)) return "Sleep";
  if (/focus|gamma|attention|cognit|concentration|40.?hz|beta|memory|alzheimer|amyloid/i.test(text)) return "Focus";
  if (/calm|relax|anxi|stress|vagal|vagus|alpha|meditat|parasympathetic/i.test(text)) return "Calm";
  return "Other";
}

// ── Extract property helpers ────────────────────────────

function getProp(page, name) {
  return page.properties[name] || null;
}

function getTitle(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "title") return "";
  return (p.title || []).map((t) => t.plain_text).join("");
}

function getRichText(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "rich_text") return "";
  return (p.rich_text || []).map((t) => t.plain_text).join("");
}

function getSelect(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "select" || !p.select) return "";
  return p.select.name || "";
}

function getMultiSelect(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "multi_select") return [];
  return (p.multi_select || []).map((s) => s.name);
}

function getDate(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "date" || !p.date) return "";
  return p.date.start || "";
}

function getNumber(page, name) {
  const p = getProp(page, name);
  if (!p || p.type !== "number") return null;
  return p.number;
}

// ── Render Notion blocks to HTML ────────────────────────

function renderRichText(richTextArr) {
  if (!richTextArr || !richTextArr.length) return "";
  return richTextArr
    .map((t) => {
      let text = escapeHtml(t.plain_text);
      if (t.annotations) {
        if (t.annotations.bold) text = `<strong>${text}</strong>`;
        if (t.annotations.italic) text = `<em>${text}</em>`;
        if (t.annotations.strikethrough) text = `<s>${text}</s>`;
        if (t.annotations.underline) text = `<u>${text}</u>`;
        if (t.annotations.code)
          text = `<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:0.9em;">${text}</code>`;
      }
      if (t.href) {
        text = `<a href="${escapeHtml(t.href)}" target="_blank" rel="noopener" style="color:#8ea3ff;text-decoration:underline;">${text}</a>`;
      }
      return text;
    })
    .join("");
}

function renderBlocks(blocks) {
  let html = "";
  let inList = null;

  function closeList() {
    if (inList === "bulleted") { html += "</ul>\n"; inList = null; }
    if (inList === "numbered") { html += "</ol>\n"; inList = null; }
  }

  for (const block of blocks) {
    const type = block.type;

    if (type === "bulleted_list_item") {
      if (inList !== "bulleted") { closeList(); html += '<ul style="margin:12px 0 12px 24px;color:#b2b2b2;">\n'; inList = "bulleted"; }
      html += `<li>${renderRichText(block.bulleted_list_item.rich_text)}</li>\n`;
      continue;
    }
    if (type === "numbered_list_item") {
      if (inList !== "numbered") { closeList(); html += '<ol style="margin:12px 0 12px 24px;color:#b2b2b2;">\n'; inList = "numbered"; }
      html += `<li>${renderRichText(block.numbered_list_item.rich_text)}</li>\n`;
      continue;
    }
    closeList();

    switch (type) {
      case "paragraph":
        html += `<p style="margin-bottom:16px;color:#b2b2b2;font-family:'Inter',sans-serif;font-size:15px;line-height:1.75;">${renderRichText(block.paragraph.rich_text)}</p>\n`;
        break;
      case "heading_1":
        html += `<h2 style="font-size:28px;margin:48px 0 16px;letter-spacing:1px;text-transform:uppercase;">${renderRichText(block.heading_1.rich_text)}</h2>\n`;
        break;
      case "heading_2":
        html += `<h3 style="font-size:22px;margin:36px 0 12px;letter-spacing:0.5px;">${renderRichText(block.heading_2.rich_text)}</h3>\n`;
        break;
      case "heading_3":
        html += `<h4 style="font-size:18px;margin:28px 0 10px;color:#d0d0d0;">${renderRichText(block.heading_3.rich_text)}</h4>\n`;
        break;
      case "quote":
        html += `<blockquote style="border-left:3px solid rgba(255,255,255,0.2);padding:12px 20px;margin:20px 0;color:#b2b2b2;font-style:italic;">${renderRichText(block.quote.rich_text)}</blockquote>\n`;
        break;
      case "callout":
        html += `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px 20px;margin:20px 0;color:#b2b2b2;">${renderRichText(block.callout.rich_text)}</div>\n`;
        break;
      case "divider":
        html += `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:32px 0;">\n`;
        break;
      case "toggle":
        html += `<details style="margin:16px 0;"><summary style="cursor:pointer;font-weight:600;margin-bottom:8px;">${renderRichText(block.toggle.rich_text)}</summary></details>\n`;
        break;
      case "table":
        html += renderTable(block);
        break;
      case "code":
        html += `<pre style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:16px;overflow-x:auto;margin:20px 0;font-size:14px;line-height:1.6;"><code>${escapeHtml(block.code.rich_text.map(t => t.plain_text).join(""))}</code></pre>\n`;
        break;
      case "image":
        {
          const url = block.image.type === "external" ? block.image.external.url : block.image.file.url;
          const caption = block.image.caption ? renderRichText(block.image.caption) : "";
          html += `<figure style="margin:24px 0;text-align:center;"><img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" style="max-width:100%;border-radius:8px;"><figcaption style="font-size:13px;color:#888;margin-top:8px;">${caption}</figcaption></figure>\n`;
        }
        break;
      case "bookmark":
        {
          const bUrl = block.bookmark.url || "";
          html += `<a href="${escapeHtml(bUrl)}" target="_blank" rel="noopener" style="display:block;padding:14px 18px;margin:16px 0;border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#8ea3ff;text-decoration:none;font-size:14px;word-break:break-all;">${escapeHtml(bUrl)}</a>\n`;
        }
        break;
      default:
        break;
    }
  }
  closeList();
  return html;
}

function renderTable(block) {
  // Tables need children fetched separately; we store them in block.children
  if (!block.children || !block.children.length) return "";
  let html = '<div style="overflow-x:auto;margin:20px 0;"><table style="width:100%;border-collapse:collapse;font-size:14px;">\n';
  block.children.forEach((row, i) => {
    const tag = i === 0 && block.table.has_column_header ? "th" : "td";
    html += "<tr>\n";
    (row.table_row.cells || []).forEach((cell) => {
      const style =
        tag === "th"
          ? "padding:10px 14px;border-bottom:2px solid rgba(255,255,255,0.15);text-align:left;font-weight:600;"
          : "padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);color:#b2b2b2;";
      html += `<${tag} style="${style}">${renderRichText(cell)}</${tag}>\n`;
    });
    html += "</tr>\n";
  });
  html += "</table></div>\n";
  return html;
}

// ── Fetch all blocks (with pagination + table children) ──

async function fetchAllBlocks(pageId) {
  const blocks = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  // Fetch table row children
  for (const block of blocks) {
    if (block.type === "table" && block.has_children) {
      block.children = [];
      let tc;
      do {
        const tr = await notion.blocks.children.list({
          block_id: block.id,
          start_cursor: tc,
          page_size: 100,
        });
        block.children.push(...tr.results);
        tc = tr.has_more ? tr.next_cursor : undefined;
      } while (tc);
    }
  }
  return blocks;
}

// ── Query database ──────────────────────────────────────

async function fetchDatabase() {
  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

// ── HTML templates ──────────────────────────────────────

function listingPageHtml(papers) {
  // Category filter buttons
  const categoryFilters = CATEGORIES.map(
    (c) => `<button class="filter-btn" data-filter="cat-${slugify(c)}" style="border-color:${categoryColor(c)};">${escapeHtml(c)}</button>`
  ).join("\n                    ");

  const cardsHtml = papers
    .map((p) => {
      const cat = p.category;
      const catClass = `cat-${slugify(cat)}`;
      return `
                    <a href="research/${p.slug}.html" class="research-card ${catClass}">
                        <div class="card-top">
                            <span class="category-badge" style="color:${categoryColor(cat)};background:${categoryBg(cat)};">${escapeHtml(cat)}</span>
                        </div>
                        <div class="research-card__body">
                            <h3 class="research-card__title">${escapeHtml(p.title)}</h3>
                            <p class="research-card__desc">${escapeHtml(p.authors)}</p>
                        </div>
                        <div class="research-card__meta">
                            <span>${escapeHtml(p.studyYear || p.dateAdded || "")}</span>
                            <span>Read →</span>
                        </div>
                    </a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuroNest | Research Hub &amp; Neuroscience News</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/page-transitions.css">
    <style>
        :root {
            --bg-dark: #050505;
            --text-white: #ffffff;
            --text-grey: #b2b2b2;
            --glass-border: rgba(255, 255, 255, 0.12);
            --card-bg: rgba(255, 255, 255, 0.03);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg-dark); color: var(--text-white); line-height: 1.6; }
        a { color: inherit; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; padding: 20px 0; background: linear-gradient(to bottom, rgba(0,0,0,0.65), transparent); }
        .top-nav .container { display: flex; justify-content: space-between; align-items: center; }
        .nav-link { text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; }
        .hero { position: relative; min-height: 64vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
        .hero video { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 100%; height: 100%; object-fit: cover; z-index: -2; filter: brightness(0.6); }
        .hero::before { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: -1; }
        .hero h1 { font-size: clamp(34px, 7vw, 72px); line-height: 1.05; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
        .hero p { font-family: 'Inter', sans-serif; color: var(--text-grey); font-size: 16px; }
        .section-block { padding: 80px 0; }
        .section-block + .section-block { border-top: 1px solid var(--glass-border); }
        .section-label { margin-bottom: 18px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-grey); }
        .section-title { max-width: 760px; margin-bottom: 24px; font-size: clamp(28px, 4.5vw, 52px); line-height: 1.1; text-transform: uppercase; }
        .filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
        .filter-btn { background: transparent; border: 1px solid var(--glass-border); color: var(--text-grey); padding: 7px 16px; border-radius: 20px; font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
        .filter-btn:hover, .filter-btn.active { color: var(--text-white); border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }
        .sticky-subnav { position: sticky; top: 0; z-index: 90; background: rgba(5,5,5,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--glass-border); padding: 14px 0; }
        .sticky-subnav .container { display: flex; gap: 32px; align-items: center; }
        .subnav-link { text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1.8px; color: var(--text-grey); transition: color 0.2s ease; }
        .subnav-link:hover, .subnav-link.active { color: var(--text-white); }
        .research-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        .research-card { display: flex; flex-direction: row; align-items: center; text-decoration: none; padding: 20px 28px; border: 1px solid var(--glass-border); border-radius: 14px; background: var(--card-bg); transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease; gap: 24px; }
        .research-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }
        .research-card.hidden { display: none; }
        .card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 0; flex-shrink: 0; }
        .category-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
        .research-card__source { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: #8ea3ff; display: block; margin-bottom: 4px; }
        .research-card__body { flex: 1; min-width: 0; }
        .research-card__title { font-size: 20px; line-height: 1.3; margin-bottom: 6px; }
        .research-card__desc { font-family: 'Inter', sans-serif; color: var(--text-grey); font-size: 14px; margin-bottom: 0; }
        .research-card__meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; font-size: 12px; color: var(--text-grey); text-transform: uppercase; letter-spacing: 1px; flex-shrink: 0; white-space: nowrap; }
        .news-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .news-grid .research-card { flex-direction: column; align-items: stretch; padding: 24px; border-radius: 16px; gap: 0; }
        .news-grid .research-card__source { margin-bottom: 10px; }
        .news-grid .research-card__title { font-size: 22px; margin-bottom: 12px; }
        .news-grid .research-card__desc { font-size: 15px; margin-bottom: 16px; flex: 1; }
        .news-grid .research-card__meta { flex-direction: row; align-items: center; justify-content: space-between; white-space: normal; }
        @media (max-width: 900px) { .research-card { flex-direction: column; align-items: flex-start; } .research-card__meta { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; } .news-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header class="top-nav">
        <div class="container">
            <a href="index.html" class="nav-link">Home</a>
            <a href="neuroscience-news.html" class="nav-link">Research Hub</a>
        </div>
    </header>

    <main>
        <section class="hero">
            <video autoplay loop muted playsinline>
                <source src="assets/hero_banner.mp4" type="video/mp4">
            </video>
            <div class="container">
                <h1>Research Hub</h1>
                <p>Peer-reviewed findings, clinical updates, and research insights in auditory neuroscience.</p>
            </div>
        </section>

        <nav class="sticky-subnav">
            <div class="container">
                <a href="#research-insights" class="subnav-link active">Deep Research Insights</a>
                <a href="#neuroscience-news" class="subnav-link">Neuroscience News</a>
            </div>
        </nav>

        <!-- NeuroNest Research Database (from Notion) -->
        <section class="section-block" id="research-insights">
            <div class="container">
                <span class="section-label">NeuroNest Research Database</span>
                <h2 class="section-title">Deep Research Insights</h2>

                <div class="filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    ${categoryFilters}
                </div>

                <div class="research-grid" id="notion-grid">
${cardsHtml}
                </div>
            </div>
        </section>

        <!-- Neuroscience News — curated external sources -->
        <section class="section-block" id="neuroscience-news">
            <div class="container">
                <span class="section-label">Latest Research</span>
                <h2 class="section-title">Neuroscience News</h2>
                <div class="news-grid">
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11789498/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Brainwave Entrainment for Health: An Integrative Review</h3>
                        <p class="research-card__desc">A comprehensive review of brainwave entrainment as a noninvasive neuromodulation technique, covering improvements in pain management, sleep disturbances, mood disorders, and cognitive function.</p>
                        <div class="research-card__meta"><span>2025 · Integrative Review</span><span>Read →</span></div>
                    </a>
                    <a href="https://mental.jmir.org/2025/1/e63498" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">JMIR Mental Health</span>
                        <h3 class="research-card__title">Auditory Beat Stimulation for Anxiety Reduction</h3>
                        <p class="research-card__desc">Alpha-range (10 Hz) auditory beat stimulation demonstrates measurable anxiolytic effects. The study identifies 24-minute sessions with music-combined ABS as the optimal protocol.</p>
                        <div class="research-card__meta"><span>2025 · PLOS Mental Health</span><span>Read →</span></div>
                    </a>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/38566357/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PubMed · NIH.gov</span>
                        <h3 class="research-card__title">A Review of Binaural Beats and the Brain</h3>
                        <p class="research-card__desc">Examines ASSR responses to binaural beats originating in the auditory cortex during gamma-frequency stimulation. Demonstrates cortical activity synchronization via auditory stimuli.</p>
                        <div class="research-card__meta"><span>2024 · Peer-Reviewed</span><span>Read →</span></div>
                    </a>
                    <a href="https://www.jmir.org/2025/1/e57457" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">JMIR · Peer-Reviewed</span>
                        <h3 class="research-card__title">Sound Interventions and Physiological Stress Reduction</h3>
                        <p class="research-card__desc">Systematic review showing music, natural sounds, and speech can lower cortisol, improve heart rate variability, and decrease blood pressure in stressed adults.</p>
                        <div class="research-card__meta"><span>2025 · Systematic Review</span><span>Read →</span></div>
                    </a>
                    <a href="https://www.neurosciencenews.com/sound-alpha-brainwaves-sleep-27808/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">Neuroscience News</span>
                        <h3 class="research-card__title">Sound Can Stimulate Alpha Brain Waves to Improve Sleep</h3>
                        <p class="research-card__desc">Alpha Closed-Loop Auditory Stimulation (aCLAS) can manipulate alpha rhythms, offering a non-invasive approach for sleep disturbances including dementia-related insomnia.</p>
                        <div class="research-card__meta"><span>2024 · Neuroscience</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11612527/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">40 Hz Auditory Stimulation — Alzheimer's &amp; Cognition</h3>
                        <p class="research-card__desc">40 Hz gamma auditory stimulation reduces amyloid-beta levels and improves cognitive performance. Human trials demonstrate enhanced memory and decreased amyloid plaques.</p>
                        <div class="research-card__meta"><span>2024 · Clinical Research</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9245289/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Auditory Stimulation and Sleep Enhancement</h3>
                        <p class="research-card__desc">Closed-loop auditory stimulation during slow-wave sleep strengthens memory consolidation. Demonstrates phase-locked pink noise pulses enhance slow oscillation amplitude in healthy adults.</p>
                        <div class="research-card__meta"><span>2022 · Sleep Research</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10246882/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Gamma Sensory Stimulation in Dementia Patients</h3>
                        <p class="research-card__desc">Non-invasive 40 Hz sensory stimulation shows safety and feasibility in dementia patients. Six-month daily exposure demonstrates improved sleep-wake patterns and daily activity function.</p>
                        <div class="research-card__meta"><span>2023 · Alzheimer's &amp; Dementia</span><span>Read →</span></div>
                    </a>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/35219899/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PubMed · NIH.gov</span>
                        <h3 class="research-card__title">Music Therapy for Depression: A Meta-Analysis</h3>
                        <p class="research-card__desc">Meta-analysis of RCTs demonstrating music therapy significantly reduces depressive symptoms. Active music-making and receptive listening both show moderate-to-large effect sizes.</p>
                        <div class="research-card__meta"><span>2022 · Meta-Analysis</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8395478/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Brown Noise and Attention in ADHD</h3>
                        <p class="research-card__desc">Low-frequency noise exposure improves sustained attention and cognitive performance in individuals with attention deficits. Demonstrates stochastic resonance effects on suboptimal neural arousal.</p>
                        <div class="research-card__meta"><span>2021 · Cognitive Science</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7382600/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">Frontiers in Neuroscience</span>
                        <h3 class="research-card__title">Isochronic Tones and Cortical Entrainment</h3>
                        <p class="research-card__desc">Isochronic auditory stimulation drives cortical frequency-following responses more reliably than binaural beats. EEG-measured entrainment strongest at gamma (40 Hz) frequencies.</p>
                        <div class="research-card__meta"><span>2020 · Neuroscience</span><span>Read →</span></div>
                    </a>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/36208890/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PubMed · NIH.gov</span>
                        <h3 class="research-card__title">Nature Sounds Reduce Stress and Anxiety</h3>
                        <p class="research-card__desc">Natural soundscapes significantly reduce cortisol levels and self-reported anxiety scores. Running water and birdsong show the strongest parasympathetic nervous system activation.</p>
                        <div class="research-card__meta"><span>2022 · Environmental Psychology</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10025005/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">White Noise Improves Sleep Quality in Hospital ICU</h3>
                        <p class="research-card__desc">White noise machines improve sleep quality scores in ICU patients. Reduces nighttime awakenings and perceived noise disruption compared to controls in randomised trial.</p>
                        <div class="research-card__meta"><span>2023 · Clinical Sleep Medicine</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9516372/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Theta-Range Binaural Beats Enhance Creative Thinking</h3>
                        <p class="research-card__desc">Theta-frequency binaural beats (6 Hz) enhance divergent thinking on creative tasks. EEG confirms increased frontal theta power correlated with improved ideation fluency.</p>
                        <div class="research-card__meta"><span>2022 · Creativity Research</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10574508/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">PMC · NIH.gov</span>
                        <h3 class="research-card__title">Heart Rate Variability Response to Sound Frequencies</h3>
                        <p class="research-card__desc">Specific auditory frequencies modulate autonomic nervous system function. Low-frequency tones increase vagal tone and HRV, supporting parasympathetic recovery protocols.</p>
                        <div class="research-card__meta"><span>2023 · Psychophysiology</span><span>Read →</span></div>
                    </a>
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9321296/" target="_blank" rel="noopener" class="research-card">
                        <span class="research-card__source">Frontiers in Psychology</span>
                        <h3 class="research-card__title">Neuroplasticity and Repeated Auditory Stimulation</h3>
                        <p class="research-card__desc">Repeated exposure to structured auditory stimuli drives measurable cortical reorganisation. Long-term sound-based training enhances auditory processing speed and cross-frequency coupling.</p>
                        <div class="research-card__meta"><span>2022 · Neuroplasticity</span><span>Read →</span></div>
                    </a>
                </div>
            </div>
        </section>
    </main>
    <script src="assets/page-transitions.js"></script>
    <script>
        (function () {
            // Category filter buttons
            var btns = document.querySelectorAll('.filter-btn');
            var cards = document.querySelectorAll('#notion-grid .research-card');
            btns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    btns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    var f = btn.getAttribute('data-filter');
                    cards.forEach(function (card) {
                        if (f === 'all' || card.classList.contains(f)) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    });
                });
            });

            // Sticky subnav active state on scroll
            var sections = document.querySelectorAll('.section-block[id]');
            var subnavLinks = document.querySelectorAll('.subnav-link');
            function updateSubnav() {
                var scrollY = window.scrollY + 120;
                sections.forEach(function (sec) {
                    if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
                        subnavLinks.forEach(function (l) { l.classList.remove('active'); });
                        var active = document.querySelector('.subnav-link[href="#' + sec.id + '"]');
                        if (active) active.classList.add('active');
                    }
                });
            }
            window.addEventListener('scroll', updateSubnav);
            updateSubnav();

            // Smooth scroll for subnav anchors
            subnavLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    var target = document.querySelector(this.getAttribute('href'));
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        })();
    </script>
</body>
</html>`;
}

function paperPageHtml(paper, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(paper.title)} | NeuroNest Research</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/page-transitions.css">
    <style>
        :root { --bg-dark: #050505; --text-white: #ffffff; --text-grey: #b2b2b2; --glass-border: rgba(255,255,255,0.12); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg-dark); color: var(--text-white); line-height: 1.6; }
        a { color: inherit; }
        .top-bar { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; padding: 20px 24px; background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent); display: flex; justify-content: space-between; align-items: center; }
        .nav-link { text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; }
        .article { max-width: 820px; margin: 0 auto; padding: 140px 24px 100px; }
        .meta-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 32px; }
        .meta-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; padding: 4px 12px; border-radius: 20px; border: 1px solid var(--glass-border); color: var(--text-grey); }
        .category-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; }
        h1 { font-size: clamp(28px, 5vw, 44px); line-height: 1.15; margin-bottom: 16px; }
        .authors { font-family: 'Inter', sans-serif; color: var(--text-grey); font-size: 15px; margin-bottom: 40px; }
        .body-content { font-family: 'Inter', sans-serif; }
        .back-link { display: inline-block; margin-top: 60px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #8ea3ff; text-decoration: none; border: 1px solid rgba(142,163,255,0.3); padding: 10px 24px; border-radius: 24px; transition: all 0.2s ease; }
        .back-link:hover { background: rgba(142,163,255,0.1); border-color: rgba(142,163,255,0.6); }
    </style>
</head>
<body>
    <header class="top-bar">
        <a href="../neuroscience-news.html" class="nav-link">← Research Hub</a>
        <a href="../index.html" class="nav-link">Home</a>
    </header>
    <article class="article">
        <div class="meta-bar">
            <span class="category-badge" style="color:${categoryColor(paper.category)};background:${categoryBg(paper.category)};">${escapeHtml(paper.category)}</span>
            ${paper.series.map((s) => `<span class="meta-tag">${escapeHtml(s)}</span>`).join("")}
            ${paper.studyYear ? `<span class="meta-tag">${escapeHtml(paper.studyYear)}</span>` : ""}
        </div>
        <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-grey);margin-bottom:12px;">Research Insight</span>
        <h1>${escapeHtml(paper.title)}</h1>
        <p class="authors">${escapeHtml(paper.authors)}</p>
        <div class="body-content">
            ${bodyHtml}
        </div>
        <a href="../neuroscience-news.html" class="back-link">← Back to Research Hub</a>
    </article>
    <script src="../assets/page-transitions.js"></script>
</body>
</html>`;
}

// ── Main build ──────────────────────────────────────────

async function main() {
  console.log("Fetching research database from Notion...");
  const pages = await fetchDatabase();
  console.log(`Found ${pages.length} pages.`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const papers = [];

  for (const page of pages) {
    const title = getTitle(page, "Paper Title") || getTitle(page, "Name") || "Untitled";
    const authors = getRichText(page, "Authors");
    const contentAngle = getRichText(page, "Content Angle");
    const confidence = getSelect(page, "Confidence");
    const dateAdded = getDate(page, "date") || getDate(page, "Date Added");
    const series = getMultiSelect(page, "Content Series");
    const status = getSelect(page, "Status");
    const studyYear = getRichText(page, "Study Year");
    const slug = slugify(title) || page.id;

    const paper = { title, authors, contentAngle, confidence, dateAdded, series, status, studyYear, slug, id: page.id };
    paper.category = inferCategory(paper);
    papers.push(paper);

    // Fetch page body blocks
    console.log(`  → Fetching blocks for: ${title}`);
    const blocks = await fetchAllBlocks(page.id);
    const bodyHtml = renderBlocks(blocks);

    // Write individual page
    const pageHtml = paperPageHtml(paper, bodyHtml);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), pageHtml, "utf8");
  }

  // Sort by date (newest first)
  papers.sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));

  // Write listing page — overwrites neuroscience-news.html
  const listingHtml = listingPageHtml(papers);
  fs.writeFileSync(path.join(__dirname, "..", "neuroscience-news.html"), listingHtml, "utf8");

  console.log(`\nDone! Generated ${papers.length} paper pages in /research/ and updated neuroscience-news.html`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
