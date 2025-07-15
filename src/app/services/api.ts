import axios, { AxiosRequestConfig } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  __isRetryRequest?: boolean;
}

const customConfig: RetryConfig = {
  __isRetryRequest: false,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
};

const api = axios.create(customConfig);

export default api;