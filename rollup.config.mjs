import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import run from '@rollup/plugin-run';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.ROLLUP_WATCH === 'true';
const watchExternal = {
  name: 'watch-external',
  buildStart() {
    this.addWatchFile(path.resolve(__dirname, '.env'));
    this.addWatchFile(path.resolve(__dirname, '.env.dev'));
  },
};

export default defineConfig({
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].mjs',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: isDev,
  },
  plugins: [
    typescript(),
    isDev && watchExternal,
    isDev && run({ execArgv: ['-r', 'source-map-support/register'] }),
  ],
});
