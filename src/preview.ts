export function updatePreview(iframe: HTMLIFrameElement, html: string, css: string, js: string) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.error(err);
    }
  </script>
</body>
</html>`;

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Revoke old URL to avoid memory leaks if it exists
  const oldUrl = iframe.getAttribute('src');
  if (oldUrl && oldUrl.startsWith('blob:')) {
    URL.revokeObjectURL(oldUrl);
  }

  iframe.src = url;
}

export function debounce(func: Function, wait: number) {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
