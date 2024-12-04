import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  // timeout: 60000,
  // withCredentials: true,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Add any response modifications here
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Export the axios instance
export default axiosInstance
