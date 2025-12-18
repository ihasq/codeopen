export const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    border: 1px solid #ccc;
    box-sizing: border-box;
    overflow: hidden;
    background: #1e1e1e; /* Matches Monaco dark theme default */
    color: #fff;
  }

  .container {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .container.layout-top {
    flex-direction: column;
  }

  .container.layout-left {
    flex-direction: row;
  }

  .editor-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    border-right: 1px solid #333;
  }

  .container.layout-top .editor-pane {
    border-right: none;
    border-bottom: 1px solid #333;
  }

  .preview-pane {
    flex: 1;
    min-width: 0;
    min-height: 0;
    background: white;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .tabs {
    display: flex;
    background: #252526;
    border-bottom: 1px solid #1e1e1e;
  }

  .tab {
    padding: 8px 16px;
    cursor: pointer;
    background: #2d2d2d;
    color: #999;
    border: none;
    border-right: 1px solid #1e1e1e;
    font-size: 12px;
  }

  .tab:hover {
    background: #3e3e42;
  }

  .tab.active {
    background: #1e1e1e;
    color: #fff;
  }

  .monaco-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
`;
