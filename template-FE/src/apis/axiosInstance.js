import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://smartandonsys.web.app',
    timeout: 10000,
})