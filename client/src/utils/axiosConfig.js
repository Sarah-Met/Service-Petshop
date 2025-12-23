import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Request data:', config.data);

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token found and added to request:', token);
    } else {
      console.log('No token found in localStorage - proceeding without authentication');
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.log('Unauthorized access, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 
