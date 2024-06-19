import {defineConfig} from 'vite'
import {resolve} from 'path'
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react()
    ],
    //절대경로 사용을 위한 설정
    //모든 경로 사용시 prefix로 @ 붙임
    resolve: {
        alias: [
            {find:'@', replacement: resolve(__dirname, './src')}
        ],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080/neighbor-api', //'http://localhost:8999/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/auth': {
                target: 'http://localhost:8080/auth', //'http://localhost:8999/auth',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/auth/, '')
            }
        }
    }
});
