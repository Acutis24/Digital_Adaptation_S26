document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('statement-container');
    const bylineEl  = document.getElementById('statement-byline');

    fetch('statement.txt')
        .then(r => {
            if (!r.ok) throw new Error('Could not load statement.txt');
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

            // Byline: Author — Course — Date
            const [author, , course, date] = header;
            if (bylineEl && author) {
                bylineEl.textContent = [author, course, date].filter(Boolean).join(' — ');
            }

            // Skip the "Rhetorical Statement" title line (already in the HTML)
            while (cursor < lines.length && !lines[cursor].trim()) cursor++;
            if (cursor < lines.length) cursor++; // skip title line

            // Render remaining lines: short standalone lines become subheadings
            const remaining = lines.slice(cursor);
            let html = '';
            for (const line of remaining) {
                const t = line.trim();
                if (!t) continue;
                // A heading is a short line with no sentence-ending punctuation
                if (t.length < 60 && !t.endsWith('.') && !t.endsWith(',') && !t.endsWith(';')) {
                    html += `<h2 class="section-heading">${escapeHtml(t)}</h2>`;
                } else {
                    html += `<p>${escapeHtml(t)}</p>`;
                }
            }

            container.innerHTML = html || '<p class="status">No content found.</p>';
        })
        .catch(err => {
            container.innerHTML = `<p class="error">${escapeHtml(String(err))}</p>`;
        });
});

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
}
