import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import devkit from '@nx/devkit';
import copyFiles from 'vite-plugin-copy-files'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/libs-astro-fluid-design',
  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: devkit.joinPathFragments(__dirname, 'tsconfig.json'),
      skipDiagnostics: true
    }),
    viteTsConfigPaths({
      root: '../../',
    }),
    copyFiles({
      include: [/\.(astro)$/],
      exclude: [/node_modules/],
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      name: 'libs-astro-fluid-design',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/\.(astro)$/],
    },
  },
});
