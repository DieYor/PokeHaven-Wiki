document.addEventListener('DOMContentLoaded', () => {
  const article = document.querySelector('.article');
  const toc = document.getElementById('toc');
  const tocOl = toc && toc.querySelector('ol');
  if (!article || !toc || !tocOl) return;
  if (article.dataset.hideToc === 'true') { toc.remove(); return; }

  // Only real article section headings — skip hub cards, heroes, nested widgets
  const heads = [...article.querySelectorAll('h2')].filter((h) => {
    if (h.closest('.toc-box, .hub-card, .hero, .navbox, .infobox, .figure')) return false;
    if (h.classList.contains('article-title')) return false;
    return true;
  });

  if (heads.length < 2) { toc.remove(); return; }

  heads.forEach((h, i) => {
    if (!h.id) {
      h.id = 'sec-' + i + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocOl.appendChild(li);
  });
});
