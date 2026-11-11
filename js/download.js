(() => {
  'use strict';
  const files = Object.freeze({
    'pt-BR': 'assets/cv/Richard_Marlon_Balestrim_CV_PT.pdf',
    'es-AR': 'assets/cv/Richard_Marlon_Balestrim_CV_ES.pdf',
    en: 'assets/cv/Richard_Marlon_Balestrim_CV_EN.pdf',
  });
  const link = document.querySelector('.download-button');
  const status = document.querySelector('#download-status');
  let language = 'pt-BR';
  let requestId = 0;
  let controller;

  function setLanguage(next) {
    language = Object.hasOwn(files, next) ? next : 'pt-BR';
    requestId++;
    controller?.abort();
    controller = undefined;
    link.removeAttribute('aria-busy');
    link.setAttribute('href', files[language]);
    link.setAttribute('download', files[language].split('/').pop());
    link.setAttribute('hreflang', language);
    status.hidden = true;
    status.textContent = '';
  }

  link.addEventListener('click', async event => {
    // file:// cannot fetch sibling files. Keep its native, language-specific link.
    if (window.location.protocol === 'file:') return;
    event.preventDefault();
    if (controller) return;
    const selected = language;
    const current = ++requestId;
    const activeController = new AbortController();
    controller = activeController;
    const timeout = window.setTimeout(() => activeController.abort(), 15000);
    link.setAttribute('aria-busy', 'true');
    status.hidden = true;
    try {
      // Fetch once: missing files and HTML error pages never become downloads.
      const response = await window.fetch(files[selected], { signal: activeController.signal, cache: 'no-cache' });
      if (!response.ok) throw new Error('Unavailable PDF');
      const blob = await response.blob();
      if (blob.size < 5 || await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Invalid PDF response');
      if (current !== requestId) return;
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const download = document.createElement('a');
      download.href = url;
      download.download = files[selected].split('/').pop();
      download.hidden = true;
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch {
      if (current !== requestId) return;
      status.textContent = window.CV_LOCALES[selected].downloadUnavailable;
      status.hidden = false;
    } finally {
      window.clearTimeout(timeout);
      if (current === requestId) {
        controller = undefined;
        link.removeAttribute('aria-busy');
      }
    }
  });
  window.CVDownload = { setLanguage };
  setLanguage('pt-BR');
})();
