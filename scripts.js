document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('essay-container');

    fetch('essay.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load essay.txt');
            }
            return response.text();
        })
        .then(text => {
            if (!text.trim()) {
                container.innerHTML = '<p class="empty">The essay file is empty. Edit <code>essay.txt</code> and refresh.</p>';
                return;
            }

            const paragraphs = text
                .trim()
                .split(/\r?\n\r?\n/)
                .map(paragraph => `<p>${escapeHtml(paragraph.trim()).replace(/\r?\n/g, '<br>')}</p>`)
                .join('');

            container.innerHTML = paragraphs;
        })
        .catch(error => {
            let message = `Unable to load essay: ${escapeHtml(error.message)}`;
            if (window.location.protocol === 'file:') {
                message += ' (If you opened this page directly from your file system, some browsers block loading local files. Use a local web server or GitHub Pages.)';
            }
            container.innerHTML = `<p class="error">${message}</p>`;
        });
});

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}
