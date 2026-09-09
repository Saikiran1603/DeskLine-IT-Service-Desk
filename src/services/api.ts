 import axios from 'axios' 
// JSON Server mock backend.
// Locally: `npm run server` runs it at http:
//localhost:4000 (the default below).
// Deployed: VITE_API_BASE_URL is set in Netlify's environment variables to point 
// at the hosted JSON Server (e.g. your Render URL). 
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000' 
export const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' }, }) api.interceptors.response.use( (response) => response, (error) => { const message = error?.response?.data?.message || error?.message || 'Something went wrong talking to the server.' return Promise.reject(new Error(message)) }, )
