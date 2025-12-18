import * as monaco from 'https://esm.sh/monaco-editor';
import editorWorker from 'https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'https://esm.sh/monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'https://esm.sh/monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'https://esm.sh/monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'https://esm.sh/monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Setup Monaco Environment
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return tsWorker();
    }
    return editorWorker();
  }
};

export class EditorManager {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private models: {
    html: monaco.editor.ITextModel;
    css: monaco.editor.ITextModel;
    js: monaco.editor.ITextModel;
  };

  constructor(container: HTMLElement, initialValues: { html: string; css: string; js: string }, onChange: () => void) {
        
    // Create models
    this.models = {
      html: monaco.editor.createModel(initialValues.html, 'html'),
      css: monaco.editor.createModel(initialValues.css, 'css'),
      js: monaco.editor.createModel(initialValues.js, 'javascript'),
    };

    // Listen to changes
    this.models.html.onDidChangeContent(onChange);
    this.models.css.onDidChangeContent(onChange);
    this.models.js.onDidChangeContent(onChange);

    // Create Editor
    this.editor = monaco.editor.create(container, {
      model: this.models.html,
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    });
  }

  setLanguage(lang: 'html' | 'css' | 'js') {
    this.editor.setModel(this.models[lang]);
    this.editor.focus();
  }

  getValues() {
    return {
      html: this.models.html.getValue(),
      css: this.models.css.getValue(),
      js: this.models.js.getValue(),
    };
  }

  setValue(lang: 'html' | 'css' | 'js', value: string) {
    const model = this.models[lang];
    if (model.getValue() !== value) {
      model.setValue(value);
    }
  }
  
  layout() {
      this.editor.layout();
  }
}
