import {defineConfig, loadEnv} from 'vite'
import {join} from 'path';
import vue from '@vitejs/plugin-vue'

export default defineConfig(({command, mode}) => {
  const root = process.cwd();
  return {
    resolve: {
      alias: {
        '@': join(root, "src"),
      }
    },
    plugins: [vue()]
  }
})
