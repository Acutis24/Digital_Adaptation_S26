document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('wc-container');

    fetch('essay.txt')
        .then(r => {
            if (!r.ok) throw new Error('Could not load essay.txt');
            return r.text();
        })
        .then(text => {
            const lines = text.split(/\r?\n/);
            const wcIdx = lines.findIndex(l => l.trim() === 'Works Cited');

            if (wcIdx === -1) {
                container.innerHTML = '<p class="status">No Works Cited section found in essay.txt.</p>';
                return;
            }

            const entries = lines.slice(wcIdx + 1).filter(l => l.trim());

            if (!entries.length) {
                container.innerHTML = '<p class="status">Works Cited section is empty.</p>';
                return;
            }

            container.innerHTML = entries
                .map(e => `<p class="wc-entry">${escapeHtml(e)}</p>`)
                .join('');
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
