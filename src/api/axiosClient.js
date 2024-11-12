import axios from 'axios';
import { getAccessToken } from 'utils/utils';

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const token = getAccessToken(); // Lấy access token từ localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx causes this function to trigger
    return response.data;
  },
  function (error) {
    // Handle response error
    const { config, status, data } = error.response;

    const URLS = ['/auth/local/register', '/auth/local'];
    if (URLS.includes(config.url) && status === 400) {
      const errorList = data.data || [];
      const firstError = errorList.length > 0 ? errorList[0] : {};
      const messageList = firstError.messages || [];
      const firstMessage = messageList.length > 0 ? messageList[0] : {};
      throw new Error(firstMessage.message);
    }

    // // Check for 403 Forbidden error
    // if (status === 403) {
    //   // Optionally, you could remove the token if it's invalid or expired
    //   localStorage.removeItem('accessToken'); // Clear token

    //   // Redirect to login or show an appropriate message
    //   window.location.href = '/login'; // Redirect to login page
    //   // or show a message to the user if you don't want to redirect
    //   alert('You do not have permission to access this resource. Please log in again.');
    // }

    return Promise.reject(error);
  }
);

export default axiosClient;