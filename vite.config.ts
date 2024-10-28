import { defineConfig } from 'vite';

export default defineConfig({
    base: '/pixi-typescript/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    publicDir: 'public',
});
