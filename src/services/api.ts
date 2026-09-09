import axios from 'axios'

// JSON Server mock backend.
// Locally: `npm run server` runs it at http://localhost:4000 (the default below).
// Deployed: set VITE_API_BASE_URL in your host's environment variables to the
// public URL of your hosted JSON Server (e.g. a Render/Railway URL), or the
// deployed frontend won't be able to reach any backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong talking to the server.'
    return Promise.reject(new Error(message))
  },
)
