const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

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
  const seriesSet = new Set();
  papers.forEach((p) => p.series.forEach((s) => seriesSet.add(s)));
  const seriesList = [...seriesSet].sort();

  const filterOptionsHtml = [
    `<button class="filter-btn active" data-filter="all">All</button>`,
    ...seriesList.map(
      (s) =>
        `<button class="filter-btn" data-filter="series-${slugify(s)}">${escapeHtml(s)}</button>`
    ),
    `<button class="filter-btn" data-filter="conf-high" style="border-color:${confidenceColor("high")};">High Confidence</button>`,
    `<button class="filter-btn" data-filter="conf-moderate" style="border-color:${confidenceColor("moderate")};">Moderate</button>`,
    `<button class="filter-btn" data-filter="conf-low" style="border-color:${confidenceColor("low")};">Low</button>`,
  ].join("\n                    ");

  const cardsHtml = papers
    .map((p) => {
      const seriesClasses = p.series.map((s) => `series-${slugify(s)}`).join(" ");
      const confClass = `conf-${slugify(p.confidence)}`;
      return `
                    <a href="research/${p.slug}.html" class="research-card ${seriesClasses} ${confClass}">
                        <div class="card-top">
                            <span class="research-card__source">${escapeHtml(p.series.join(" · ") || "Research")}</span>
                            <span class="confidence-badge" style="color:${confidenceColor(p.confidence)};background:${confidenceBg(p.confidence)};">${escapeHtml(p.confidence || "—")}</span>
                        </div>
                        <h3 class="research-card__title">${escapeHtml(p.title)}</h3>
                        <p class="research-card__desc">${escapeHtml(p.authors)}</p>
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
    <title>NeuroNest | Research Hub</title>
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
        .news-section { padding: 80px 0 110px; }
        .news-heading { margin-bottom: 18px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-grey); }
        .news-title { max-width: 760px; margin-bottom: 24px; font-size: clamp(28px, 4.5vw, 52px); line-height: 1.1; text-transform: uppercase; }
        .filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
        .filter-btn { background: transparent; border: 1px solid var(--glass-border); color: var(--text-grey); padding: 7px 16px; border-radius: 20px; font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
        .filter-btn:hover, .filter-btn.active { color: var(--text-white); border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }
        .research-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .research-card { display: flex; flex-direction: column; text-decoration: none; padding: 24px; border: 1px solid var(--glass-border); border-radius: 16px; background: var(--card-bg); transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
        .research-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }
        .research-card.hidden { display: none; }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .research-card__source { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: #8ea3ff; }
        .confidence-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
        .research-card__title { font-size: 23px; line-height: 1.3; margin-bottom: 12px; }
        .research-card__desc { font-family: 'Inter', sans-serif; color: var(--text-grey); font-size: 15px; margin-bottom: 16px; flex: 1; }
        .research-card__meta { display: flex; justify-content: space-between; gap: 16px; font-size: 12px; color: var(--text-grey); text-transform: uppercase; letter-spacing: 1px; }
        @media (max-width: 900px) { .research-grid { grid-template-columns: 1fr; } .news-section { padding-top: 56px; } }
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
                <p>Deep investigations into peer-reviewed auditory neuroscience — powered by our Notion research database.</p>
            </div>
        </section>

        <section class="news-section">
            <div class="container">
                <span class="news-heading">Notion Research Database</span>
                <h2 class="news-title">Deep Investigations</h2>

                <div class="filters">
                    ${filterOptionsHtml}
                </div>

                <div class="research-grid">
${cardsHtml}
                </div>
            </div>
        </section>
    </main>
    <script src="assets/page-transitions.js"></script>
    <script>
        (function () {
            var btns = document.querySelectorAll('.filter-btn');
            var cards = document.querySelectorAll('.research-card');
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
        .confidence-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; }
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
            ${paper.series.map((s) => `<span class="meta-tag">${escapeHtml(s)}</span>`).join("")}
            <span class="confidence-badge" style="color:${confidenceColor(paper.confidence)};background:${confidenceBg(paper.confidence)};">${escapeHtml(paper.confidence || "—")}</span>
            ${paper.studyYear ? `<span class="meta-tag">${escapeHtml(paper.studyYear)}</span>` : ""}
        </div>
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
