document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('essay-container');
    const bylineEl  = document.getElementById('article-byline');

    fetch('essay.txt')
        .then(r => {
            if (!r.ok) throw new Error('Could not load essay.txt');
            return r.text();
        })
        .then(text => {
            const lines = text.split(/\r?\n/);

            // Extract MLA header: first 4 non-empty lines
            const header = [];
            let cursor = 0;
            while (header.length < 4 && cursor < lines.length) {
                if (lines[cursor].trim()) header.push(lines[cursor].trim());
                cursor++;
            }

            // Find the Works Cited divider
            const wcIdx = lines.findIndex(l => l.trim() === 'Works Cited');

            // Essay body: non-empty lines between header and Works Cited
            const bodyLines = lines
                .slice(cursor, wcIdx > -1 ? wcIdx : undefined)
                .filter(l => l.trim());

            // Byline: Author — Course — Date  (skip professor name)
            const [author, , course, date] = header;
            if (bylineEl && author) {
                bylineEl.textContent = [author, course, date].filter(Boolean).join(' — ');
            }

            if (!bodyLines.length) {
                container.innerHTML = '<p class="status">No essay content found.</p>';
                return;
            }

            container.innerHTML = bodyLines
                .map(p => `<p>${escapeHtml(p)}</p>`)
                .join('');
        })
        .catch(err => {
            let msg = escapeHtml(String(err));
            if (window.location.protocol === 'file:') {
                msg += ' — View the site via GitHub Pages or a local server, not directly from the file system.';
            }
            container.innerHTML = `<p class="error">${msg}</p>`;
        });
});

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
}
