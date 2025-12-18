import { CodeOpen } from './code-open';

if (!customElements.get('code-open')) {
  customElements.define('code-open', CodeOpen);
}

export { CodeOpen };
