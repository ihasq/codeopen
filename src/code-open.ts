import { styles } from './style';
import { EditorManager } from './editor';
import { updatePreview, debounce } from './preview';

export class CodeOpen extends HTMLElement {
  private shadow: ShadowRoot;
  private editorManager!: EditorManager;
  private iframe!: HTMLIFrameElement;
  private container!: HTMLElement;

  static get observedAttributes() {
    return ['html', 'css', 'js', 'layout'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initializeEditor();
    this.setupResizeObserver();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'layout') {
      this.updateLayout(newValue);
    } else if (this.editorManager && ['html', 'css', 'js'].includes(name)) {
      this.editorManager.setValue(name as 'html' | 'css' | 'js', newValue);
    }
  }

  private render() {
    this.shadow.innerHTML = `
      <link rel="stylesheet" href="https://esm.sh/monaco-editor/min/vs/editor/editor.main.css"/>
      <style>${styles}</style>
      <div class="container layout-left" id="container">
        <div class="editor-pane">
          <div class="tabs">
            <button class="tab active" data-lang="html">HTML</button>
            <button class="tab" data-lang="css">CSS</button>
            <button class="tab" data-lang="js">JS</button>
          </div>
          <div class="monaco-container" id="monaco-container"></div>
        </div>
        <div class="preview-pane">
          <iframe></iframe>
        </div>
      </div>
    `;

    this.container = this.shadow.getElementById('container') as HTMLElement;
    this.iframe = this.shadow.querySelector('iframe') as HTMLIFrameElement;
    
    // Tab switching
    const tabs = this.shadow.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const lang = target.getAttribute('data-lang') as 'html' | 'css' | 'js';
        this.switchTab(lang);
      });
    });

    // Handle initial layout
    const layout = this.getAttribute('layout');
    if (layout) this.updateLayout(layout);
  }

  private initializeEditor() {
    const monacoContainer = this.shadow.getElementById('monaco-container') as HTMLElement;
    
    const initialValues = {
      html: this.getAttribute('html') || '',
      css: this.getAttribute('css') || '',
      js: this.getAttribute('js') || '',
    };

    const debouncedUpdate = debounce(() => this.triggerPreviewUpdate(), 500);

    this.editorManager = new EditorManager(monacoContainer, initialValues, () => {
      // Sync values back to attributes? 
      // Maybe not setting attributes to avoid loops, but we can emit events.
      debouncedUpdate();
    });

    // Initial preview
    this.triggerPreviewUpdate();
  }

  private switchTab(lang: 'html' | 'css' | 'js') {
    this.shadow.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.shadow.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
    this.editorManager.setLanguage(lang);
  }

  private updateLayout(layout: string) {
    if (!this.container) return;
    this.container.classList.remove('layout-left', 'layout-right', 'layout-top', 'layout-bottom');
    this.container.classList.add(`layout-${layout}`);
    
    // Trigger editor relayout after transition (if any) or immediately
    setTimeout(() => this.editorManager?.layout(), 50);
  }

  private triggerPreviewUpdate() {
    const values = this.editorManager.getValues();
    updatePreview(this.iframe, values.html, values.css, values.js);
    
    // Emit change event
    this.dispatchEvent(new CustomEvent('change', { detail: values }));
  }

  private setupResizeObserver() {
      const observer = new ResizeObserver(() => {
          this.editorManager?.layout();
      });
      observer.observe(this);
  }

  // Public Getters/Setters
  get html() { return this.editorManager?.getValues().html || ''; }
  set html(val) { this.setAttribute('html', val); }

  get css() { return this.editorManager?.getValues().css || ''; }
  set css(val) { this.setAttribute('css', val); }

  get js() { return this.editorManager?.getValues().js || ''; }
  set js(val) { this.setAttribute('js', val); }
}
