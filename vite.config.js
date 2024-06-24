import {defineConfig} from 'vite'
import {resolve} from 'path'
import react from "@vitejs/plugin-react";

export default defineConfig({
    // logLevel: 'info', 
    // logLevel: "debug" ,
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
                // target: 'https://www.pettravel.kr', //'http://localhost:8999/api',
                // target: 'http://localhost:8999/api',
                target: 'http://localhost:8999',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                // configure: (proxy, _options) => {
                //     proxy.on("error", (err, _req, _res) => {
                //       console.log("proxy error", err);// vite --debug
                //     });
                //     proxy.on("proxyReq", (proxyReq, req, _res) => {
                //       console.log(  
                //         "Sending Request:",
                //         req.method,
                //         req.url,
                //         " => TO THE TARGET =>  ",
                //         proxyReq.method,
                //         proxyReq.protocol,
                //         proxyReq.host,
                //         proxyReq.path,
                //         JSON.stringify(proxyReq.getHeaders()),
                //       );
                //     });
                //     proxy.on("proxyRes", (proxyRes, req, _res) => {
                //       console.log(
                //         "Received Response from the Target:",
                //         proxyRes.statusCode,
                //         req.url,
                //         JSON.stringify(proxyRes.headers),
                //       );
                //     });
                //   }
            },
            '/openApi': {
                target: 'https://www.pettravel.kr', //'http://localhost:8999/auth',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/openApi/, ''),
                
            // '/Api': {
            //     target: 'http://localhost:8999/Api', //http://localhost:8999/Api'
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/Api/, '')
            // }
            },
            '/boardApi': {
                target: 'http://localhost:8999/api', //'http://localhost:8999/api',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/boardApi/, ''),
            },

                




            
        }
    }
    
});
