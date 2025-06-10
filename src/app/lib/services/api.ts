import axios, { AxiosRequestConfig } from 'axios';


const baseURL = process.env.NEXT_API_URL;

interface RetryConfig extends AxiosRequestConfig {
    __isRetryRequest?: boolean;
  }


  
const customConfig: RetryConfig = {
  __isRetryRequest: false,
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
};

const api = axios.create(customConfig);


export default api;