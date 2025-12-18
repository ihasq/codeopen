import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'CodeOpen',
      fileName: (format) => `codeopen.${format}.js`
    },
    rollupOptions: {
        output: {
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
            }
        }
    }
  }
});
