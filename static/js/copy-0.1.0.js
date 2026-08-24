/*! copy.js v0.1.0 — copy-to-clipboard buttons for elements marked with data-copy */

// Block scope keeps every declaration out of the shared global scope.
{
  const RESTORE_MS = 1500;

  const COPY_ICON =
    '<svg class="icon-copy" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';

  const CHECK_ICON =
    '<svg class="icon-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';

  const write = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts (plain-HTTP previews)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } finally {
      textarea.remove();
    }
    return Promise.resolve();
  };

  const attach = (el) => {
    // Capture before the button is appended so its markup never leaks into the text
    const text = el.getAttribute('data-copy') || el.textContent.trim();

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.setAttribute('aria-label', 'Copy to clipboard');
    button.innerHTML = COPY_ICON + CHECK_ICON;

    let timer;
    button.addEventListener('click', () => {
      write(text).then(() => {
        button.classList.add('copied');
        button.setAttribute('aria-label', 'Copied');
        clearTimeout(timer);
        timer = setTimeout(() => {
          button.classList.remove('copied');
          button.setAttribute('aria-label', 'Copy to clipboard');
        }, RESTORE_MS);
      });
    });

    el.appendChild(button);
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-copy]').forEach(attach);
  });
}
