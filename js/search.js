function scoreEntry(entry, tokens) {
  const title = (entry.title || '').toLowerCase();
  const blurb = (entry.blurb || '').toLowerCase();
  const keys = (entry.keywords || '').toLowerCase();
  const hay = title + ' ' + blurb + ' ' + keys;
  let score = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return -1;
    if (title === t) score += 50;
    else if (title.includes(t)) score += 20;
    else if (keys.split(/\s+/).includes(t)) score += 12;
    else if (blurb.includes(t)) score += 6;
    else score += 3;
  }
  return score;
}

async function loadSearchIndex() {
  if (Array.isArray(window.WIKI_SEARCH_DATA) && window.WIKI_SEARCH_DATA.length) {
    return window.WIKI_SEARCH_DATA;
  }
  const indexUrl = window.WIKI_SEARCH_INDEX || ((window.WIKI_PREFIX || '') + 'data/search-index.json');
  try {
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('Wiki search index failed to load', e);
    return [];
  }
}

async function initSearch() {
  const input = document.getElementById('wiki-search');
  const box = document.getElementById('wiki-search-results');
  if (!input || !box) return;
  const pagePrefix = window.WIKI_PAGE_PREFIX ?? '';
  const index = await loadSearchIndex();

  function render(q) {
    const query = q.trim().toLowerCase();
    if (!query) { box.classList.remove('open'); box.innerHTML = ''; return; }
    if (!index.length) {
      box.innerHTML = '<div class="search-empty">Search index not loaded — hard-refresh the page.</div>';
      box.classList.add('open');
      return;
    }
    const tokens = query.split(/\s+/).filter(Boolean);
    const hits = index
      .map((p) => ({ p, s: scoreEntry(p, tokens) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s || a.p.title.localeCompare(b.p.title))
      .slice(0, 12)
      .map((x) => x.p);
    box.innerHTML = hits.length
      ? hits.map((h) =>
          '<a href="' + pagePrefix + h.href + '"><strong>' + h.title + '</strong><span class="meta">' +
          (h.blurb || '') + '</span></a>'
        ).join('')
      : '<div class="search-empty">No results</div>';
    box.classList.add('open');
  }

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('focus', () => { if (input.value) render(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
  });
  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('open');
  });
}
document.addEventListener('DOMContentLoaded', initSearch);
