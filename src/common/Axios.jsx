import axios from 'axios';

// const BASE_URL = '/api';

export const api = axios.create({
    baseURL: "/api",
    timeout: 4000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    // withCredentials: true
});

export const openApi = axios.create({
    baseURL: "/openApi",
    timeout: 4000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

export const boardApi = axios.create({
    baseURL: "/api",
    timeout: 4000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// export const Api = axios.create({
//     baseURL: "/Api",
//     timeout: 4000,
//     headers: { 'Content-Type': 'application/json'}
// });
