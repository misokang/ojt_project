import axios from 'axios';

// const BASE_URL = '/api';
export const api = axios.create({
    baseURL: "/api",
    timeout: 4000,
    headers: { 'Content-Type': 'application/json' },
});

export const openApi = axios.create({
    baseURL: "/opeApi",
    timeout: 4000,
    headers: { 'Content-Type': 'application/json' },
})
