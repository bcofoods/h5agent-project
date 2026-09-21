import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
    server: {
        port: 20000,
        host: "0.0.0.0",
        proxy: {
            '/api': {
                target: 'http://localhost:30000',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        react({
            jsxRuntime: "classic"
        }),
    ],
    build: {
        rollupOptions: {
            external: ["react"],
            output: {
                globals: {
                    react: "React"
                }
            }
        },
        minify: false,
        sourcemap: true,
        cssCodeSplit: true
    }
}));